#!/bin/bash

# Backend Deployment Script for TipAI.ru
# Usage: ./back-deploy.sh

set -e  # Exit on error

echo "🚀 Starting backend deployment..."

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull

# Navigate to server directory
cd server

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building backend..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart tipai-backend --update-env

echo "⏳ Waiting for backend to start..."
sleep 2

echo "📊 Checking PM2 status..."
pm2 status tipai-backend

echo "📋 Recent logs:"
pm2 logs tipai-backend --lines 10 --nostream

echo "✅ Backend deployment completed successfully!"
echo "💡 To view live logs: pm2 logs tipai-backend"
