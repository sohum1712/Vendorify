#!/bin/bash

# Vendorify Production Deployment Script

echo "🚀 Starting Vendorify Production Deployment..."

# Check if required environment files exist
if [ ! -f "server/.env" ]; then
    echo "❌ server/.env file not found. Please copy server/.env.example to server/.env and configure it."
    exit 1
fi

if [ ! -f "client/.env" ]; then
    echo "❌ client/.env file not found. Please copy client/.env.example to client/.env and configure it."
    exit 1
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --only=production
cd ..

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm ci
echo "🏗️ Building client for production..."
npm run build
cd ..

# Initialize database
echo "🗄️ Initializing database..."
cd server
npm run init-db
npm run verify
cd ..

echo "✅ Deployment completed successfully!"
echo ""
echo "🚀 To start the production server:"
echo "   cd server && npm start"
echo ""
echo "📝 Make sure to:"
echo "   1. Configure your reverse proxy (nginx/apache) to serve client/build"
echo "   2. Set up SSL certificates"
echo "   3. Configure your MongoDB connection"
echo "   4. Set up process manager (PM2) for production"