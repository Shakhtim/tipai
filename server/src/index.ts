// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/errorHandler';
import { TokenRefreshService } from './services/token-refresh.service';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Multi-Search API',
    version: '1.0.0',
    endpoints: {
      query: 'POST /api/query',
      providers: 'GET /api/providers',
      health: 'GET /api/health'
    }
  });
});

// Error handling
app.use(errorHandler);

// Start IAM token auto-refresh
const tokenService = TokenRefreshService.getInstance();
tokenService.startAutoRefresh();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  tokenService.stopAutoRefresh();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  tokenService.stopAutoRefresh();
  process.exit(0);
});