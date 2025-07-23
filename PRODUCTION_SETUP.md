# Production Setup Instructions

## ✅ Deployment Status
Your serverless API has been successfully deployed to:
- **Production URL**: https://aniblogs-c033dcryq-garvishs-projects.vercel.app
- **API Endpoints**:
  - GET: https://aniblogs-c033dcryq-garvishs-projects.vercel.app/api/get-blogs
  - POST: https://aniblogs-c033dcryq-garvishs-projects.vercel.app/api/post-blog

## 🔧 Required Environment Setup

### 1. Configure GitHub Token on Vercel
To enable the POST API to write to your GitHub repository:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: `aniblogs`
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token
   - **Environment**: All (Production, Preview, Development)

### 2. GitHub Token Setup
1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click **Generate new token** → **Personal access tokens (classic)**
3. Set expiration and select these scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
4. Copy the generated token and add it to Vercel

## 🧪 Testing the API

### Test GET Endpoint
```bash
curl -X GET "https://aniblogs-c033dcryq-garvishs-projects.vercel.app/api/get-blogs"
```

### Test POST Endpoint (after setting up GITHUB_TOKEN)
```bash
curl -X POST "https://aniblogs-c033dcryq-garvishs-projects.vercel.app/api/post-blog" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Anime Review",
    "content": "This is an amazing anime that explores themes of friendship and adventure. The animation quality is top-notch and the story keeps you engaged throughout all episodes.",
    "category": "anime",
    "author": "Anime Enthusiast",
    "image": "https://example.com/anime-image.jpg",
    "tags": ["anime", "review", "adventure"]
  }'
```

## 📱 n8n Workflow Configuration

### Import the Workflow
1. Open your n8n instance
2. Click **Import** → **From File**
3. Upload the `n8n-serverless-workflow.json` file
4. Update the webhook URL in the HTTP Request node to:
   ```
   https://aniblogs-c033dcryq-garvishs-projects.vercel.app/api/post-blog
   ```

### Webhook URL
Your n8n webhook URL will be something like:
```
https://your-n8n-instance.com/webhook/blog-post
```

## 🎯 Complete Flow Testing

1. **Manual API Test**: Use the curl commands above
2. **n8n Test**: Send test data through your n8n webhook
3. **Frontend Test**: Your React app will automatically fetch from the API

## 🔄 Data Flow Summary

```
n8n Webhook → /api/post-blog → GitHub API → blogs.json
                     ↓
React App → /api/get-blogs → GitHub API → Display Posts
```

## 📋 Next Steps

1. ✅ Set up GITHUB_TOKEN on Vercel
2. ✅ Import n8n workflow
3. ✅ Test complete flow
4. ✅ Verify frontend data display

Your serverless architecture is now production-ready and matches the exact flow from your design-haven-blogs project!
