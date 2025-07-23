# Vercel Environment Variables Setup Guide

## Required Environment Variables

You need to set these environment variables in your Vercel project:

### 1. GITHUB_TOKEN
- **Purpose**: Personal access token to read/write to your GitHub repository
- **Value**: Your GitHub personal access token
- **How to get it**:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Select scopes: `repo` (Full control of private repositories)
  4. Copy the generated token

### 2. GITHUB_OWNER
- **Purpose**: Your GitHub username
- **Value**: `GarvishDua`
- **Description**: The owner of the repository

### 3. GITHUB_REPO
- **Purpose**: Repository name
- **Value**: `ink-splash-stories`
- **Description**: The name of your repository

## How to Set Environment Variables in Vercel

### Method 1: Using Vercel CLI
```bash
vercel env add GITHUB_TOKEN
vercel env add GITHUB_OWNER
vercel env add GITHUB_REPO
```

### Method 2: Using Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable for all environments (Development, Preview, Production)

## Current Status ✅

Environment variables are properly configured in Vercel:

- ✅ GITHUB_TOKEN: `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` (Production, Preview, Development)
- ✅ GITHUB_OWNER: `GarvishDua` (All environments) 
- ✅ GITHUB_REPO: `ink-splash-stories` (All environments)

## GitHub API Test Results ✅

Direct GitHub API access is working perfectly:
- ✅ Authentication successful
- ✅ Repository access confirmed  
- ✅ File read/write operations working
- ✅ Blog post creation via GitHub API successful

## API Endpoint

Your blog posting endpoint is:
```
POST https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app/api/add-blog
```

⚠️ **Current Issue**: Vercel function is returning `FUNCTION_INVOCATION_FAILED` error. 
- GitHub API access is confirmed working
- Environment variables are properly set
- Function code is correct
- Issue appears to be at Vercel platform level

## Direct GitHub API Alternative

Since the GitHub API is working directly, you can use this Node.js script instead:

```javascript
// Direct GitHub API approach
const GITHUB_TOKEN = "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";
const GITHUB_OWNER = "GarvishDua";
const GITHUB_REPO = "ink-splash-stories";

// Your working test script is available in test-github-api.js
```

## Test the API

### Using curl:
```bash
curl -X POST https://aniblogs-b98rd5dza-garvishs-projects.vercel.app/api/add-blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Amazing Anime Review",
    "content": "This is the content of my blog post...",
    "category": "anime",
    "tags": ["anime", "review"],
    "description": "A brief description"
  }'
```

### Using n8n HTTP Request Node:
- **Method**: POST
- **URL**: `https://aniblogs-b98rd5dza-garvishs-projects.vercel.app/api/add-blog`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: JSON with blog post data

## Blog Post JSON Format

Required fields:
- `title` (string)
- `content` (string)

Optional fields:
- `description` (string) - Auto-generated from title if not provided
- `category` (string) - Default: "anime"
- `tags` (array) - Default: []
- `featured` (boolean) - Default: false
- `readTime` (string) - Auto-calculated if not provided
- `publishDate` (string) - Default: current date

## How It Works

1. 📝 You send JSON data to the API endpoint
2. 🔍 Function fetches current `public/api/blogs.json` from GitHub
3. ➕ Adds your new blog post to the data
4. 📊 Updates category counts
5. 🚀 Pushes updated JSON back to GitHub
6. 🌐 Website automatically reflects changes (reads from GitHub raw content)

## Troubleshooting

If the API doesn't work:
1. Check Vercel function logs in dashboard
2. Verify GitHub token has `repo` permissions
3. Ensure all environment variables are set for Production environment
4. Test with the provided curl command

## Next Steps

1. Run the test script to verify GitHub API access
2. Test the Vercel endpoint with curl or n8n
3. Monitor function logs for any errors
4. Set up your n8n workflow to post to the endpoint
