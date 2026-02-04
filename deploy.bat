@echo off
echo 🚀 Starting Vendorify Production Deployment...

REM Check if required environment files exist
if not exist "server\.env" (
    echo ❌ server\.env file not found. Please copy server\.env.example to server\.env and configure it.
    pause
    exit /b 1
)

if not exist "client\.env" (
    echo ❌ client\.env file not found. Please copy client\.env.example to client\.env and configure it.
    pause
    exit /b 1
)

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm ci --only=production
cd ..

REM Install client dependencies and build
echo 📦 Installing client dependencies...
cd client
call npm ci
echo 🏗️ Building client for production...
call npm run build
cd ..

REM Initialize database
echo 🗄️ Initializing database...
cd server
call npm run init-db
call npm run verify
cd ..

echo ✅ Deployment completed successfully!
echo.
echo 🚀 To start the production server:
echo    cd server ^&^& npm start
echo.
echo 📝 Make sure to:
echo    1. Configure your reverse proxy (nginx/apache) to serve client/build
echo    2. Set up SSL certificates
echo    3. Configure your MongoDB connection
echo    4. Set up process manager (PM2) for production

pause