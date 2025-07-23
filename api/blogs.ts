import { VercelRequest, VercelResponse } from '@vercel/node';

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'GarvishDua';
const GITHUB_REPO = process.env.GITHUB_REPO || 'ink-splash-stories';
const GITHUB_PATH = 'public/blogs.json';

interface BlogData {
  posts: any[];
  categories: any[];
}

// Helper function to get blogs from GitHub
async function getBlogsFromGitHub(): Promise<BlogData> {
  try {
    // Check if we have the required environment variables
    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not found in environment variables');
      throw new Error('GitHub token not configured');
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AnimeBlogs-Vercel-App',
        },
      }
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    // Return fallback data with sample posts
    return {
      posts: [
        {
          id: "1",
          title: "Welcome to AnimeBlogs",
          description: "Your serverless anime blog is now live!",
          category: "Anime Reviews",
          readTime: "2 min read",
          publishDate: "Jul 23, 2025",
          views: "1.2K",
          tags: ["welcome", "anime"],
          content: "Welcome to your new serverless anime blog! This is a fallback post while we connect to GitHub.",
          featured: true
        }
      ],
      categories: [
        { name: "Anime Reviews", count: 1, color: "primary" },
        { name: "Manga", count: 0, color: "accent" },
        { name: "Marvel & Comics", count: 0, color: "secondary" },
        { name: "Fan Theories & Explained", count: 0, color: "accent" }
      ]
    };
  }
}

// Helper function to update blogs in GitHub
async function updateBlogsInGitHub(blogData: BlogData, sha: string): Promise<boolean> {
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
          message: 'Update blogs via API',
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log(`API Request: ${req.method} ${req.url}`);
    console.log('Environment check:', {
      hasGithubToken: !!GITHUB_TOKEN,
      githubOwner: GITHUB_OWNER,
      githubRepo: GITHUB_REPO
    });

    const blogData = await getBlogsFromGitHub();

    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Get specific blog post
          const post = blogData.posts.find(p => p.id === req.query.id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(200).json(post);
        } else {
          // Get all blogs
          return res.status(200).json(blogData);
        }

      case 'POST':
        // Add new blog post
        const newPost = req.body;
        
        if (!newPost.title || !newPost.content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        // Generate ID if not provided
        if (!newPost.id) {
          newPost.id = Date.now().toString();
        }

        // Add timestamp
        newPost.publishDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        // Add to posts array
        blogData.posts.unshift(newPost);

        // Update categories count if needed
        const category = blogData.categories.find(c => c.name === newPost.category);
        if (category) {
          category.count += 1;
        }

        // Try to update GitHub (will fallback if GitHub not available)
        try {
          const sha = await getFileSHA();
          if (sha) {
            const updated = await updateBlogsInGitHub(blogData, sha);
            if (updated) {
              return res.status(201).json({ message: 'Post created successfully', post: newPost });
            }
          }
        } catch (error) {
          console.error('GitHub update failed:', error);
        }

        return res.status(201).json({ 
          message: 'Post created successfully (GitHub sync may have failed)', 
          post: newPost 
        });

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'Post ID is required' });
        }

        const postIndex = blogData.posts.findIndex(p => p.id === req.query.id);
        if (postIndex === -1) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const deletedPost = blogData.posts[postIndex];
        blogData.posts.splice(postIndex, 1);

        // Update categories count
        const categoryToUpdate = blogData.categories.find(c => c.name === deletedPost.category);
        if (categoryToUpdate && categoryToUpdate.count > 0) {
          categoryToUpdate.count -= 1;
        }

        // Try to update GitHub
        try {
          const deleteSha = await getFileSHA();
          if (deleteSha) {
            const updated = await updateBlogsInGitHub(blogData, deleteSha);
            if (updated) {
              return res.status(200).json({ message: 'Post deleted successfully' });
            }
          }
        } catch (error) {
          console.error('GitHub update failed:', error);
        }

        return res.status(200).json({ 
          message: 'Post deleted successfully (GitHub sync may have failed)' 
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
