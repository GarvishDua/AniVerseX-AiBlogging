export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content, author, category, tags, featured } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Process and structure the blog data
    const processedBlog = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      description: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
      content: content,
      category: category?.toLowerCase() || 'anime',
      author: author || 'Admin',
      readTime: estimateReadTime(content),
      publishDate: new Date().toISOString().split('T')[0],
      views: '0',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : ['blog']),
      featured: featured === true || featured === 'true' || false
    };

    console.log('Processing blog post:', { title, category: processedBlog.category });

    // Fetch current blogs from GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const githubResponse = await fetch(
      'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories-api'
        }
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API error: ${githubResponse.status}`);
    }

    const githubData = await githubResponse.json();
    const currentContent = Buffer.from(githubData.content, 'base64').toString('utf-8');
    const blogData = JSON.parse(currentContent);

    // Add new blog post to the beginning
    const updatedBlogData = {
      ...blogData,
      posts: [processedBlog, ...blogData.posts]
    };

    // Update the file on GitHub
    const updateResponse = await fetch(
      'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ink-splash-stories-api'
        },
        body: JSON.stringify({
          message: `Add new blog post: ${processedBlog.title}`,
          content: Buffer.from(JSON.stringify(updatedBlogData, null, 2)).toString('base64'),
          sha: githubData.sha
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update GitHub: ${updateResponse.status} - ${errorText}`);
    }

    console.log('Successfully added blog post:', processedBlog.title);

    return res.status(200).json({
      success: true,
      message: 'Blog post added successfully',
      blog: processedBlog
    });

  } catch (error) {
    console.error('Error in post-blog API:', error);
    return res.status(500).json({
      error: 'Failed to add blog post',
      details: error.message
    });
  }
}

// Helper function to estimate read time
function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
