import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-N8N-Webhook-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'n8n webhook endpoint is active!',
      endpoint: '/api/n8n-webhook',
      method: 'POST',
      contentType: 'application/json',
      requiredFields: ['title', 'content'],
      optionalFields: ['description', 'category', 'tags', 'readTime', 'featured'],
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      githubConfigured: !!process.env.GITHUB_TOKEN,
      webhookSecretConfigured: !!process.env.N8N_WEBHOOK_SECRET
    });
  }

  if (req.method === 'POST') {
    // Test endpoint - just echo back the data
    return res.status(200).json({
      message: 'Test successful! Data received by webhook endpoint.',
      receivedData: req.body,
      headers: {
        contentType: req.headers['content-type'],
        webhookSecret: req.headers['x-n8n-webhook-secret'] ? 'Present' : 'Not provided'
      },
      timestamp: new Date().toISOString(),
      note: 'This is the test endpoint. Use /api/n8n-webhook for actual blog creation.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
