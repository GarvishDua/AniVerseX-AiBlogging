export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching blogs from GitHub API...');

    // Prepare headers with authentication if token is available
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ink-splash-stories-frontend',
    };

    // Add authentication if GitHub token is available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      console.log('Using GitHub token for authentication');
    } else {
      console.log('No GitHub token found, using public API');
    }

    // Try both GitHub API endpoints
    let blogData;
    let fetchMethod = 'unknown';

    // Method 1: Try raw GitHub URL first (simpler and often more reliable)
    try {
      console.log('Trying raw GitHub URL...');
      const rawUrl = 'https://raw.githubusercontent.com/GarvishDua/ink-splash-stories/main/public/api/blogs.json';
      const rawResponse = await fetch(rawUrl, {
        headers: headers,
        cache: 'no-cache'
      });

      if (rawResponse.ok) {
        blogData = await rawResponse.json();
        fetchMethod = 'raw-github';
        console.log(`Raw GitHub URL successful - ${blogData.posts?.length || 0} posts`);
      } else {
        throw new Error(`Raw GitHub URL failed: ${rawResponse.status}`);
      }
    } catch (rawError) {
      console.log('Raw GitHub URL failed, trying Contents API...', rawError.message);
      
      // Method 2: Try GitHub Contents API
      const response = await fetch(
        'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
        {
          headers,
          cache: 'no-cache'
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub Contents API error: ${response.status} ${response.statusText}`);
      }

      const githubData = await response.json();
      
      // Decode base64 content from GitHub API
      const decodedContent = Buffer.from(githubData.content, 'base64').toString('utf-8');
      blogData = JSON.parse(decodedContent);
      fetchMethod = 'contents-api';
      console.log(`GitHub Contents API successful - ${blogData.posts?.length || 0} posts`);
    }

    return res.status(200).json({
      success: true,
      data: blogData,
      source: fetchMethod,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in get-blogs API:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    
    // Return error response instead of fallbacks
    return res.status(500).json({
      success: false,
      error: `GitHub API failed: ${error.message}`,
      message: 'Unable to fetch blog data from GitHub API',
      timestamp: new Date().toISOString(),
      debug: {
        githubRepo: 'GarvishDua/ink-splash-stories',
        githubPath: 'public/api/blogs.json',
        hasToken: !!process.env.GITHUB_TOKEN
      }
    });
  }
}
