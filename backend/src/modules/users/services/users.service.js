const UserProfileQueries = require('../../../database/queries/user-profile.queries');
const UserQueries = require('../../../database/queries/user.queries');
const StudentQueries = require('../../../database/queries/student.queries');
const SenderQueries = require('../../../database/queries/sender.queries');
const BcryptUtil = require('../../../shared/utils/bcrypt.util');
const { USER_ROLES } = require('../../../config/constants');

class UsersService {
  // =============================================
  // PROFİL GÜNCELLEME
  // =============================================

  static async updateProfile(userId, userRole, updates) {
    let success = false;

    if (userRole === USER_ROLES.STUDENT) {
      success = await UserProfileQueries.updateStudentProfile(userId, updates);
    } else if (userRole === USER_ROLES.SENDER) {
      // Bireysel mi kurumsal mı kontrol et
      const individual = await SenderQueries.findIndividualByUserId(userId);
      if (individual) {
        success = await UserProfileQueries.updateIndividualSenderProfile(userId, updates);
      } else {
        success = await UserProfileQueries.updateCorporateSenderProfile(userId, updates);
      }
    }

    if (!success) {
      throw new Error('Profil güncellenemedi');
    }

    // Güncellenmiş profili dön
    return await this.getProfile(userId, userRole);
  }

  static async updateEmail(userId, newEmail) {
    // Email zaten kullanımda mı?
    const existing = await UserQueries.findByEmail(newEmail);
    if (existing && existing.id !== userId) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }

    const success = await UserProfileQueries.updateEmail(userId, newEmail);
    if (!success) {
      throw new Error('E-posta güncellenemedi');
    }

    return { success: true, message: 'E-posta güncellendi. Lütfen e-postanızı doğrulayın.' };
  }

  static async updatePhone(userId, newPhone) {
    // Telefon zaten kullanımda mı?
    const existing = await UserQueries.findByPhone(newPhone);
    if (existing && existing.id !== userId) {
      throw new Error('Bu telefon numarası zaten kullanımda');
    }

    const success = await UserProfileQueries.updatePhone(userId, newPhone);
    if (!success) {
      throw new Error('Telefon numarası güncellenemedi');
    }

    return { success: true, message: 'Telefon numarası güncellendi. Lütfen telefonunuzu doğrulayın.' };
  }

  static async changePassword(userId, oldPassword, newPassword) {
    // Eski şifre doğru mu?
    const user = await UserQueries.findById(userId);
    const isValid = await BcryptUtil.compare(oldPassword, user.password_hash);
    
    if (!isValid) {
      throw new Error('Mevcut şifre hatalı');
    }

    // Yeni şifreyi hashle
    const newPasswordHash = await BcryptUtil.hash(newPassword);
    const success = await UserProfileQueries.updatePassword(userId, newPasswordHash);

    if (!success) {
      throw new Error('Şifre değiştirilemedi');
    }

    return { success: true, message: 'Şifre başarıyla değiştirildi' };
  }

  static async getProfile(userId, userRole) {
    if (userRole === USER_ROLES.STUDENT) {
      return await StudentQueries.getStudentFullInfo(userId);
    } else if (userRole === USER_ROLES.SENDER) {
      // Bireysel mi kurumsal mı?
      const individual = await SenderQueries.findIndividualByUserId(userId);
      if (individual) {
        return await SenderQueries.getIndividualFullInfo(userId);
      } else {
        return await SenderQueries.getCorporateFullInfo(userId);
      }
    }

    return await UserQueries.findById(userId);
  }

  // =============================================
  // GEÇMİŞ / HISTORY
  // =============================================

  static async getStudentHistory(studentId, filters) {
    const history = await UserProfileQueries.getStudentDeliveryHistory(studentId, filters);
    const summary = await UserProfileQueries.getStudentEarningsSummary(studentId);

    return {
      summary,
      history
    };
  }

  static async getSenderHistory(senderId, filters) {
    const history = await UserProfileQueries.getSenderOrderHistory(senderId, filters);
    const summary = await UserProfileQueries.getSenderSpendingSummary(senderId);

    return {
      summary,
      history
    };
  }
}

module.exports = UsersService;
