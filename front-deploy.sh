#!/bin/bash

# Frontend Deployment Script for TipAI.ru
# Usage: ./front-deploy.sh

set -e  # Exit on error

echo "🚀 Starting frontend deployment..."

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull

# Navigate to client directory
cd client

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Visit https://tipai.ru to see changes"
