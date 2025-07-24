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
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    
    // Fallback to static file if GitHub API fails
    try {
      console.log('Attempting fallback to static file...');
      
      // Try to read the static file directly from the public folder
      const fs = require('fs');
      const path = require('path');
      
      // In Vercel, static files are in the root
      const staticFilePath = path.join(process.cwd(), 'public', 'api', 'blogs.json');
      console.log('Looking for static file at:', staticFilePath);
      
      if (fs.existsSync(staticFilePath)) {
        const fileContent = fs.readFileSync(staticFilePath, 'utf8');
        const staticData = JSON.parse(fileContent);
        console.log(`Static file found with ${staticData.posts?.length || 0} posts`);
        
        return res.status(200).json({
          success: true,
          data: staticData,
          source: 'static-file',
          timestamp: new Date().toISOString()
        });
      } else {
        console.log('Static file not found at:', staticFilePath);
      }
      
      // In production, this would be the static file served by Vercel
      const fallbackData = {
        posts: [],
        categories: [] // Changed from object to array to match expected structure
      };

      return res.status(200).json({
        success: true,
        data: fallbackData,
        fallback: true,
        message: 'GitHub API failed - using empty fallback',
        timestamp: new Date().toISOString()
      });

    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      // Last resort: return empty but properly structured data
      const emptyData = {
        posts: [],
        categories: [] // This should be an array, not an object
      };
      
      return res.status(200).json({
        success: true,
        data: emptyData,
        fallback: true,
        message: 'No data available - using empty fallback',
        timestamp: new Date().toISOString()
      });
    }
  }
}
