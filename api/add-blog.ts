import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Basic health check for GET requests
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Blog API endpoint is working',
      timestamp: new Date().toISOString(),
      endpoints: {
        POST: 'Add new blog post'
      }
    });
  }

  // Only allow POST for adding blogs
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to add blogs.' });
  }

  try {
    // Basic validation
    const body = req.body;
    
    if (!body) {
      return res.status(400).json({ 
        error: 'Request body is required',
        example: {
          title: "Your Blog Title",
          content: "Your blog content...",
          category: "anime"
        }
      });
    }

    if (!body.title || !body.content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'content'],
        received: Object.keys(body),
        example: {
          title: "Your Blog Title",
          content: "Your blog content here...",
          description: "Brief description (optional)",
          category: "anime",
          tags: ["tag1", "tag2"],
          featured: false
        }
      });
    }

    // GitHub configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'GarvishDua';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'ink-splash-stories';
    const GITHUB_PATH = 'public/api/blogs.json';

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'GitHub token not configured',
        note: 'Please add GITHUB_TOKEN to environment variables'
      });
    }

    // Step 1: Get current file from GitHub
    console.log('Fetching current blog data from GitHub...');
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories'
        }
      }
    );

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('GitHub fetch error:', getResponse.status, errorText);
      return res.status(500).json({ 
        error: 'Failed to fetch from GitHub',
        details: `${getResponse.status}: ${errorText}`,
        hint: 'Check if GITHUB_TOKEN has repo access'
      });
    }

    const fileData = await getResponse.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const currentBlogData = JSON.parse(currentContent);

    // Step 2: Create new blog post
    const newPost = {
      id: `post-${Date.now()}`,
      title: body.title,
      description: body.description || body.title.substring(0, 150) + '...',
      content: body.content,
      category: body.category || 'anime',
      readTime: body.readTime || estimateReadTime(body.content),
      publishDate: body.publishDate || new Date().toISOString().split('T')[0],
      views: body.views || '0',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
      featured: body.featured === true || body.featured === 'true'
    };

    // Step 3: Add to posts array
    const updatedBlogData = {
      ...currentBlogData,
      posts: [newPost, ...currentBlogData.posts]
    };

    // Step 4: Update category counts
    const categoryCounts: { [key: string]: number } = {};
    updatedBlogData.posts.forEach((post: any) => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    updatedBlogData.categories.forEach((category: any) => {
      category.count = categoryCounts[category.name] || 0;
    });

    // Step 5: Update GitHub
    console.log('Updating GitHub with new blog post...');
    const newContent = Buffer.from(JSON.stringify(updatedBlogData, null, 2)).toString('base64');
    
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ink-splash-stories'
        },
        body: JSON.stringify({
          message: `Add new blog post: ${newPost.title}`,
          content: newContent,
          sha: fileData.sha
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('GitHub update error:', updateResponse.status, errorText);
      return res.status(500).json({ 
        error: 'Failed to update GitHub',
        details: `${updateResponse.status}: ${errorText}`
      });
    }

    const updateResult = await updateResponse.json();
    console.log('Successfully updated GitHub:', updateResult.commit?.sha);

    return res.status(201).json({
      success: true,
      message: 'Blog post added successfully!',
      post: newPost,
      totalPosts: updatedBlogData.posts.length,
      commit: updateResult.commit?.sha,
      note: 'Website will update automatically'
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Helper function
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
