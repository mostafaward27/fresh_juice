import os from 'os';
// Set UV_THREADPOOL_SIZE to maximize concurrency of crypto operations in libuv
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || String(Math.max(16, os.cpus().length * 2));

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { initDb } from './config/db';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDb().catch((err) => {
  console.error('Failed to initialize SQLite Database:', err);
  process.exit(1);
});

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Required to allow loading local uploaded images in the browser
}));

app.use(cors({
  origin: '*', // Allow all origins for dev/staging simplicity, can configure in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local static uploaded product images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rate Limiter to guard endpoints (bypassed if DISABLE_RATE_LIMITER=true for load testing)
const rateLimiterDisabled = process.env.DISABLE_RATE_LIMITER === 'true';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: rateLimiterDisabled ? 9999999 : 200, // Limit each IP to 200 requests per window
  message: { error: 'طلبات كثيرة جداً، الرجاء المحاولة لاحقاً بعد 15 دقيقة.' }
});
app.use('/api', limiter);

// Mount REST API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Base route healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'مرحباً بك في خادم مشروبات مشبرة (Shabar API) 🍹' });
});

// Centralized error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Error Handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'حدث خطأ غير متوقع في الخادم'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
