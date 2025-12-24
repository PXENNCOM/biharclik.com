const BcryptUtil = require('../../../shared/utils/bcrypt.util');
const UserQueries = require('../../../database/queries/user.queries');
const StudentQueries = require('../../../database/queries/student.queries');
const SenderQueries = require('../../../database/queries/sender.queries');
const TokenService = require('./token.service');
const db = require('../../../database/connection');
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

      await connection.query(`
  INSERT INTO students (
    user_id, first_name, last_name, tc_no, birth_date,
    iban, address, university, department, student_document_url,
    profile_photo, kvkk_accepted, terms_accepted
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [
        userId,
        data.first_name,
        data.last_name,
        data.tc_no,
        data.birth_date,
        data.iban,
        data.address,
        data.university,
        data.department,
        data.student_document_url,
        data.profile_photo, 
        data.kvkk_accepted,
        data.terms_accepted
      ]);

      // Kullanıcı bilgilerini al (transaction içinde)
      const [users] = await connection.query(
        'SELECT id, email, phone, role, email_verified, phone_verified FROM users WHERE id = ?',
        [userId]
      );
      const user = users[0];

      // Token'ları oluştur (ama henüz DB'ye kaydetme)
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

  // GÖNDERİCİ KAYIT
  static async registerSender(data) {
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

    // TC No veya Vergi No kontrolü
    if (data.account_type === SENDER_TYPES.INDIVIDUAL) {
      const existingTc = await SenderQueries.findIndividualByUserId(data.tc_no);
      if (existingTc) {
        throw new Error('Bu T.C. Kimlik Numarası zaten kullanımda');
      }
    } else {
      const existingTax = await SenderQueries.findByTaxNumber(data.tax_number);
      if (existingTax) {
        throw new Error('Bu vergi numarası zaten kullanımda');
      }
    }

    // Transaction ile kayıt
    return await db.transaction(async (connection) => {
      // Şifreyi hashle
      const passwordHash = await BcryptUtil.hash(data.password);

      // User kaydı oluştur
      const [userResult] = await connection.query(
        'INSERT INTO users (email, phone, password_hash, role) VALUES (?, ?, ?, ?)',
        [data.email, data.phone, passwordHash, USER_ROLES.SENDER]
      );

      const userId = userResult.insertId;

      // Hesap tipine göre kayıt
      if (data.account_type === SENDER_TYPES.INDIVIDUAL) {
        await connection.query(`
          INSERT INTO individual_senders (
            user_id, first_name, last_name, tc_no, billing_address,
            kvkk_accepted, terms_accepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          data.first_name,
          data.last_name,
          data.tc_no,
          data.billing_address,
          data.kvkk_accepted,
          data.terms_accepted
        ]);
      } else {
        await connection.query(`
          INSERT INTO corporate_senders (
            user_id, company_name, tax_office, tax_number, billing_address,
            kvkk_accepted, terms_accepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          data.company_name,
          data.tax_office,
          data.tax_number,
          data.billing_address,
          data.kvkk_accepted,
          data.terms_accepted
        ]);
      }

      // Kullanıcı bilgilerini al (transaction içinde)
      const [users] = await connection.query(
        'SELECT id, email, phone, role, email_verified, phone_verified FROM users WHERE id = ?',
        [userId]
      );
      const user = users[0];

      // Token'ları oluştur (ama henüz DB'ye kaydetme)
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
          role: user.role,
          account_type: data.account_type
        },
        access_token: accessToken,
        refresh_token: refreshToken
      };
    });
  }

  // GİRİŞ
  static async login(identifier, password) {
    // Kullanıcıyı bul (email veya telefon ile)
    const user = await UserQueries.findByEmailOrPhone(identifier);

    if (!user) {
      throw new Error('E-posta/telefon veya şifre hatalı');
    }

    // Hesap aktif mi?
    if (!user.is_active) {
      throw new Error('Hesabınız devre dışı bırakılmış');
    }

    // Şifre kontrolü
    const isPasswordValid = await BcryptUtil.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('E-posta/telefon veya şifre hatalı');
    }

    // Öğrenci ise admin onayını kontrol et
    if (user.role === USER_ROLES.STUDENT) {
      const student = await StudentQueries.findByUserId(user.id);
      if (!student.admin_approved) {
        throw new Error('Hesabınız henüz admin tarafından onaylanmamış');
      }
    }

    // Token oluştur
    const tokens = await TokenService.generateTokenPair(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified
      },
      ...tokens
    };
  }

  // ÇIKIŞ
  static async logout(refreshToken) {
    await TokenService.revokeToken(refreshToken);
  }

  // TOKEN YENİLE
  static async refreshToken(refreshToken) {
    return await TokenService.refreshAccessToken(refreshToken);
  }
}

module.exports = AuthService;
