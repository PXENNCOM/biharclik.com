const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./shared/middleware/errorHandler.middleware');
const logger = require('./shared/utils/logger.util');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : '*',
  credentials: true
}));

// Rate limiting (sadece production'da)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      success: false,
      message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.'
    }
  });
  app.use('/api/', limiter);
} else {
  // Development'da rate limiting yok
  logger.info('Rate limiting disabled in development mode');
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads klasörü)
app.use('/uploads', express.static('uploads'));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Error handler (en sonda olmalı)
app.use(errorHandler);

module.exports = app;
