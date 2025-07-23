#!/bin/bash

echo "🚀 Starting Vercel Deployment for Ink Splash Stories..."
echo "=================================================="

# Build the project first
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Deploy to Vercel
echo ""
echo "🌐 Deploying to Vercel..."
echo "You'll need to:"
echo "1. Login to Vercel (if not already logged in)"
echo "2. Confirm project settings"
echo "3. Set environment variables when prompted"
echo ""

# Start Vercel deployment
vercel --prod

echo ""
echo "🎉 Deployment process initiated!"
echo "📝 Don't forget to set these environment variables in Vercel dashboard:"
echo "   - GITHUB_TOKEN=your_github_token"
echo "   - GITHUB_OWNER=GarvishDua"
echo "   - GITHUB_REPO=ink-splash-stories"
echo "   - N8N_WEBHOOK_SECRET=your_secret_key"
echo ""
echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
