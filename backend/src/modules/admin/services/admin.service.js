const AdminQueries = require('../../../database/queries/admin.queries');

class AdminService {
  // =============================================
  // ÖĞRENCİ YÖNETİMİ
  // =============================================

  static async getAllStudents(filters) {
    return await AdminQueries.getAllStudents(filters);
  }

  static async getStudentDetail(studentId) {
    const student = await AdminQueries.getStudentDetail(studentId);
    if (!student) {
      throw new Error('Öğrenci bulunamadı');
    }
    return student;
  }

  static async approveStudent(studentId) {
    const success = await AdminQueries.approveStudent(studentId);
    if (!success) {
      throw new Error('Öğrenci onaylanamadı');
    }
    return await AdminQueries.getStudentDetail(studentId);
  }

  static async unapproveStudent(studentId) {
    const success = await AdminQueries.unapproveStudent(studentId);
    if (!success) {
      throw new Error('Öğrenci onayı kaldırılamadı');
    }
    return await AdminQueries.getStudentDetail(studentId);
  }

  // =============================================
  // GÖNDERİCİ YÖNETİMİ
  // =============================================

  static async getAllSenders(filters) {
    return await AdminQueries.getAllSenders(filters);
  }

  static async getSenderDetail(senderId) {
    const sender = await AdminQueries.getSenderDetail(senderId);
    if (!sender) {
      throw new Error('Gönderici bulunamadı');
    }
    return sender;
  }

  // =============================================
  // KULLANICI YÖNETİMİ
  // =============================================

  static async toggleUserStatus(userId, isActive) {
    const success = await AdminQueries.toggleUserStatus(userId, isActive);
    if (!success) {
      throw new Error('Kullanıcı durumu güncellenemedi');
    }
    return { success: true, isActive };
  }

  static async deleteUser(userId, reason) {
    const success = await AdminQueries.softDeleteUser(userId, reason);
    if (!success) {
      throw new Error('Kullanıcı silinemedi');
    }
    return { success: true };
  }

  // =============================================
  // İSTATİSTİKLER
  // =============================================

  static async getDashboardStats() {
    return await AdminQueries.getDashboardStats();
  }
}

module.exports = AdminService;
