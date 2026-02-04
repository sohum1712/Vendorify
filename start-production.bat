@echo off
echo 🚀 Starting Vendorify in Production Mode...

REM Check if .env files exist
if not exist "server\.env" (
    echo ❌ server\.env not found. Please copy server\.env.example to server\.env and configure it.
    pause
    exit /b 1
)

REM Check if build exists
if not exist "client\build" (
    echo ❌ Client build not found. Please run 'npm run build' in client directory first.
    pause
    exit /b 1
)

REM Start the server
echo 🚀 Starting production server...
cd server
set NODE_ENV=production
npm start

pause