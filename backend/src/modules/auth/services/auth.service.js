const admin = require('../../../config/firebase.config');
const BcryptUtil = require('../../../shared/utils/bcrypt.util');
const UserQueries = require('../../../database/queries/user.queries');
const StudentQueries = require('../../../database/queries/student.queries');
const SenderQueries = require('../../../database/queries/sender.queries');
const TokenService = require('./token.service');
const db = require('../../../database/connection');
const logger = require('../../../shared/utils/logger.util');
const { USER_ROLES, SENDER_TYPES } = require('../../../config/constants');

class AuthService {
  // ÖĞRENCİ KAYIT
  static async registerStudent(data) {
    // Silinen kullanıcı kontrolü
    const deletedCheck = await db.query(
      'SELECT * FROM deleted_users WHERE original_email = ? OR original_phone = ?',
      [data.email, data.phone]
    );
    if (deletedCheck.length > 0) {
      throw new Error('Bu e-posta veya telefon numarası daha önce silinmiş bir hesaba ait. Lütfen farklı bilgiler kullanın.');
    }

    // Email ve telefon kontrolü
    const existingEmail = await UserQueries.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }

    const existingPhone = await UserQueries.findByPhone(data.phone);
    if (existingPhone) {
      throw new Error('Bu telefon numarası zaten kullanımda');
    }

    // TC No kontrolü
    const existingTc = await StudentQueries.findByTcNo(data.tc_no);
    if (existingTc) {
      throw new Error('Bu T.C. Kimlik Numarası zaten kullanımda');
    }

    // Transaction ile kayıt
    return await db.transaction(async (connection) => {
      // Şifreyi hashle
      const passwordHash = await BcryptUtil.hash(data.password);

      // User kaydı oluştur
      const [userResult] = await connection.query(
        'INSERT INTO users (email, phone, password_hash, role) VALUES (?, ?, ?, ?)',
        [data.email, data.phone, passwordHash, USER_ROLES.STUDENT]
      );

      const userId = userResult.insertId;

      // GÜNCELLEME: department -> department_id ve address eklendi
      await connection.query(`
        INSERT INTO students (
          user_id, first_name, last_name, tc_no, birth_date,
          iban, university, department_id, student_document_url,
          kvkk_accepted, terms_accepted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        data.first_name,
        data.last_name,
        data.tc_no,
        data.birth_date,
        data.iban,
        data.university,
        data.department_id, 
        data.student_document_url,
        data.kvkk_accepted,
        data.terms_accepted
      ]);

      // Kullanıcı bilgilerini al (transaction içinde)
      const [users] = await connection.query(
        'SELECT id, email, phone, role, email_verified, phone_verified FROM users WHERE id = ?',
        [userId]
      );
      const user = users[0];

      // Token'ları oluştur
      const JwtUtil = require('../../../shared/utils/jwt.util');
      const payload = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role
      };
      const accessToken = JwtUtil.generateAccessToken(payload);
      const refreshToken = JwtUtil.generateRefreshToken(payload);

      // Refresh token'ı transaction içinde kaydet
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün
      await connection.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt]
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        access_token: accessToken,
        refresh_token: refreshToken
      };
    });
  }

  // GÖNDERİCİ KAYIT (Değişiklik yok)
  static async registerSender(data) {
    const deletedCheck = await db.query(
      'SELECT * FROM deleted_users WHERE original_email = ? OR original_phone = ?',
      [data.email, data.phone]
    );
    if (deletedCheck.length > 0) {
      throw new Error('Bu e-posta veya telefon numarası daha önce silinmiş bir hesaba ait.');
    }

    const existingEmail = await UserQueries.findByEmail(data.email);
    if (existingEmail) throw new Error('Bu e-posta adresi zaten kullanımda');

    const existingPhone = await UserQueries.findByPhone(data.phone);
    if (existingPhone) throw new Error('Bu telefon numarası zaten kullanımda');

    if (data.account_type === SENDER_TYPES.INDIVIDUAL) {
      const existingTc = await SenderQueries.findIndividualByUserId(data.tc_no);
      if (existingTc) throw new Error('Bu T.C. Kimlik Numarası zaten kullanımda');
    } else {
      const existingTax = await SenderQueries.findByTaxNumber(data.tax_number);
      if (existingTax) throw new Error('Bu vergi numarası zaten kullanımda');
    }

    return await db.transaction(async (connection) => {
      const passwordHash = await BcryptUtil.hash(data.password);

      const [userResult] = await connection.query(
        'INSERT INTO users (email, phone, password_hash, role) VALUES (?, ?, ?, ?)',
        [data.email, data.phone, passwordHash, USER_ROLES.SENDER]
      );

      const userId = userResult.insertId;

      if (data.account_type === SENDER_TYPES.INDIVIDUAL) {
        await connection.query(`
          INSERT INTO individual_senders (
            user_id, first_name, last_name, tc_no, billing_address,
            kvkk_accepted, terms_accepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [userId, data.first_name, data.last_name, data.tc_no, data.billing_address, data.kvkk_accepted, data.terms_accepted]);
      } else {
        await connection.query(`
          INSERT INTO corporate_senders (
            user_id, company_name, tax_office, tax_number, billing_address,
            kvkk_accepted, terms_accepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [userId, data.company_name, data.tax_office, data.tax_number, data.billing_address, data.kvkk_accepted, data.terms_accepted]);
      }

      const [users] = await connection.query('SELECT id, email, phone, role FROM users WHERE id = ?', [userId]);
      const user = users[0];

      const JwtUtil = require('../../../shared/utils/jwt.util');
      const payload = { id: user.id, email: user.email, phone: user.phone, role: user.role };
      const accessToken = JwtUtil.generateAccessToken(payload);
      const refreshToken = JwtUtil.generateRefreshToken(payload);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await connection.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt]
      );

      return {
        user: { ...user, account_type: data.account_type },
        access_token: accessToken,
        refresh_token: refreshToken
      };
    });
  }

  // GİRİŞ
  static async login(identifier, password) {
    const user = await UserQueries.findByEmailOrPhone(identifier);
    if (!user) throw new Error('E-posta/telefon veya şifre hatalı');
    if (!user.is_active) throw new Error('Hesabınız devre dışı bırakılmış');

    const isPasswordValid = await BcryptUtil.compare(password, user.password_hash);
    if (!isPasswordValid) throw new Error('E-posta/telefon veya şifre hatalı');

    if (user.role === USER_ROLES.STUDENT) {
      const student = await StudentQueries.findByUserId(user.id);
      if (!student.admin_approved) {
        throw new Error('Hesabınız henüz admin tarafından onaylanmamış');
      }
    }

    const tokens = await TokenService.generateTokenPair(user);
    return {
      user: {
        id: user.id, email: user.email, phone: user.phone, role: user.role,
        email_verified: user.email_verified, phone_verified: user.phone_verified
      },
      ...tokens
    };
  }

  static async logout(refreshToken) { await TokenService.revokeToken(refreshToken); }
  static async refreshToken(refreshToken) { return await TokenService.refreshAccessToken(refreshToken); }

  // ŞİFRE SIFIRLAMA - Yardımcı: gelen numarayı DB formatına (05XXXXXXXXX) normalize et
  static normalizePhoneForDB(phoneNumber) {
    const cleaned = String(phoneNumber).replace(/[\s\-().]/g, '');
    if (cleaned.startsWith('+90')) return '0' + cleaned.substring(3);
    if (cleaned.startsWith('90') && cleaned.length === 12) return '0' + cleaned.substring(2);
    if (cleaned.startsWith('0')) return cleaned;
    return '0' + cleaned;
  }

  // ŞİFRE SIFIRLAMA - Yardımcı: telefon numarasını uluslararası formata çevir (Firebase için)
  static formatPhoneToInternational(phoneNumber) {
    const cleaned = String(phoneNumber).replace(/[\s\-().]/g, '');
    if (cleaned.startsWith('+90')) return cleaned;
    if (cleaned.startsWith('90')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+90' + cleaned.substring(1);
    return '+90' + cleaned;
  }

  // ŞİFREMİ UNUTTUM - 1. adım: numara kayıtlı mı kontrol et
  // SMS göndermeden önce frontend bunu çağırır, kayıtlı değilse Firebase SMS akışı hiç başlamaz.
  static async checkPhoneExists(phoneNumber) {
  const normalized = this.normalizePhoneForDB(phoneNumber);
  console.log('checkPhoneExists DEBUG:', { gelen: phoneNumber, normalized });
  
  const user = await UserQueries.findByPhone(normalized);
  console.log('checkPhoneExists DEBUG user:', user ? user.id : 'bulunamadı');

  if (!user) {
    throw new Error('Bu telefon numarasıyla kayıtlı bir hesap bulunamadı');
  }
  if (!user.is_active) {
    throw new Error('Bu hesap devre dışı bırakılmış');
  }

  return { exists: true };
}

  // ŞİFREMİ UNUTTUM - 2. adım: Firebase ID token'ı doğrula ve şifreyi güncelle
  // GÜVENLİK: Firebase'in SMS doğrulamasını gerçekten tamamladığını kriptografik
  // olarak kanıtlayan bir ID token olmadan şifre asla değiştirilmez.
  static async resetPasswordWithPhone(phoneNumber, firebaseIdToken, newPassword) {
    if (!firebaseIdToken) {
      throw new Error('Firebase doğrulama token\'ı gerekli');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalı');
    }

    const normalizedPhone = this.normalizePhoneForDB(phoneNumber);
    const user = await UserQueries.findByPhone(normalizedPhone);
    if (!user) {
      throw new Error('Bu telefon numarasıyla kayıtlı bir hesap bulunamadı');
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(firebaseIdToken);
    } catch (err) {
      logger.error('Firebase ID token verification failed (password reset):', err);
      throw new Error('Geçersiz veya süresi dolmuş doğrulama token\'ı');
    }

    if (!decoded.phone_number) {
      throw new Error('Token telefon doğrulaması içermiyor');
    }

    const expectedPhone = this.formatPhoneToInternational(user.phone);
    if (decoded.phone_number !== expectedPhone) {
      logger.error('Phone mismatch on password reset', {
        userId: user.id,
        expected: expectedPhone,
        got: decoded.phone_number
      });
      throw new Error('Doğrulanan numara hesap numarasıyla eşleşmiyor');
    }

    const passwordHash = await BcryptUtil.hash(newPassword);
    await UserQueries.updateUser(user.id, { password_hash: passwordHash });

    logger.info('Password reset via Firebase SMS verification', { userId: user.id });

    return { success: true };
  }
}

module.exports = AuthService;