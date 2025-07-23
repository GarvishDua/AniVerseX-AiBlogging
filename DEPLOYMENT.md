# Deployment Setup for Vercel

This project has been configured to deploy on Vercel with GitHub as a serverless database.

## Features

- **Serverless API**: Blog data is served through Vercel API functions
- **GitHub Database**: Uses your GitHub repository's `public/blogs.json` as the database
- **Automatic Updates**: Changes to blog content are automatically committed to GitHub
- **CORS Enabled**: API endpoints support cross-origin requests

## Deployment Steps

### 1. Prepare Repository
Ensure your repository contains:
- `api/blogs.ts` - Serverless API function
- `vercel.json` - Vercel configuration
- `public/blogs.json` - Blog data file

### 2. Create GitHub Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full repository access)
4. Copy the token for Vercel configuration

### 3. Deploy to Vercel
1. Import your repository to Vercel
2. Set environment variables:
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `GITHUB_OWNER`: Your GitHub username
   - `GITHUB_REPO`: Your repository name
3. Deploy the project

### 4. Verify Deployment
- Visit your deployed site
- Test blog loading functionality
- Verify API endpoints work: `/api/blogs`

## API Endpoints

- `GET /api/blogs` - Get all blog posts and categories
- `GET /api/blogs?id={postId}` - Get specific blog post
- `POST /api/blogs` - Create new blog post
- `DELETE /api/blogs?id={postId}` - Delete blog post

## Development vs Production

- **Development**: Uses local `blogs.json` file
- **Production**: Uses serverless API with GitHub integration

## Troubleshooting

1. **API Not Working**: Check GitHub token permissions
2. **CORS Issues**: Verify API headers are set correctly
3. **Build Errors**: Ensure all dependencies are installed

The app automatically detects the environment and uses the appropriate data source.
