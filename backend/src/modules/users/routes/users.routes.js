const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const UsersValidator = require('../validators/users.validator');
const validate = require('../../../shared/middleware/validation.middleware');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const roleMiddleware = require('../../../shared/middleware/role.middleware');
const { USER_ROLES } = require('../../../config/constants');

// Tüm route'lar için auth gerekli
router.use(authMiddleware);

// =============================================
// PROFİL İŞLEMLERİ
// =============================================

// Kendi profilimi gör
router.get('/profile', UsersController.getMyProfile);

// Kendi profilimi güncelle
router.put(
  '/profile',
  validate(UsersValidator.updateProfile),
  UsersController.updateMyProfile
);

// Email güncelle
router.put(
  '/email',
  validate(UsersValidator.updateEmail),
  UsersController.updateMyEmail
);

// Telefon güncelle
router.put(
  '/phone',
  validate(UsersValidator.updatePhone),
  UsersController.updateMyPhone
);

// Şifre değiştir
router.put(
  '/password',
  validate(UsersValidator.changePassword),
  UsersController.changeMyPassword
);

// =============================================
// GEÇMİŞ / HISTORY
// =============================================

// Geçmişimi gör (Öğrenci: teslimat geçmişi, Gönderici: kargo geçmişi)
router.get(
  '/history',
  roleMiddleware(USER_ROLES.STUDENT, USER_ROLES.SENDER),
  UsersController.getMyHistory
);

module.exports = router;
