const admin = require('../../../config/firebase.config');
const db = require('../../../database/connection');
const logger = require('../../../shared/utils/logger.util');

class SmsService {
  /**
   * Telefon numarasına doğrulama SMS'i gönder
   * @param {number} userId - Kullanıcı ID
   * @param {string} phoneNumber - Telefon numarası (05XXXXXXXXX formatında)
   */
  static async sendVerificationSMS(userId, phoneNumber) {
    try {
      // Telefon numarasını uluslararası formata çevir
      // 05551234567 → +905551234567
      const formattedPhone = phoneNumber.startsWith('+90') 
        ? phoneNumber 
        : `+90${phoneNumber.substring(1)}`;

      logger.info('Sending verification SMS', { userId, phone: formattedPhone });

      // Not: Firebase Admin SDK server-side'da direkt SMS gönderemez
      // Client-side (frontend) Firebase Auth kullanarak SMS gönderecek
      // Backend sadece doğrulama yapacak
      
      return {
        success: true,
        message: 'SMS gönderimi için hazır',
        formattedPhone
      };

    } catch (error) {
      logger.error('SMS send error:', error);
      throw new Error('SMS gönderilemedi');
    }
  }

  /**
   * Telefon doğrulamasını işaretle
   * @param {number} userId - Kullanıcı ID
   */
  static async markPhoneAsVerified(userId) {
    try {
      await db.query(
        'UPDATE users SET phone_verified = TRUE WHERE id = ?',
        [userId]
      );

      logger.info('Phone marked as verified', { userId });

      return { success: true };
    } catch (error) {
      logger.error('Phone verification update error:', error);
      throw new Error('Telefon doğrulama güncellenemedi');
    }
  }

  /**
   * Kullanıcının telefon doğrulama durumunu kontrol et
   * @param {number} userId - Kullanıcı ID
   */
  static async checkPhoneVerificationStatus(userId) {
    try {
      const [users] = await db.query(
        'SELECT phone_verified FROM users WHERE id = ?',
        [userId]
      );

      if (!users.length) {
        throw new Error('Kullanıcı bulunamadı');
      }

      return {
        phone_verified: users[0].phone_verified
      };
    } catch (error) {
      logger.error('Phone verification status check error:', error);
      throw error;
    }
  }
}

module.exports = SmsService;