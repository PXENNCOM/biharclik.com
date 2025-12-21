const UsersService = require('../services/users.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class UsersController {
  // =============================================
  // PROFİL
  // =============================================

  static async getMyProfile(req, res, next) {
    try {
      logger.info(`🔍 Getting profile for user ID: ${req.user.id}, role: ${req.user.role}`);
      
      const profile = await UsersService.getProfile(req.user.id, req.user.role);

      logger.info('✅ Profile found:', { userId: req.user.id, email: profile.email });

      return ApiResponse.success(
        res,
        'Profil bilgisi getirildi',
        profile
      );
    } catch (error) {
      logger.error('❌ Get profile error:', error);
      next(error);
    }
  }

  static async updateMyProfile(req, res, next) {
    try {
      const profile = await UsersService.updateProfile(req.user.id, req.user.role, req.body);

      logger.info('Profile updated', { userId: req.user.id });

      return ApiResponse.success(
        res,
        'Profil başarıyla güncellendi',
        profile
      );
    } catch (error) {
      logger.error('Update profile error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async updateMyEmail(req, res, next) {
    try {
      const result = await UsersService.updateEmail(req.user.id, req.body.email);

      logger.info('Email updated', { userId: req.user.id, newEmail: req.body.email });

      return ApiResponse.success(
        res,
        result.message,
        result
      );
    } catch (error) {
      logger.error('Update email error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async updateMyPhone(req, res, next) {
    try {
      const result = await UsersService.updatePhone(req.user.id, req.body.phone);

      logger.info('Phone updated', { userId: req.user.id, newPhone: req.body.phone });

      return ApiResponse.success(
        res,
        result.message,
        result
      );
    } catch (error) {
      logger.error('Update phone error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async changeMyPassword(req, res, next) {
    try {
      const result = await UsersService.changePassword(
        req.user.id,
        req.body.old_password,
        req.body.new_password
      );

      logger.info('Password changed', { userId: req.user.id });

      return ApiResponse.success(
        res,
        result.message,
        result
      );
    } catch (error) {
      logger.error('Change password error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // GEÇMİŞ / HISTORY
  // =============================================

  static async getMyHistory(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        from_date: req.query.from_date,
        to_date: req.query.to_date,
        limit: req.query.limit || 50
      };

      let result;
      if (req.user.role === 'student') {
        result = await UsersService.getStudentHistory(req.user.id, filters);
      } else if (req.user.role === 'sender') {
        result = await UsersService.getSenderHistory(req.user.id, filters);
      } else {
        return ApiResponse.error(res, 'Geçmiş sadece öğrenci ve gönderici için kullanılabilir', 403);
      }

      return ApiResponse.success(
        res,
        'Geçmiş getirildi',
        result
      );
    } catch (error) {
      logger.error('Get history error:', error);
      next(error);
    }
  }
}

module.exports = UsersController;
