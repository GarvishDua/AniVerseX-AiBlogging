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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
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
  
  // Count posts by category
  blogData.posts.forEach(post => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  // Update category counts
  blogData.categories.forEach(category => {
    if (category.name === 'anime') {
      category.count = categoryCounts['anime'] || 0;
    } else if (category.name === 'manga') {
      category.count = categoryCounts['manga'] || 0;
    } else if (category.name === 'marvel') {
      category.count = categoryCounts['marvel'] || 0;
    }
  });

  return blogData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-webhook-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Optional: Verify webhook secret
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    if (webhookSecret && req.headers['x-webhook-secret'] !== webhookSecret) {
      return res.status(401).json({ error: 'Unauthorized: Invalid webhook secret' });
    }

    const incomingData = req.body;
    console.log('Received n8n webhook data:', JSON.stringify(incomingData, null, 2));

    // Validate required fields
    if (!incomingData.title || !incomingData.content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title and content are required',
        received: Object.keys(incomingData),
        example: {
          title: "Your Blog Title",
          content: "Your blog content here...",
          description: "Brief description",
          category: "anime", // or "manga" or "marvel"
          tags: ["tag1", "tag2"],
          featured: false
        }
      });
    }

    // Since we're using static JSON files now, we'll just log the data
    // and return success. In a real implementation, you'd want to:
    // 1. Read the current blogs.json
    // 2. Add the new post
    // 3. Write back to blogs.json
    // But since it's a static file in Vercel, we can't modify it directly

    // Prepare new blog post with defaults
    const newPost: BlogPost = {
      id: incomingData.id || `n8n-${Date.now()}`,
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

    // For now, since we're using static JSON, we'll return the formatted post
    // The user will need to manually add it to the JSON file
    console.log('New blog post formatted:', JSON.stringify(newPost, null, 2));

    return res.status(200).json({ 
      success: true,
      message: 'Webhook received successfully. Blog post formatted.',
      note: 'Since using static JSON files, please manually add this post to /public/api/blogs.json',
      formattedPost: newPost,
      instructions: {
        step1: 'Copy the formattedPost object above',
        step2: 'Add it to the "posts" array in /public/api/blogs.json',
        step3: 'Update category counts accordingly',
        step4: 'Redeploy to see changes'
      }
    });

  } catch (error) {
    console.error('n8n webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
