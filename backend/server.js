/**
 * She Can Foundation — Express Server
 * Main entry point for the Node.js/Express backend API
 * Supports both local development and Vercel serverless deployment
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
// connectDB is called once; on Vercel, the connection is reused across invocations
connectDB();

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Utility Middleware ────────────────────────────────────────────

// CORS Configuration — supports multiple origins (local + Vercel frontend)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, Vercel preview)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In production, log but allow to avoid blocking legitimate requests
      if (process.env.NODE_ENV === 'production') {
        console.warn(`CORS warning: Origin ${origin} not in allowlist`);
        return callback(null, true);
      }
      callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (dev mode only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global rate limiter (100 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
app.use('/api/', globalLimiter);

// Trust proxy — required for Vercel/reverse proxies to get correct client IP
app.set('trust proxy', 1);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'She Can Foundation API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server.`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Local Development Server ─────────────────────────────────────────────────
// On Vercel, the app is exported directly (no app.listen needed)
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('🌟 ════════════════════════════════════════ 🌟');
    console.log(`   She Can Foundation API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log('🌟 ════════════════════════════════════════ 🌟');
    console.log('');
    console.log('📌 Quick Setup: POST http://localhost:' + PORT + '/api/auth/setup');
    console.log('   Body: { "name": "Admin", "email": "...", "password": "..." }');
    console.log('');
  });

  // Graceful shutdown for local dev
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Gracefully shutting down...`);
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => process.exit(1));
  });
}

// ─── Export for Vercel Serverless ─────────────────────────────────────────────
module.exports = app;
