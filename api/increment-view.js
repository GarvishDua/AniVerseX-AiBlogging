export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post ID is required' 
      });
    }

    // GitHub configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'GarvishDua';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'ink-splash-stories';
    const FILE_PATH = 'public/api/blogs.json';

    // Fetch current blog data from raw GitHub URL first (faster)
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${FILE_PATH}`;
    
    let blogData;
    let fileSha;

    try {
      // Try raw URL first for speed
      const rawResponse = await fetch(rawUrl, {
        cache: 'no-cache'
      });

      if (rawResponse.ok) {
        blogData = await rawResponse.json();
      } else {
        throw new Error('Raw fetch failed');
      }

      // Get file SHA for updating
      const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
      const shaResponse = await fetch(githubUrl, {
        headers: GITHUB_TOKEN ? {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        } : {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (shaResponse.ok) {
        const shaData = await shaResponse.json();
        fileSha = shaData.sha;
      } else {
        throw new Error(`GitHub API error: ${shaResponse.status}`);
      }

    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch blog data' 
      });
    }

    // Find the post and increment views
    const postIndex = blogData.posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Parse current views and increment
    const currentViews = blogData.posts[postIndex].views || '0';
    const viewCount = parseInt(currentViews.replace(/[^0-9]/g, '')) || 0;
    const newViewCount = viewCount + 1;
    
    // Format the new view count
    let formattedViews;
    if (newViewCount >= 1000000) {
      formattedViews = `${(newViewCount / 1000000).toFixed(1)}M`;
    } else if (newViewCount >= 1000) {
      formattedViews = `${(newViewCount / 1000).toFixed(1)}K`;
    } else {
      formattedViews = newViewCount.toString();
    }

    // Update the post
    blogData.posts[postIndex].views = formattedViews;

    // Update in GitHub if token is available
    if (GITHUB_TOKEN) {
      try {
        const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
        const updateResponse = await fetch(githubUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `📊 Increment view count for "${blogData.posts[postIndex].title}" to ${formattedViews}`,
            content: Buffer.from(JSON.stringify(blogData, null, 2)).toString('base64'),
            sha: fileSha
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`GitHub update failed: ${updateResponse.status}`);
        }

        console.log(`✅ View count updated for post ${postId}: ${formattedViews}`);
        
        return res.status(200).json({ 
          success: true, 
          message: 'View count updated successfully',
          newViewCount: formattedViews,
          postTitle: blogData.posts[postIndex].title
        });

      } catch (error) {
        console.error('Error updating GitHub:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update view count in GitHub' 
        });
      }
    } else {
      // Return success but indicate no GitHub update
      return res.status(200).json({ 
        success: true, 
        message: 'View count incremented (GitHub token not configured)',
        newViewCount: formattedViews,
        postTitle: blogData.posts[postIndex].title,
        warning: 'Changes not persisted - GitHub token required'
      });
    }

  } catch (error) {
    console.error('Increment view error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
