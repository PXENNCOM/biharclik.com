const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./shared/middleware/errorHandler.middleware');
const logger = require('./shared/utils/logger.util');

const app = express();

app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false 
}));

// CORS Ayarı - İzin verilen domainler listesi netleştirildi
const allowedOrigins = [
  'https://biharclik.com', 
  'https://www.biharclik.com', 
  'http://localhost:3000', 
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman gibi araçlardan gelen origin'siz isteklere veya listedeki domainlere izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Politikası: Bu kökenden erişim izni yok.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
  logger.info('Rate limiting disabled in development mode');
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../uploads')));

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