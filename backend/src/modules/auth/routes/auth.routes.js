const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');
const validate = require('../../../shared/middleware/validation.middleware');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const { upload, handleMulterError } = require('../../../shared/middleware/upload.middleware');

// Public routes (herkes erişebilir)
router.post(
  '/register/student',
  upload.single('student_document'),
  handleMulterError,
  validate(AuthValidator.studentRegister),
  AuthController.registerStudent
);

router.post(
  '/register/sender',
  validate(AuthValidator.senderRegister),
  AuthController.registerSender
);

router.post(
  '/login',
  validate(AuthValidator.login),
  AuthController.login
);

router.post(
  '/refresh-token',
  validate(AuthValidator.refreshToken),
  AuthController.refreshToken
);

// Protected routes (login gerekli)
router.post(
  '/logout',
  authMiddleware,
  AuthController.logout
);

router.get(
  '/profile',
  authMiddleware,
  AuthController.getProfile
);

// Telefon doğrulama endpoint'leri
router.get('/phone-verification/status', authMiddleware, AuthController.checkPhoneVerification);
router.post('/phone-verification/verify', authMiddleware, AuthController.markPhoneVerified);

module.exports = router;
