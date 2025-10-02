#!/bin/bash

# Full Deployment Script for TipAI.ru
# Deploys both frontend and backend
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting full deployment (frontend + backend)..."
echo ""

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull
echo ""

# Backend deployment
echo "========================================="
echo "🔧 BACKEND DEPLOYMENT"
echo "========================================="
cd server

echo "📦 Installing backend dependencies..."
npm install

echo "🔨 Building backend..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart tipai-backend --update-env

cd ..
echo ""

# Frontend deployment
echo "========================================="
echo "🎨 FRONTEND DEPLOYMENT"
echo "========================================="
cd client

echo "📦 Installing frontend dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

cd ..
echo ""

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx
echo ""

# Show status
echo "========================================="
echo "📊 DEPLOYMENT STATUS"
echo "========================================="
echo ""
echo "PM2 Backend Status:"
pm2 status tipai-backend
echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager -l | head -n 10
echo ""
echo "✅ Full deployment completed successfully!"
echo "🌐 Visit https://tipai.ru to see changes"
echo "💡 Backend logs: pm2 logs tipai-backend"
