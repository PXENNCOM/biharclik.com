const express = require('express');
const router = express.Router();
const paymentRoutes = require('./routes/payment.routes');

router.use('/', paymentRoutes);

module.exports = router;