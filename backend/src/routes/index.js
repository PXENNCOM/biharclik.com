// Dosya: /src/routes/index.js

const express = require('express');
const router = express.Router();

const authModule = require('../modules/auth');
const deliveryModule = require('../modules/deliveries');
const adminModule = require('../modules/admin');
const usersModule = require('../modules/users');
const supportModule = require('../modules/support'); 
const tempRoutes = require('./temp.routes');

// Auth routes
router.use('/auth', authModule.routes);

// Delivery routes
router.use('/deliveries', deliveryModule.routes);

// Admin routes
router.use('/admin', adminModule.routes);

// Users routes
router.use('/users', usersModule.routes);

// Support routes
router.use('/support', supportModule.routes); 

// Geçici routes (hash generator)
router.use('/temp', tempRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
