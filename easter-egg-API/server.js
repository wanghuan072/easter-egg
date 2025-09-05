import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import gamesRoutes from './routes/games.js';
import moviesRoutes from './routes/movies.js';
import tvRoutes from './routes/tv.js';
import newsRoutes from './routes/news.js';
import searchRoutes from './routes/search.js';
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import reviewsRoutes from './routes/reviews.js';
import ratingsRoutes from './routes/ratings.js';
import commentsRoutes from './routes/comments.js';
import sitemapRoutes from './routes/sitemap.js';

// Database connection will be added later when migrating to Neon

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.CORS_ORIGIN_PROD 
  : process.env.CORS_ORIGIN_DEV;

const corsOptions = {
  origin: corsOrigin || true,
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // 在开发环境下可以选择性禁用限流
  skip: (req) => process.env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true'
});

// 在开发环境下直接禁用限流
if (process.env.NODE_ENV === 'development') {
  console.log('⚠️ Rate limiting disabled for development');
} else {
  app.use(limiter);
  console.log('🔒 Rate limiting enabled');
}

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'not set',
    corsOriginProd: process.env.CORS_ORIGIN_PROD || 'not set'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/sitemap', sitemapRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 API endpoints available at /api/*`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
