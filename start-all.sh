#!/bin/bash

echo "🚀 Starting Ink Splash Stories - Full Stack Setup"
echo "================================================"

echo "📦 Installing dependencies..."

echo ""
echo "🎨 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependencies installation failed"
    exit 1
fi

echo ""
echo "🔧 Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Server dependencies installation failed"
    exit 1
fi

echo ""
echo "🔨 Building server..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo "🚀 Starting both frontend and server..."
echo ""
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Server API will be available at: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npm run start
