# 🔗 n8n Integration Guide

Your anime blog is now configured to receive new blog posts from n8n workflows via webhooks!

## 📡 Webhook Endpoint

**Production URL**: `https://your-app.vercel.app/api/n8n-webhook`
**Method**: `POST`
**Content-Type**: `application/json`

## 🔧 n8n Workflow Configuration

### 1. HTTP Request Node Setup
```
Method: POST
URL: https://your-app.vercel.app/api/n8n-webhook
Headers:
  Content-Type: application/json
  X-N8N-Webhook-Secret: your_secret_key (optional)
```

### 2. Required Data Format
```json
{
  "title": "Your Blog Post Title",
  "content": "Full blog post content with **markdown** support",
  "description": "Short description of the blog post",
  "category": "Anime Reviews",
  "tags": ["anime", "review", "analysis"],
  "readTime": "5 min read",
  "featured": false
}
```

### 3. Optional Fields
```json
{
  "id": "custom-post-id",
  "slug": "custom-url-slug",
  "excerpt": "Custom excerpt text",
  "publishDate": "Dec 25, 2024",
  "views": "1.2K"
}
```

## 🛡️ Security Configuration

### Environment Variables (Add to Vercel)
```
N8N_WEBHOOK_SECRET=your_secret_webhook_key
```

### Webhook Security Header
Add this header in your n8n HTTP Request node:
```
X-N8N-Webhook-Secret: your_secret_webhook_key
```

## 📝 Example n8n Workflow

### Scenario: AI-Generated Blog Posts
1. **Trigger**: Schedule/Manual
2. **AI Node**: Generate blog content
3. **Data Transform**: Format for webhook
4. **HTTP Request**: Send to webhook endpoint

### Data Transformation Example
```javascript
// In your n8n Function node
return {
  title: $input.first().json.ai_title,
  content: $input.first().json.ai_content,
  description: $input.first().json.ai_summary,
  category: "Anime Reviews",
  tags: $input.first().json.ai_tags.split(','),
  featured: Math.random() > 0.8, // 20% chance of being featured
  readTime: Math.ceil($input.first().json.ai_content.split(' ').length / 200) + " min read"
};
```

## 🔄 Automatic Category Management

The webhook automatically:
- ✅ Updates category post counts
- ✅ Generates URL-friendly slugs
- ✅ Sets default values for missing fields
- ✅ Commits changes to GitHub
- ✅ Maintains blog data structure

## 📊 Response Format

### Success Response (201)
```json
{
  "success": true,
  "message": "Blog post added successfully via n8n webhook",
  "post": {
    "id": "n8n-1640995200000",
    "title": "Your Blog Post Title",
    "slug": "your-blog-post-title",
    // ... other post data
  },
  "totalPosts": 13
}
```

### Error Response (400/500)
```json
{
  "error": "Missing required fields: title and content are required",
  "received": ["description", "category"]
}
```

## 🧪 Testing the Webhook

### Using curl
```bash
curl -X POST https://your-app.vercel.app/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -H "X-N8N-Webhook-Secret: your_secret" \
  -d '{
    "title": "Test Blog Post",
    "content": "This is a test blog post content with **markdown** support!",
    "description": "A test post to verify n8n integration",
    "category": "Anime Reviews",
    "tags": ["test", "n8n"]
  }'
```

### Using n8n Test
1. Set up HTTP Request node with the configuration above
2. Add test data in the node
3. Execute the workflow
4. Check your deployed site for the new post

## 🔍 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check webhook secret
2. **400 Bad Request**: Verify required fields (title, content)
3. **500 Server Error**: Check GitHub token permissions

### Debug Tips
- Check Vercel function logs for detailed errors
- Verify environment variables are set
- Test with minimal required data first

## 🎯 Migration from Old Setup

If you had n8n pointing to your old server endpoint:

**Old**: `http://localhost:3001/api/blogs`
**New**: `https://your-app.vercel.app/api/n8n-webhook`

Update your n8n workflow with the new endpoint and you're ready to go!

## ✨ Benefits of New Setup

- ✅ **Serverless**: No server maintenance required
- ✅ **Scalable**: Handles traffic spikes automatically  
- ✅ **Reliable**: 99.9% uptime with Vercel
- ✅ **Version Control**: All content stored in GitHub
- ✅ **Global CDN**: Fast content delivery worldwide

Your n8n workflows can now seamlessly add content to your anime blog! 🚀
