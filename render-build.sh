#!/bin/bash

echo "🚀 Starting Render Build Process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --only=production

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd ../client
npm ci
echo "🏗️ Building client for production..."
npm run build

# Move build to server for serving
echo "📁 Moving build files..."
mv build ../server/public

echo "✅ Build completed successfully!"