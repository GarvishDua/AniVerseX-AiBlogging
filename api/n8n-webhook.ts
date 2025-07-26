import { VercelRequest, VercelResponse } from '@vercel/node';

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'GarvishDua';
const GITHUB_REPO = process.env.GITHUB_REPO || 'ink-splash-stories';
const GITHUB_PATH = 'public/blogs.json';
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET; // Optional security

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
  slug?: string;
  excerpt?: string;
}

interface BlogData {
  posts: BlogPost[];
  categories: any[];
}

// Helper function to get blogs from GitHub
async function getBlogsFromGitHub(): Promise<BlogData> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return {
      posts: [],
      categories: [
        { name: "Anime Reviews", count: 0, color: "primary" },
        { name: "Manga", count: 0, color: "accent" },
        { name: "Marvel & Comics", count: 0, color: "secondary" },
        { name: "Fan Theories & Explained", count: 0, color: "accent" }
      ]
    };
  }
}

// Helper function to get file SHA
async function getFileSHA(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error getting file SHA:', error);
    return null;
  }
}

// Helper function to update blogs in GitHub
async function updateBlogsInGitHub(blogData: BlogData, sha: string, commitMessage: string = 'Update blog via n8n webhook'): Promise<boolean> {
  try {
    const content = Buffer.from(JSON.stringify(blogData, null, 2)).toString('base64');
    
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: content,
          sha: sha,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error updating GitHub:', error);
    return false;
  }
}

// Helper function to update category counts
function updateCategoryCounts(blogData: BlogData): BlogData {
  const categoryCounts: { [key: string]: number } = {};
  
  // Count posts by category
  blogData.posts.forEach(post => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  // Update category counts
  blogData.categories.forEach(category => {
    category.count = categoryCounts[category.name] || 0;
  });

  return blogData;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-N8N-Webhook-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Optional: Verify webhook secret from n8n
    if (N8N_WEBHOOK_SECRET && req.headers['x-n8n-webhook-secret'] !== N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid webhook secret' });
    }

    const incomingData = req.body;
    console.log('Received n8n webhook data:', incomingData);

    // Validate required fields
    if (!incomingData.title || !incomingData.content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title and content are required',
        received: Object.keys(incomingData)
      });
    }

    // Get current blog data
    const currentBlogData = await getBlogsFromGitHub();
    const sha = await getFileSHA();

    if (!sha) {
      return res.status(500).json({ error: 'Could not get file SHA from GitHub' });
    }

    // Helper function to generate random view count
    const generateRandomViews = (): string => {
      const randomNum = Math.floor(Math.random() * 5000) + 1000; // Random between 1000-6000
      return `${(randomNum / 1000).toFixed(1)}k`; // Always format as "1.0k", "2.5k", etc.
    };

    // Prepare new blog post with defaults
    const newPost: BlogPost = {
      id: incomingData.id || `n8n-${Date.now()}`,
      title: incomingData.title,
      description: incomingData.description || incomingData.title.substring(0, 150) + '...',
      content: incomingData.content,
      category: incomingData.category || 'Anime Reviews',
      readTime: incomingData.readTime || '5 min read',
      publishDate: incomingData.publishDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      views: incomingData.views || generateRandomViews(),
      tags: Array.isArray(incomingData.tags) ? incomingData.tags : (incomingData.tags ? [incomingData.tags] : []),
      featured: incomingData.featured === true || incomingData.featured === 'true',
      slug: incomingData.slug || generateSlug(incomingData.title),
      excerpt: incomingData.excerpt || incomingData.description || incomingData.title.substring(0, 150) + '...'
    };

    // Add new post to the beginning of the array
    const updatedBlogData = {
      ...currentBlogData,
      posts: [newPost, ...currentBlogData.posts]
    };

    // Update category counts
    const finalBlogData = updateCategoryCounts(updatedBlogData);

    // Save to GitHub
    const updated = await updateBlogsInGitHub(
      finalBlogData, 
      sha, 
      `Add new blog post: ${newPost.title} (via n8n)`
    );

    if (updated) {
      return res.status(201).json({ 
        success: true,
        message: 'Blog post added successfully via n8n webhook',
        post: newPost,
        totalPosts: finalBlogData.posts.length
      });
    } else {
      return res.status(500).json({ error: 'Failed to save blog post to GitHub' });
    }

  } catch (error) {
    console.error('n8n webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
