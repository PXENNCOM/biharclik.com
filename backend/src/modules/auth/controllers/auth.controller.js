const AuthService = require('../services/auth.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

const SmsService = require('../services/sms.service');


class AuthController {
  // ÖĞRENCİ KAYIT
  static async registerStudent(req, res, next) {
  try {
    // Her iki dosya da zorunlu
    if (!req.files || !req.files.student_document) {
      return ApiResponse.error(res, 'Öğrenci belgesi zorunludur', 400);
    }
    
    if (!req.files || !req.files.profile_photo) {
      return ApiResponse.error(res, 'Profil fotoğrafı zorunludur', 400);
    }

    // Dosya yollarını ekle
    const studentData = {
      ...req.body,
      student_document_url: `/uploads/students/${req.files.student_document[0].filename}`,
      profile_photo: `/uploads/profile-photos/${req.files.profile_photo[0].filename}`
    };

    const result = await AuthService.registerStudent(studentData);
    
    logger.info('Student registered successfully', { userId: result.user.id });
    
    return ApiResponse.success(
      res,
      'Kayıt başarılı! Hesabınız admin onayı sonrası aktif olacak.',
      result,
      201
    );
  } catch (error) {
    logger.error('Student registration error:', error);
    
    // Hata olursa yüklenen dosyaları sil
    if (req.files) {
      const fs = require('fs');
      const path = require('path');
      
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          const filePath = path.join('./uploads', file.destination.split('/').pop(), file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }
    
    next(error);
  }
}

  // GÖNDERİCİ KAYIT
  static async registerSender(req, res, next) {
    try {
      const result = await AuthService.registerSender(req.body);
      
      logger.info('Sender registered successfully', { 
        userId: result.user.id,
        accountType: result.user.account_type
      });
      
      return ApiResponse.success(
        res,
        'Kayıt başarılı! Giriş yapabilirsiniz.',
        result,
        201
      );
    } catch (error) {
      logger.error('Sender registration error:', error);
      next(error);
    }
  }

  // GİRİŞ
  static async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      
      logger.info('User logged in', { userId: result.user.id });
      
      return ApiResponse.success(
        res,
        'Giriş başarılı',
        result
      );
    } catch (error) {
      logger.error('Login error:', error);
      return ApiResponse.error(res, error.message, 401);
    }
  }

  // ÇIKIŞ
  static async logout(req, res, next) {
    try {
      const { refresh_token } = req.body;
      
      if (refresh_token) {
        await AuthService.logout(refresh_token);
      }
      
      logger.info('User logged out', { userId: req.user?.id });
      
      return ApiResponse.success(
        res,
        'Çıkış başarılı'
      );
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  // TOKEN YENİLE
  static async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;
      const result = await AuthService.refreshToken(refresh_token);
      
      return ApiResponse.success(
        res,
        'Token yenilendi',
        result
      );
    } catch (error) {
      logger.error('Token refresh error:', error);
      return ApiResponse.error(res, error.message, 401);
    }
  }

  // PROFİL BİLGİSİ (Sadece login olan kullanıcı)
  static async getProfile(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        'Profil bilgisi',
        { user: req.user }
      );
    } catch (error) {
      next(error);
    }
  }

    static async checkPhoneVerification(req, res, next) {
    try {
      const userId = req.user.id; // Auth middleware'den geliyor
      
      const result = await SmsService.checkPhoneVerificationStatus(userId);
      
      return ApiResponse.success(
        res,
        'Telefon doğrulama durumu',
        result
      );
    } catch (error) {
      logger.error('Check phone verification error:', error);
      next(error);
    }
  }

  // TELEFON DOĞRULAMASINI İŞARETLE (Manuel test için)
  static async markPhoneVerified(req, res, next) {
    try {
      const userId = req.user.id;
      
      await SmsService.markPhoneAsVerified(userId);
      
      logger.info('Phone manually marked as verified', { userId });
      
      return ApiResponse.success(
        res,
        'Telefon numarası doğrulandı olarak işaretlendi',
        { phone_verified: true }
      );
    } catch (error) {
      logger.error('Mark phone verified error:', error);
      next(error);
    }
  }
}

module.exports = AuthController;
