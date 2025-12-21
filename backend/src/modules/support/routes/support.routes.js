// Dosya: /src/modules/support/routes/support.routes.js

const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/support.controller');
const SupportValidator = require('../validators/support.validator');
const validate = require('../../../shared/middleware/validation.middleware');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const roleMiddleware = require('../../../shared/middleware/role.middleware');
const { USER_ROLES } = require('../../../config/constants');

// Tüm route'lar için auth gerekli
router.use(authMiddleware);

// =============================================
// KULLANICI (ÖĞRENCİ/GÖNDERİCİ) ROUTE'LARI
// =============================================

// Yeni ticket oluştur
router.post(
  '/',
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.SENDER),
  validate(SupportValidator.createTicket),
  SupportController.createTicket
);

// Kendi ticket'larımı listele
router.get(
  '/my-tickets',
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.SENDER),
  SupportController.getMyTickets
);

// Ticket detayı görüntüle
router.get(
  '/:id',
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.SENDER, USER_ROLES.ADMIN),
  SupportController.getTicketDetail
);

// Ticket'a mesaj ekle
router.post(
  '/:id/messages',
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.SENDER, USER_ROLES.ADMIN),
  validate(SupportValidator.addMessage),
  SupportController.addMessage
);

// =============================================
// ADMIN ROUTE'LARI
// =============================================

// Tüm ticket'ları listele (ADMIN)
router.get(
  '/admin/all',
  roleMiddleware(USER_ROLES.ADMIN),
  SupportController.getAllTickets
);

// Destek istatistikleri (ADMIN)
router.get(
  '/admin/stats',
  roleMiddleware(USER_ROLES.ADMIN),
  SupportController.getSupportStats
);

// Ticket durumunu güncelle (ADMIN)
router.put(
  '/:id/status',
  roleMiddleware(USER_ROLES.ADMIN),
  validate(SupportValidator.updateStatus),
  SupportController.updateTicketStatus
);

// Ticket'ı kapat (ADMIN)
router.put(
  '/:id/close',
  roleMiddleware(USER_ROLES.ADMIN),
  SupportController.closeTicket
);

// Ticket'ı yeniden aç (ADMIN)
router.put(
  '/:id/reopen',
  roleMiddleware(USER_ROLES.ADMIN),
  SupportController.reopenTicket
);

module.exports = router;