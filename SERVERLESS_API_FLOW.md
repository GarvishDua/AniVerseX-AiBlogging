# Anime Blog Serverless API Flow

## 🚀 Complete Serverless Architecture

This project implements a complete serverless architecture similar to your design-haven-blogs project:

```
n8n Workflow
    ↓ HTTP POST
https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/post-blog
    ↓ Vercel Router
/api/post-blog.js (Serverless Function)
    ↓ Process Data
{title, content, author} → {id, slug, category, tags, excerpt...}
    ↓ GitHub API
https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json
    ↓ File Update
blogs.json updated in repository
    ↓ Frontend Request
https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/get-blogs
    ↓ Serverless Function
/api/get-blogs.js fetches from GitHub
    ↓ React Frontend
Website displays updated content
```

## 📡 API Endpoints

### 1. POST /api/post-blog
**Purpose**: Add new blog posts
**Method**: POST
**URL**: `https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/post-blog`

**Request Body**:
```json
{
  "title": "My Awesome Anime Review",
  "content": "# Amazing Anime Episode\n\nThis episode was fantastic because...",
  "author": "Admin",
  "category": "anime",
  "tags": ["anime", "review", "action"],
  "featured": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Blog post added successfully",
  "blog": {
    "id": "post-1234567890",
    "title": "My Awesome Anime Review",
    "description": "Amazing Anime Episode This episode was fantastic because...",
    "content": "# Amazing Anime Episode\n\nThis episode was fantastic because...",
    "category": "anime",
    "author": "Admin",
    "readTime": "2 min read",
    "publishDate": "2025-07-24",
    "views": "0",
    "tags": ["anime", "review", "action"],
    "featured": false
  }
}
```

### 2. GET /api/get-blogs
**Purpose**: Fetch all blog posts
**Method**: GET
**URL**: `https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/get-blogs`

**Response**:
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "categories": {...}
  },
  "timestamp": "2025-07-24T12:00:00.000Z"
}
```

## 🔧 n8n Workflow Setup

### Import Workflow
1. Download `n8n-serverless-workflow.json`
2. Import into your n8n instance
3. The webhook URL will be automatically generated

### Webhook Usage
Send POST requests to your n8n webhook with this payload:
```json
{
  "title": "Blog Post Title",
  "content": "Blog content with markdown support",
  "author": "Author Name",
  "category": "anime|manga|marvel",
  "tags": ["tag1", "tag2"],
  "featured": true|false
}
```

## 🛡️ Environment Variables

Make sure these are set in your Vercel project:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

## 🔄 Data Flow

1. **n8n receives webhook** → Validates and processes data
2. **n8n calls /api/post-blog** → Serverless function processes the blog
3. **Serverless function calls GitHub API** → Updates blogs.json in repository
4. **Frontend calls /api/get-blogs** → Serverless function fetches latest data
5. **GitHub API responds** → Fresh data delivered to frontend
6. **React updates UI** → User sees new blog post immediately

## ✅ Benefits

- **Real-time updates**: Changes appear immediately
- **Serverless scaling**: Handles traffic spikes automatically
- **GitHub versioning**: All blog data is version controlled
- **Fallback system**: Multiple layers of error handling
- **Type safety**: Full TypeScript support
- **CORS enabled**: Works from any domain

## 🚀 Testing

### Test POST endpoint:
```bash
curl -X POST https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/post-blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "content": "This is a test blog post content",
    "category": "anime"
  }'
```

### Test GET endpoint:
```bash
curl https://aniblogs-6fbrul192-garvishs-projects.vercel.app/api/get-blogs
```

## 📱 Frontend Integration

The React frontend automatically uses the serverless API through the `useBlogData` hook, which:

1. Calls `/api/get-blogs` on component mount
2. Processes and transforms the data
3. Updates the UI with proper error handling
4. Provides fallback to static files if needed

Your blog is now fully serverless and production-ready! 🎉
