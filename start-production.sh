#!/bin/bash

echo "🚀 Starting Vendorify in Production Mode..."

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "❌ server/.env not found. Please copy server/.env.example to server/.env and configure it."
    exit 1
fi

# Check if build exists
if [ ! -d "client/build" ]; then
    echo "❌ Client build not found. Please run 'npm run build' in client directory first."
    exit 1
fi

# Start the server
echo "🚀 Starting production server..."
cd server
NODE_ENV=production npm start