const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');
const roleMiddleware = require('../../../shared/middleware/role.middleware');
const { USER_ROLES } = require('../../../config/constants');

// Tüm admin route'ları için auth ve role kontrolü
router.use(authMiddleware);
router.use(roleMiddleware(USER_ROLES.ADMIN));

// =============================================
// ÖĞRENCİ YÖNETİMİ
// =============================================

// Tüm öğrencileri listele
router.get('/students', AdminController.getAllStudents);

// Öğrenci detayı
router.get('/students/:id', AdminController.getStudentDetail);

// Öğrenciyi onayla
router.put('/students/:id/approve', AdminController.approveStudent);

// Öğrenci onayını kaldır
router.put('/students/:id/unapprove', AdminController.unapproveStudent);

// =============================================
// GÖNDERİCİ YÖNETİMİ
// =============================================

// Tüm göndericileri listele
router.get('/senders', AdminController.getAllSenders);

// Gönderici detayı
router.get('/senders/:id', AdminController.getSenderDetail);

// =============================================
// KULLANICI YÖNETİMİ
// =============================================

// Kullanıcıyı aktif/pasif yap
router.put('/users/:id/status', AdminController.toggleUserStatus);

// Kullanıcıyı sil (soft delete)
router.delete('/users/:id', AdminController.deleteUser);

// =============================================
// İSTATİSTİKLER
// =============================================

// Dashboard istatistikleri
router.get('/dashboard/stats', AdminController.getDashboardStats);

module.exports = router;
