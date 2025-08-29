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
    const { title, content, author, category, tags, featured, thumbnail, description, readTime, publishDate, views } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Process and structure the blog data
    const processedBlog = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      description: description || (content.substring(0, 150) + (content.length > 150 ? '...' : '')),
      content: content,
      category: category?.toLowerCase() || 'anime',
      author: author || 'Admin',
      readTime: readTime || estimateReadTime(content),
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      views: views || generateRandomViews(),
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : ['blog']),
      featured: featured === true || featured === 'true' || false,
      ...(thumbnail && { thumbnail: thumbnail })
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
          'User-Agent': 'aniversex-api'
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
          'User-Agent': 'aniversex-api'
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

// Helper function to generate random view count
function generateRandomViews() {
  const randomNum = Math.floor(Math.random() * 5000) + 1000; // Random between 1000-6000
  return `${(randomNum / 1000).toFixed(1)}k`; // Always format as "1.0k", "2.5k", etc.
}
