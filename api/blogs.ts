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
    // Fallback to default data
    return {
      posts: [],
      categories: []
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

        // Update GitHub
        const sha = await getFileSHA();
        if (sha) {
          const updated = await updateBlogsInGitHub(blogData, sha);
          if (updated) {
            return res.status(201).json({ message: 'Post created successfully', post: newPost });
          }
        }

        return res.status(500).json({ error: 'Failed to save post' });

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

        // Update GitHub
        const deleteSha = await getFileSHA();
        if (deleteSha) {
          const updated = await updateBlogsInGitHub(blogData, deleteSha);
          if (updated) {
            return res.status(200).json({ message: 'Post deleted successfully' });
          }
        }

        return res.status(500).json({ error: 'Failed to delete post' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
