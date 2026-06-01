const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/delivery.controller');
const DeliveryValidator = require('../validators/delivery.validator');
const validate = require('../../../shared/middleware/validation.middleware');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const roleMiddleware = require('../../../shared/middleware/role.middleware');
const { USER_ROLES } = require('../../../config/constants');

// =============================================
// MİSAFİR ENDPOINT'İ (Auth yok)
// =============================================

router.post(
  '/guest',
  validate(DeliveryValidator.createGuestDelivery),
  DeliveryController.createGuestDelivery
);

// =============================================
// GÖNDERİCİ ENDPOINT'LERİ
// =============================================

// Yeni iş oluştur
router.post(
  '/',
  authMiddleware,
  roleMiddleware(USER_ROLES.SENDER),
  validate(DeliveryValidator.createDelivery),
  DeliveryController.createDelivery
);

// Kendi siparişlerini listele
router.get(
  '/my-orders',
  authMiddleware,
  roleMiddleware(USER_ROLES.SENDER),
  DeliveryController.getMySenderOrders
);

// =============================================
// ÖĞRENCİ ENDPOINT'LERİ
// =============================================

// Müsait işleri listele
router.get(
  '/available',
  authMiddleware,
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.ADMIN),
  DeliveryController.getAvailableJobs
);

// Kendi işlerini listele
router.get(
  '/my-jobs',
  authMiddleware,
  roleMiddleware(USER_ROLES.STUDENT),
  DeliveryController.getMyStudentJobs
);

// =============================================
// ADMİN ENDPOINT'LERİ
// =============================================

// Tüm işleri listele
router.get(
  '/admin/all',
  authMiddleware,
  roleMiddleware(USER_ROLES.ADMIN),
  DeliveryController.getAllDeliveries
);

// İstatistikler
router.get(
  '/admin/stats',
  authMiddleware,
  roleMiddleware(USER_ROLES.ADMIN),
  DeliveryController.getStats
);

// =============================================
// ORTAK ENDPOINT'LER — /:id en sona
// =============================================

// İşi kabul et
router.post(
  '/:id/accept',
  authMiddleware,
  roleMiddleware(USER_ROLES.STUDENT),
  DeliveryController.acceptJob
);

// İşi iptal et
router.put(
  '/:id/cancel',
  authMiddleware,
  roleMiddleware(USER_ROLES.SENDER),
  validate(DeliveryValidator.cancelDelivery),
  DeliveryController.cancelJob
);

// İşe başla
router.put(
  '/:id/start',
  authMiddleware,
  roleMiddleware(USER_ROLES.STUDENT),
  DeliveryController.startJob
);

// İşi tamamla
router.put(
  '/:id/complete',
  authMiddleware,
  roleMiddleware(USER_ROLES.STUDENT),
  DeliveryController.completeJob
);

// Ödeme durumu güncelle
router.put(
  '/:id/payment',
  authMiddleware,
  roleMiddleware(USER_ROLES.ADMIN),
  validate(DeliveryValidator.updatePaymentStatus),
  DeliveryController.updatePaymentStatus
);

// İş detayı — en sona
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(USER_ROLES.SENDER, USER_ROLES.STUDENT, USER_ROLES.ADMIN),
  DeliveryController.getDeliveryById
);

module.exports = router;