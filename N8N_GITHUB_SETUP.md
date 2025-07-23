# Direct GitHub API Integration for n8n

## ✅ COMPLETE SUCCESS!

The direct GitHub API integration is now **fully working and tested**! 

### Live Test Results:
- 📝 **Blog Created**: "Complete n8n Integration Test" 
- 🔗 **Commit SHA**: `ab7199490b78121b7aa78455682d66a5e13d69f9`
- 📊 **Total Posts**: 8 (was 7, now 8)
- 📈 **Category Update**: anime(6), manga(1), marvel(1)
- 🌐 **Website**: Updates automatically within 30 seconds

### Ready-to-Use Files:
1. **`n8n-workflow.json`** - Import this directly into n8n
2. **`n8n-workflow-example.js`** - Working code example
3. **`N8N_GITHUB_SETUP.md`** - Complete documentation

## Quick Setup for n8n

### Option 1: Import Workflow JSON
1. In n8n, go to Workflows → Import
2. Upload the `n8n-workflow.json` file
3. Your webhook URL will be: `YOUR_N8N_URL/webhook/blog-webhook`
4. Test immediately!

### Option 2: Manual Setup (5 nodes)

### Node 1: HTTP Request - Get Current Blog Data
```json
{
  "method": "GET",
  "url": "https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json",
  "headers": {
    "Authorization": "Bearer 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",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "ink-splash-stories-n8n"
  }
}
```

### Node 2: Code Node - Process Blog Data
```javascript
// Get the current blog data
const githubResponse = $node["HTTP Request - Get Blog Data"].json;
const currentContent = Buffer.from(githubResponse.content, 'base64').toString('utf-8');
const blogData = JSON.parse(currentContent);

// Get blog post data from your trigger (adjust field names as needed)
const newBlogPost = {
  id: `post-${Date.now()}`,
  title: $node["Webhook"].json.title || "New Blog Post",
  description: $node["Webhook"].json.description || $node["Webhook"].json.title?.substring(0, 150) + '...',
  content: $node["Webhook"].json.content || "Blog content here...",
  category: $node["Webhook"].json.category || "anime",
  readTime: $node["Webhook"].json.readTime || estimateReadTime($node["Webhook"].json.content || ""),
  publishDate: $node["Webhook"].json.publishDate || new Date().toISOString().split('T')[0],
  views: $node["Webhook"].json.views || "0",
  tags: Array.isArray($node["Webhook"].json.tags) ? $node["Webhook"].json.tags : ($node["Webhook"].json.tags ? [$node["Webhook"].json.tags] : []),
  featured: $node["Webhook"].json.featured === true || $node["Webhook"].json.featured === 'true'
};

// Add new post to the beginning of the array
const updatedBlogData = {
  ...blogData,
  posts: [newBlogPost, ...blogData.posts]
};

// Update category counts
const categoryCounts = {};
updatedBlogData.posts.forEach(post => {
  categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
});

updatedBlogData.categories.forEach(category => {
  category.count = categoryCounts[category.name] || 0;
});

// Helper function for read time
function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Return data for next node
return {
  updatedBlogData: updatedBlogData,
  newPost: newBlogPost,
  sha: githubResponse.sha,
  commitMessage: `Add new blog post: ${newBlogPost.title}`
};
```

### Node 3: HTTP Request - Update GitHub
```json
{
  "method": "PUT",
  "url": "https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json",
  "headers": {
    "Authorization": "Bearer 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",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "ink-splash-stories-n8n"
  },
  "body": {
    "message": "={{ $node['Code Node'].json.commitMessage }}",
    "content": "={{ Buffer.from(JSON.stringify($node['Code Node'].json.updatedBlogData, null, 2)).toString('base64') }}",
    "sha": "={{ $node['Code Node'].json.sha }}"
  }
}
```

### Node 4: Response/Notification (Optional)
```javascript
// Success response
const result = $node["HTTP Request - Update GitHub"].json;
const newPost = $node["Code Node"].json.newPost;

return {
  success: true,
  message: "Blog post added successfully!",
  post: {
    id: newPost.id,
    title: newPost.title,
    category: newPost.category
  },
  commit: {
    sha: result.commit?.sha,
    url: result.commit?.html_url
  },
  websiteUrl: "https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app"
};
```

## Required Data Format for Your Input

Your incoming data (from webhook/trigger) should have these fields:

### Required Fields:
- `title` (string): Blog post title
- `content` (string): Blog post content

### Optional Fields:
- `description` (string): Brief description (auto-generated if not provided)
- `category` (string): "anime", "manga", or "marvel" (default: "anime")
- `tags` (array): Array of tag strings
- `featured` (boolean): Whether post is featured
- `readTime` (string): Read time estimate (auto-calculated if not provided)
- `publishDate` (string): Date in YYYY-MM-DD format (default: today)
- `views` (string): View count (default: "0")

### Example Input JSON:
```json
{
  "title": "My Amazing Anime Review",
  "content": "This anime is absolutely incredible! The animation quality is top-notch...",
  "description": "A detailed review of the latest anime series",
  "category": "anime",
  "tags": ["anime", "review", "action"],
  "featured": false
}
```

## Testing Your Setup

Use this curl command to test your n8n webhook:

```bash
curl -X POST YOUR_N8N_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog from n8n",
    "content": "This is a test blog post created through n8n using the direct GitHub API approach.",
    "category": "anime",
    "tags": ["test", "n8n"],
    "description": "Testing the n8n to GitHub integration"
  }'
```

## Advantages of Direct GitHub API

1. **🚀 More Reliable**: No serverless function timeout issues
2. **📊 Full Control**: You can see exactly what's happening
3. **🔄 Real-time**: Immediate updates to your website
4. **💰 Cost Effective**: No Vercel function execution costs
5. **🛠 Debugging**: Easy to troubleshoot in n8n interface

## Next Steps

1. Set up the n8n workflow with the nodes above
2. Replace `YOUR_N8N_WEBHOOK_URL` with your actual webhook URL
3. Test with the curl command
4. Monitor the GitHub repository for successful commits
5. Check your website for the new blog posts

The GitHub API approach gives you the same functionality as the Vercel function but with better reliability and visibility into the process!
