@echo off
echo 🚀 Starting Ink Splash Stories - Full Stack Setup
echo ================================================

echo 📦 Installing dependencies...

echo.
echo 🎨 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed
    pause
    exit /b 1
)

echo.
echo 🔧 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed
    pause
    exit /b 1
)

echo.
echo 🔨 Building server...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Server build failed
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Setup complete!
echo 🚀 Starting both frontend and server...
echo.
echo 📱 Frontend will be available at: http://localhost:5173
echo 🔧 Server API will be available at: http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo.

call npm run start

pause
