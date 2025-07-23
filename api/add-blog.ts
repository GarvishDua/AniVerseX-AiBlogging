import { VercelRequest, VercelResponse } from '@vercel/node';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  views: string;
  tags: string[];
  content: string;
  featured: boolean;
}

interface Category {
  name: string;
  count: number;
  color: "primary" | "accent" | "secondary";
}

interface BlogData {
  posts: BlogPost[];
  categories: Category[];
}

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'GarvishDua';
const GITHUB_REPO = process.env.GITHUB_REPO || 'ink-splash-stories';
const GITHUB_PATH = 'public/api/blogs.json';

// Helper function to get current blogs from GitHub
async function getBlogsFromGitHub(): Promise<{ data: BlogData; sha: string } | null> {
  try {
    console.log('Fetching from GitHub...');
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories-blog'
        },
      }
    );

    if (!response.ok) {
      console.error('GitHub API error:', response.status, await response.text());
      return null;
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const data = JSON.parse(content);
    
    return { data, sha: fileData.sha };
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return null;
  }
}

// Helper function to update blogs in GitHub
async function updateBlogsInGitHub(blogData: BlogData, sha: string): Promise<boolean> {
  try {
    console.log('Updating GitHub...');
    const content = Buffer.from(JSON.stringify(blogData, null, 2)).toString('base64');
    
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ink-splash-stories-blog'
        },
        body: JSON.stringify({
          message: `Add new blog post: ${blogData.posts[0]?.title || 'New Post'}`,
          content: content,
          sha: sha,
        }),
      }
    );

    const result = await response.json();
    console.log('GitHub update result:', response.status, result);
    return response.ok;
  } catch (error) {
    console.error('Error updating GitHub:', error);
    return false;
  }
}

// Helper function to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper function to update category counts
function updateCategoryCounts(blogData: BlogData): BlogData {
  const categoryCounts: { [key: string]: number } = {};
  
  blogData.posts.forEach(post => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  blogData.categories.forEach(category => {
    category.count = categoryCounts[category.name] || 0;
  });

  return blogData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Validate GitHub token
    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' });
    }

    const incomingData = req.body;
    console.log('Received blog data:', JSON.stringify(incomingData, null, 2));

    // Validate required fields
    if (!incomingData.title || !incomingData.content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title and content are required',
        received: Object.keys(incomingData || {}),
        example: {
          title: "Your Blog Title",
          content: "Your blog content here...",
          description: "Brief description (optional)",
          category: "anime", // or "manga" or "marvel"
          tags: ["tag1", "tag2"],
          featured: false
        }
      });
    }

    // Get current blog data from GitHub
    const githubResult = await getBlogsFromGitHub();
    if (!githubResult) {
      return res.status(500).json({ error: 'Failed to fetch current blog data from GitHub' });
    }

    const { data: currentBlogData, sha } = githubResult;

    // Create new blog post
    const newPost: BlogPost = {
      id: incomingData.id || `post-${Date.now()}`,
      title: incomingData.title,
      description: incomingData.description || incomingData.title.substring(0, 150) + '...',
      content: incomingData.content,
      category: incomingData.category || 'anime',
      readTime: incomingData.readTime || estimateReadTime(incomingData.content),
      publishDate: incomingData.publishDate || new Date().toISOString().split('T')[0],
      views: incomingData.views || '0',
      tags: Array.isArray(incomingData.tags) ? incomingData.tags : (incomingData.tags ? [incomingData.tags] : []),
      featured: incomingData.featured === true || incomingData.featured === 'true'
    };

    // Add new post to the beginning of the array
    const updatedBlogData = {
      ...currentBlogData,
      posts: [newPost, ...currentBlogData.posts]
    };

    // Update category counts
    const finalBlogData = updateCategoryCounts(updatedBlogData);

    // Save to GitHub
    const success = await updateBlogsInGitHub(finalBlogData, sha);

    if (success) {
      return res.status(201).json({ 
        success: true,
        message: 'Blog post added successfully to GitHub',
        post: newPost,
        totalPosts: finalBlogData.posts.length,
        note: 'Website will update automatically within a few minutes'
      });
    } else {
      return res.status(500).json({ error: 'Failed to save blog post to GitHub' });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
