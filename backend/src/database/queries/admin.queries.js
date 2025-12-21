const db = require('../connection');

class AdminQueries {
  // =============================================
  // ÖĞRENCİ YÖNETİMİ
  // =============================================

  // Tüm öğrencileri listele
  static async getAllStudents(filters = {}) {
    let sql = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        s.first_name,
        s.last_name,
        s.tc_no,
        s.birth_date,
        s.iban,
        s.address,
        s.university,
        s.department,
        s.student_number,
        s.grade,
        s.student_document_url,
        s.admin_approved,
        COUNT(DISTINCT d.id) as total_jobs,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_jobs,
        COALESCE(SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END), 0) as total_earnings
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      LEFT JOIN deliveries d ON u.id = d.student_user_id
      WHERE u.role = 'student'
    `;
    const params = [];

    // Filtreleme
    if (filters.admin_approved !== undefined) {
      sql += ' AND s.admin_approved = ?';
      params.push(filters.admin_approved);
    }

    if (filters.is_active !== undefined) {
      sql += ' AND u.is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.university) {
      sql += ' AND s.university LIKE ?';
      params.push(`%${filters.university}%`);
    }

    sql += ' GROUP BY u.id, u.email, u.phone, u.email_verified, u.phone_verified, u.is_active, u.created_at, s.first_name, s.last_name, s.tc_no, s.birth_date, s.iban, s.address, s.university, s.department, s.student_number, s.grade, s.student_document_url, s.admin_approved';
    sql += ' ORDER BY s.admin_approved ASC, u.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // Öğrenci detayı
  static async getStudentDetail(studentId) {
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        s.first_name,
        s.last_name,
        s.tc_no,
        s.birth_date,
        s.iban,
        s.address,
        s.university,
        s.department,
        s.student_document_url,
        s.admin_approved,
        COUNT(DISTINCT d.id) as total_deliveries,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_deliveries,
        SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END) as total_earnings
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      LEFT JOIN deliveries d ON u.id = d.student_user_id
      WHERE u.id = ? AND u.role = 'student'
      GROUP BY u.id
    `;
    const results = await db.query(sql, [studentId]);
    return results[0];
  }

  // Öğrenciyi onayla
  static async approveStudent(studentId) {
    const sql = 'UPDATE students SET admin_approved = TRUE WHERE user_id = ?';
    const result = await db.query(sql, [studentId]);
    return result.affectedRows > 0;
  }

  // Öğrenci onayını kaldır
  static async unapproveStudent(studentId) {
    const sql = 'UPDATE students SET admin_approved = FALSE WHERE user_id = ?';
    const result = await db.query(sql, [studentId]);
    return result.affectedRows > 0;
  }

  // =============================================
  // GÖNDERİCİ YÖNETİMİ
  // =============================================

  // Tüm göndericileri listele
  static async getAllSenders(filters = {}) {
    let sql = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        'individual' as sender_type,
        i.first_name,
        i.last_name,
        i.tc_no,
        NULL as company_name,
        NULL as tax_number,
        COUNT(DISTINCT d.id) as total_orders,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_orders,
        COALESCE(SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END), 0) as total_spent
      FROM users u
      INNER JOIN individual_senders i ON u.id = i.user_id
      LEFT JOIN deliveries d ON u.id = d.sender_user_id
      WHERE u.role = 'sender'
      GROUP BY u.id
      
      UNION ALL
      
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        'corporate' as sender_type,
        NULL as first_name,
        NULL as last_name,
        NULL as tc_no,
        c.company_name,
        c.tax_number,
        COUNT(DISTINCT d.id) as total_orders,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_orders,
        COALESCE(SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END), 0) as total_spent
      FROM users u
      INNER JOIN corporate_senders c ON u.id = c.user_id
      LEFT JOIN deliveries d ON u.id = d.sender_user_id
      WHERE u.role = 'sender'
      GROUP BY u.id
    `;

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      return await db.query(sql, [parseInt(filters.limit)]);
    }

    return await db.query(sql);
  }

  // Gönderici detayı
  static async getSenderDetail(senderId) {
    // Önce bireysel mi kontrol et
    const individualSql = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        'individual' as sender_type,
        i.first_name,
        i.last_name,
        i.tc_no,
        i.billing_address,
        NULL as company_name,
        NULL as tax_office,
        NULL as tax_number,
        COUNT(DISTINCT d.id) as total_orders,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_orders,
        SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END) as total_spent
      FROM users u
      INNER JOIN individual_senders i ON u.id = i.user_id
      LEFT JOIN deliveries d ON u.id = d.sender_user_id
      WHERE u.id = ? AND u.role = 'sender'
      GROUP BY u.id
    `;
    
    let results = await db.query(individualSql, [senderId]);
    if (results.length > 0) return results[0];

    // Kurumsal kontrol et
    const corporateSql = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        u.email_verified,
        u.phone_verified,
        u.is_active,
        u.created_at,
        'corporate' as sender_type,
        NULL as first_name,
        NULL as last_name,
        NULL as tc_no,
        c.billing_address,
        c.company_name,
        c.tax_office,
        c.tax_number,
        COUNT(DISTINCT d.id) as total_orders,
        COUNT(DISTINCT CASE WHEN d.status = 'completed' THEN d.id END) as completed_orders,
        SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END) as total_spent
      FROM users u
      INNER JOIN corporate_senders c ON u.id = c.user_id
      LEFT JOIN deliveries d ON u.id = d.sender_user_id
      WHERE u.id = ? AND u.role = 'sender'
      GROUP BY u.id
    `;
    
    results = await db.query(corporateSql, [senderId]);
    return results[0];
  }

  // =============================================
  // KULLANICI YÖNETİMİ
  // =============================================

  // Kullanıcıyı aktif/pasif yap
  static async toggleUserStatus(userId, isActive) {
    const sql = 'UPDATE users SET is_active = ? WHERE id = ?';
    const result = await db.query(sql, [isActive, userId]);
    return result.affectedRows > 0;
  }

  // Kullanıcıyı sil (soft delete)
  static async softDeleteUser(userId, reason) {
    const sql = `
      UPDATE users 
      SET is_active = FALSE, 
          email = CONCAT('DELETED_', id, '_', email),
          phone = CONCAT('DELETED_', id, '_', phone)
      WHERE id = ?
    `;
    const result = await db.query(sql, [userId]);
    
    // Silme kaydı ekle
    if (result.affectedRows > 0) {
      await db.query(
        'INSERT INTO deleted_users (user_id, original_email, original_phone, deletion_reason, deleted_at) VALUES (?, (SELECT email FROM users WHERE id = ?), (SELECT phone FROM users WHERE id = ?), ?, NOW())',
        [userId, userId, userId, reason]
      );
    }
    
    return result.affectedRows > 0;
  }

  // =============================================
  // İSTATİSTİKLER
  // =============================================

  // Dashboard istatistikleri
  static async getDashboardStats() {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM students WHERE admin_approved = TRUE) as approved_students,
        (SELECT COUNT(*) FROM students WHERE admin_approved = FALSE) as pending_students,
        (SELECT COUNT(*) FROM users WHERE role = 'sender') as total_senders,
        (SELECT COUNT(*) FROM deliveries) as total_deliveries,
        (SELECT COUNT(*) FROM deliveries WHERE status = 'pending') as pending_deliveries,
        (SELECT COUNT(*) FROM deliveries WHERE status = 'in_progress') as active_deliveries,
        (SELECT COUNT(*) FROM deliveries WHERE status = 'completed') as completed_deliveries,
        (SELECT COUNT(*) FROM deliveries WHERE payment_status = 'waiting') as waiting_payments,
        (SELECT COUNT(*) FROM deliveries WHERE payment_status = 'sender_paid') as sender_paid_count,
        (SELECT SUM(payment_amount) FROM deliveries WHERE status = 'completed') as total_completed_amount,
        (SELECT AVG(payment_amount) FROM deliveries WHERE status = 'completed') as avg_delivery_payment
    `;
    const results = await db.query(sql);
    return results[0];
  }
}

module.exports = AdminQueries;
