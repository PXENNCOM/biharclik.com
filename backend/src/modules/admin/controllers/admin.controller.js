const AdminService = require('../services/admin.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class AdminController {
  // =============================================
  // ÖĞRENCİ YÖNETİMİ
  // =============================================

  static async getAllStudents(req, res, next) {
    try {
      const filters = {
        admin_approved: req.query.admin_approved,
        is_active: req.query.is_active,
        university: req.query.university,
        limit: req.query.limit || 100
      };

      logger.info('📋 Getting all students with filters:', filters);

      const students = await AdminService.getAllStudents(filters);

      logger.info(`✅ Found ${students.length} students`);
      logger.info('📦 Sample student:', students[0]);

      return ApiResponse.success(
        res,
        'Öğrenciler listelendi',
        {
          count: students.length,
          students
        }
      );
    } catch (error) {
      logger.error('❌ Get all students error:', error);
      next(error);
    }
  }

  static async getStudentDetail(req, res, next) {
    try {
      logger.info(`🔍 Getting student detail for ID: ${req.params.id}`);
      
      const student = await AdminService.getStudentDetail(req.params.id);

      logger.info('✅ Student detail found:', student);

      return ApiResponse.success(
        res,
        'Öğrenci detayı getirildi',
        student
      );
    } catch (error) {
      logger.error('❌ Get student detail error:', error);
      return ApiResponse.error(res, error.message, 404);
    }
  }

  static async approveStudent(req, res, next) {
    try {
      const student = await AdminService.approveStudent(req.params.id);

      logger.info('Student approved', {
        studentId: req.params.id,
        adminId: req.user.id
      });

      return ApiResponse.success(
        res,
        'Öğrenci başarıyla onaylandı',
        student
      );
    } catch (error) {
      logger.error('Approve student error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async unapproveStudent(req, res, next) {
    try {
      const student = await AdminService.unapproveStudent(req.params.id);

      logger.info('Student unapproved', {
        studentId: req.params.id,
        adminId: req.user.id
      });

      return ApiResponse.success(
        res,
        'Öğrenci onayı kaldırıldı',
        student
      );
    } catch (error) {
      logger.error('Unapprove student error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // GÖNDERİCİ YÖNETİMİ
  // =============================================

  static async getAllSenders(req, res, next) {
    try {
      const filters = {
        limit: req.query.limit || 100
      };

      const senders = await AdminService.getAllSenders(filters);

      return ApiResponse.success(
        res,
        'Göndericiler listelendi',
        {
          count: senders.length,
          senders
        }
      );
    } catch (error) {
      logger.error('Get all senders error:', error);
      next(error);
    }
  }

  static async getSenderDetail(req, res, next) {
    try {
      const sender = await AdminService.getSenderDetail(req.params.id);

      return ApiResponse.success(
        res,
        'Gönderici detayı getirildi',
        sender
      );
    } catch (error) {
      logger.error('Get sender detail error:', error);
      return ApiResponse.error(res, error.message, 404);
    }
  }

  // =============================================
  // KULLANICI YÖNETİMİ
  // =============================================

  static async toggleUserStatus(req, res, next) {
    try {
      const { is_active } = req.body;
      const result = await AdminService.toggleUserStatus(req.params.id, is_active);

      logger.info('User status toggled', {
        userId: req.params.id,
        isActive: is_active,
        adminId: req.user.id
      });

      return ApiResponse.success(
        res,
        is_active ? 'Kullanıcı aktif hale getirildi' : 'Kullanıcı pasif hale getirildi',
        result
      );
    } catch (error) {
      logger.error('Toggle user status error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { deletion_reason } = req.body;
      const result = await AdminService.deleteUser(req.params.id, deletion_reason);

      logger.info('User deleted (soft)', {
        userId: req.params.id,
        reason: deletion_reason,
        adminId: req.user.id
      });

      return ApiResponse.success(
        res,
        'Kullanıcı başarıyla silindi',
        result
      );
    } catch (error) {
      logger.error('Delete user error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // İSTATİSTİKLER
  // =============================================

  static async getDashboardStats(req, res, next) {
    try {
      const stats = await AdminService.getDashboardStats();

      return ApiResponse.success(
        res,
        'Dashboard istatistikleri getirildi',
        stats
      );
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      next(error);
    }
  }
}

module.exports = AdminController;
