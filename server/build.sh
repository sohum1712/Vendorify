#!/bin/bash

echo "🚀 Building Vendorify for Render..."

# Install server dependencies first
echo "📦 Installing server dependencies..."
npm ci --only=production

# Go to client directory and build
echo "📦 Building client..."
cd ../client
npm ci
npm run build

# Move build back to server
echo "📁 Moving build to server..."
mv build ../server/public

echo "✅ Build completed successfully!"