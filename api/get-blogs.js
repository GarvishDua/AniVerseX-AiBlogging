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

    // Fetch from GitHub API
    const response = await fetch(
      'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories-frontend',
        },
        // Add cache control to ensure fresh data
        cache: 'no-cache'
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const githubData = await response.json();
    
    // Decode base64 content from GitHub API
    const decodedContent = Buffer.from(githubData.content, 'base64').toString('utf-8');
    const blogData = JSON.parse(decodedContent);

    console.log(`Successfully fetched ${blogData.posts?.length || 0} blog posts`);

    // Add cache headers for client-side caching (but allow fresh data)
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    
    return res.status(200).json({
      success: true,
      data: blogData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in get-blogs API:', error);
    
    // Fallback to static file if GitHub API fails
    try {
      console.log('Attempting fallback to static file...');
      
      // In production, this would be the static file served by Vercel
      const fallbackData = {
        posts: [],
        categories: {
          anime: 0,
          manga: 0,
          marvel: 0
        }
      };

      return res.status(200).json({
        success: true,
        data: fallbackData,
        fallback: true,
        timestamp: new Date().toISOString()
      });

    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      return res.status(500).json({
        error: 'Failed to fetch blog data',
        details: error.message,
        fallbackError: fallbackError.message
      });
    }
  }
}
