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
    // Prepare headers with minimal authentication
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ink-splash-stories-frontend',
    };

    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Direct fetch from raw GitHub URL (fastest method)
    const rawUrl = 'https://raw.githubusercontent.com/GarvishDua/ink-splash-stories/main/public/api/blogs.json';
    const response = await fetch(rawUrl, {
      headers,
      cache: 'no-cache'
    });

    if (response.ok) {
      const blogData = await response.json();
      
      // Add efficient caching headers
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      
      return res.status(200).json({
        success: true,
        data: blogData,
        source: 'raw-github',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`GitHub API error: ${response.status}`);
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Failed to fetch blog data: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
}
