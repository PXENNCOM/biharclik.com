const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const roleMiddleware = require('../../../shared/middleware/role.middleware');
const { USER_ROLES } = require('../../../config/constants');

router.post(
  '/initialize/:deliveryId',
  authMiddleware,
  roleMiddleware(USER_ROLES.SENDER),
  PaymentController.initializePayment
);

router.post('/callback', PaymentController.handleCallback);

router.get(
  '/pending-student-payments',
  authMiddleware,
  roleMiddleware(USER_ROLES.ADMIN),
  PaymentController.getPendingStudentPayments
);

router.post('/initialize-guest/:deliveryId', PaymentController.initializeGuestPayment);

module.exports = router;