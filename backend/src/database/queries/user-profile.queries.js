const db = require('../connection');

class UserQueries {
  // =============================================
  // PROFİL GÜNCELLEME
  // =============================================

  // Öğrenci profil güncelle
  static async updateStudentProfile(userId, updates) {
    const allowedFields = ['first_name', 'last_name', 'address', 'iban', 'university'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    const sql = `UPDATE students SET ${fields.join(', ')} WHERE user_id = ?`;
    const result = await db.query(sql, [...values, userId]);
    return result.affectedRows > 0;
  }

  // Bireysel gönderici profil güncelle
  static async updateIndividualSenderProfile(userId, updates) {
    const allowedFields = ['first_name', 'last_name', 'billing_address'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    const sql = `UPDATE individual_senders SET ${fields.join(', ')} WHERE user_id = ?`;
    const result = await db.query(sql, [...values, userId]);
    return result.affectedRows > 0;
  }

  // Kurumsal gönderici profil güncelle
  static async updateCorporateSenderProfile(userId, updates) {
    const allowedFields = ['company_name', 'tax_office', 'billing_address'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    const sql = `UPDATE corporate_senders SET ${fields.join(', ')} WHERE user_id = ?`;
    const result = await db.query(sql, [...values, userId]);
    return result.affectedRows > 0;
  }

  // Email güncelle
  static async updateEmail(userId, newEmail) {
    const sql = 'UPDATE users SET email = ?, email_verified = FALSE WHERE id = ?';
    const result = await db.query(sql, [newEmail, userId]);
    return result.affectedRows > 0;
  }

  // Telefon güncelle
  static async updatePhone(userId, newPhone) {
    const sql = 'UPDATE users SET phone = ?, phone_verified = FALSE WHERE id = ?';
    const result = await db.query(sql, [newPhone, userId]);
    return result.affectedRows > 0;
  }

  // Şifre güncelle
  static async updatePassword(userId, newPasswordHash) {
    const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
    const result = await db.query(sql, [newPasswordHash, userId]);
    return result.affectedRows > 0;
  }

  // =============================================
  // GEÇMİŞ / HISTORY
  // =============================================

  // Öğrenci teslimat geçmişi
  static async getStudentDeliveryHistory(studentId, filters = {}) {
    let sql = `
      SELECT 
        d.id,
        d.order_number,
        d.pickup_district,
        d.delivery_district,
        d.payment_amount,
        d.status,
        d.payment_status,
        d.accepted_at,
        d.started_at,
        d.completed_at,
        d.created_at,
        u.email as sender_email,
        u.phone as sender_phone
      FROM deliveries d
      LEFT JOIN users u ON d.sender_user_id = u.id
      WHERE d.student_user_id = ?
    `;
    const params = [studentId];

    // Durum filtresi
    if (filters.status) {
      sql += ' AND d.status = ?';
      params.push(filters.status);
    }

    // Tarih filtresi
    if (filters.from_date) {
      sql += ' AND d.created_at >= ?';
      params.push(filters.from_date);
    }
    if (filters.to_date) {
      sql += ' AND d.created_at <= ?';
      params.push(filters.to_date);
    }

    sql += ' ORDER BY d.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // Öğrenci kazanç özeti
  static async getStudentEarningsSummary(studentId) {
    const sql = `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_jobs,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_jobs,
        SUM(CASE WHEN status = 'completed' THEN payment_amount ELSE 0 END) as total_earnings,
        SUM(CASE WHEN status = 'completed' AND payment_status = 'completed' THEN payment_amount ELSE 0 END) as paid_earnings,
        SUM(CASE WHEN status = 'completed' AND payment_status != 'completed' THEN payment_amount ELSE 0 END) as pending_earnings,
        AVG(CASE WHEN status = 'completed' THEN payment_amount END) as avg_earning_per_job
      FROM deliveries
      WHERE student_user_id = ?
    `;
    const results = await db.query(sql, [studentId]);
    return results[0];
  }

  // Gönderici kargo geçmişi
  static async getSenderOrderHistory(senderId, filters = {}) {
    let sql = `
      SELECT 
        d.id,
        d.order_number,
        d.pickup_district,
        d.delivery_district,
        d.payment_amount,
        d.status,
        d.payment_status,
        d.accepted_at,
        d.started_at,
        d.completed_at,
        d.created_at,
        u.email as student_email,
        u.phone as student_phone,
        s.first_name as student_first_name,
        s.last_name as student_last_name
      FROM deliveries d
      LEFT JOIN users u ON d.student_user_id = u.id
      LEFT JOIN students s ON u.id = s.user_id
      WHERE d.sender_user_id = ?
    `;
    const params = [senderId];

    // Durum filtresi
    if (filters.status) {
      sql += ' AND d.status = ?';
      params.push(filters.status);
    }

    // Tarih filtresi
    if (filters.from_date) {
      sql += ' AND d.created_at >= ?';
      params.push(filters.from_date);
    }
    if (filters.to_date) {
      sql += ' AND d.created_at <= ?';
      params.push(filters.to_date);
    }

    sql += ' ORDER BY d.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // Gönderici harcama özeti
  static async getSenderSpendingSummary(senderId) {
    const sql = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(CASE WHEN status = 'completed' THEN payment_amount ELSE 0 END) as total_spent,
        SUM(CASE WHEN status = 'completed' AND payment_status = 'completed' THEN payment_amount ELSE 0 END) as completed_payments,
        AVG(CASE WHEN status = 'completed' THEN payment_amount END) as avg_order_amount
      FROM deliveries
      WHERE sender_user_id = ?
    `;
    const results = await db.query(sql, [senderId]);
    return results[0];
  }
}

module.exports = UserQueries;
