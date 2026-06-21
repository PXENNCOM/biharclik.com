const admin = require('../../../config/firebase.config');
const db = require('../../../database/connection');
const logger = require('../../../shared/utils/logger.util');

class SmsService {
  /**
   * Telefon numarasını uluslararası formata çevir (05XXXXXXXXX → +905XXXXXXXXX)
   * Hem 0'lı hem 90'lı hem de doğrudan 5'le başlayan formatları sağlam şekilde ele alır
   */
  static formatToInternational(phoneNumber) {
    const cleaned = String(phoneNumber).replace(/[\s\-().]/g, '');
    if (cleaned.startsWith('+90')) return cleaned;
    if (cleaned.startsWith('90')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+90' + cleaned.substring(1);
    return '+90' + cleaned;
  }

  /**
   * Firebase ID token'ı doğrula ve telefon numarasının hesap sahibine ait
   * olduğunu teyit ettikten sonra phone_verified alanını günceller.
   *
   * GÜVENLİK: Bu fonksiyon, frontend'in Firebase SMS doğrulamasını gerçekten
   * tamamladığını kriptografik olarak kanıtlayan bir ID token gerektirir.
   * Token olmadan veya token'daki numara hesap numarasıyla eşleşmeden
   * phone_verified asla TRUE yapılmaz.
   *
   * @param {number} userId - Kullanıcı ID (backend JWT'sinden gelir, req.user.id)
   * @param {string} userPhone - Kullanıcının hesabındaki telefon numarası (DB'deki)
   * @param {string} firebaseIdToken - Frontend'de Firebase SMS doğrulaması sonrası alınan ID token
   */
  static async verifyAndMarkPhoneVerified(userId, userPhone, firebaseIdToken) {
    if (!firebaseIdToken) {
      throw new Error('Firebase doğrulama token\'ı gerekli');
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(firebaseIdToken);
    } catch (err) {
      logger.error('Firebase ID token verification failed:', err);
      throw new Error('Geçersiz veya süresi dolmuş doğrulama token\'ı');
    }

    if (!decoded.phone_number) {
      throw new Error('Token telefon doğrulaması içermiyor');
    }

    const expectedPhone = this.formatToInternational(userPhone);
    if (decoded.phone_number !== expectedPhone) {
      logger.error('Phone mismatch on verification', {
        userId,
        expected: expectedPhone,
        got: decoded.phone_number
      });
      throw new Error('Doğrulanan numara hesap numarasıyla eşleşmiyor');
    }

    await db.query(
      'UPDATE users SET phone_verified = TRUE WHERE id = ?',
      [userId]
    );

    logger.info('Phone verified via Firebase token', { userId });

    return { success: true };
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