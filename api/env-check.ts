import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Environment check endpoint',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      hasGithubToken: !!process.env.GITHUB_TOKEN,
      githubTokenLength: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
      githubOwner: process.env.GITHUB_OWNER || 'Not set',
      githubRepo: process.env.GITHUB_REPO || 'Not set',
      hasWebhookSecret: !!process.env.N8N_WEBHOOK_SECRET,
      vercelRegion: process.env.VERCEL_REGION || 'Not set'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
