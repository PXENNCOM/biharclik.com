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

    // Dosya yollarını ekle
    const studentData = {
      ...req.body,
      student_document_url: `/uploads/students/${req.files.student_document[0].filename}`,
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

  // TELEFON DOĞRULAMASINI İŞARETLE
  // GÜVENLİK: Firebase ID token zorunlu - frontend'in gerçekten SMS doğrulamasını
  // tamamladığını kanıtlamadan phone_verified TRUE yapılmaz.
  static async markPhoneVerified(req, res, next) {
    try {
      const { firebaseIdToken } = req.body;

      await SmsService.verifyAndMarkPhoneVerified(
        req.user.id,
        req.user.phone,
        firebaseIdToken
      );

      logger.info('Phone verified', { userId: req.user.id });

      return ApiResponse.success(
        res,
        'Telefon numarası doğrulandı',
        { phone_verified: true }
      );
    } catch (error) {
      logger.error('Mark phone verified error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // ŞİFREMİ UNUTTUM - 1. adım: numara kayıtlı mı kontrol et
  static async checkPhoneForReset(req, res, next) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return ApiResponse.error(res, 'Telefon numarası gerekli', 400);
      }

      await AuthService.checkPhoneExists(phone);

      return ApiResponse.success(res, 'Numara kayıtlı', { exists: true });
    } catch (error) {
      logger.error('Check phone for password reset error:', error);
      return ApiResponse.error(res, error.message, 404);
    }
  }

  // ŞİFREMİ UNUTTUM - 2. adım: Firebase doğrulaması sonrası şifreyi güncelle
  static async resetPassword(req, res, next) {
    try {
      const { phone, firebaseIdToken, newPassword } = req.body;

      if (!phone || !firebaseIdToken || !newPassword) {
        return ApiResponse.error(res, 'Eksik bilgi gönderildi', 400);
      }

      await AuthService.resetPasswordWithPhone(phone, firebaseIdToken, newPassword);

      logger.info('Password reset completed', { phone });

      return ApiResponse.success(res, 'Şifreniz başarıyla güncellendi', { success: true });
    } catch (error) {
      logger.error('Password reset error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = AuthController;