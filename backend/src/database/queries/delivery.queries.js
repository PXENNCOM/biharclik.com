const db = require('../connection');

class DeliveryQueries {
  // SİPARİŞ NUMARASI OLUŞTUR (YYK-00001 formatında)
  static async generateOrderNumber() {
    const sql = `
      SELECT COUNT(*) as count FROM deliveries
    `;
    const results = await db.query(sql);
    const count = results[0].count + 1;
    return `YYK-${String(count).padStart(5, '0')}`;
  }

  // YENİ İŞ OLUŞTUR
  static async createDelivery(deliveryData) {
    const sql = `
      INSERT INTO deliveries (
        order_number, sender_user_id,
        pickup_address, pickup_district, pickup_latitude, pickup_longitude, pickup_contact_name, pickup_contact_phone, pickup_notes,
        delivery_address, delivery_district, delivery_latitude, delivery_longitude, delivery_contact_name, delivery_contact_phone, delivery_notes,
        package_description, package_size, payment_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      deliveryData.order_number,
      deliveryData.sender_user_id,
      deliveryData.pickup_address,
      deliveryData.pickup_district,
      deliveryData.pickup_latitude || null,
      deliveryData.pickup_longitude || null,
      deliveryData.pickup_contact_name,
      deliveryData.pickup_contact_phone,
      deliveryData.pickup_notes || null,
      deliveryData.delivery_address,
      deliveryData.delivery_district,
      deliveryData.delivery_latitude || null,
      deliveryData.delivery_longitude || null,
      deliveryData.delivery_contact_name,
      deliveryData.delivery_contact_phone,
      deliveryData.delivery_notes || null,
      deliveryData.package_description,
      deliveryData.package_size,
      deliveryData.payment_amount
    ]);
    return result.insertId;
  }

  // İŞ DETAYI
  static async findById(id) {
    const sql = `
      SELECT 
        d.*,
        s.email as sender_email,
        s.phone as sender_phone,
        st.email as student_email,
        st.phone as student_phone,
        stu.first_name as student_first_name,
        stu.last_name as student_last_name
      FROM deliveries d
      LEFT JOIN users s ON d.sender_user_id = s.id
      LEFT JOIN users st ON d.student_user_id = st.id
      LEFT JOIN students stu ON st.id = stu.user_id
      WHERE d.id = ?
    `;
    const results = await db.query(sql, [id]);
    return results[0];
  }

  // SİPARİŞ NUMARASINA GÖRE BUL
  static async findByOrderNumber(orderNumber) {
    const sql = 'SELECT * FROM deliveries WHERE order_number = ?';
    const results = await db.query(sql, [orderNumber]);
    return results[0];
  }

  // MÜSAİT İŞLER (Öğrenciler için - henüz kabul edilmemiş)
  static async findAvailableJobs(filters = {}) {
    let sql = `
      SELECT 
        d.*,
        s.email as sender_email,
        s.phone as sender_phone
      FROM deliveries d
      LEFT JOIN users s ON d.sender_user_id = s.id
      WHERE d.status = 'pending'
    `;
    const params = [];

    // İlçe filtresi
    if (filters.pickup_district) {
      sql += ' AND d.pickup_district = ?';
      params.push(filters.pickup_district);
    }
    if (filters.delivery_district) {
      sql += ' AND d.delivery_district = ?';
      params.push(filters.delivery_district);
    }

    // Harçlık filtresi
    if (filters.min_amount) {
      sql += ' AND d.payment_amount >= ?';
      params.push(filters.min_amount);
    }
    if (filters.max_amount) {
      sql += ' AND d.payment_amount <= ?';
      params.push(filters.max_amount);
    }

    sql += ' ORDER BY d.created_at DESC';

    // Limit
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // GÖNDERİCİNİN SİPARİŞLERİ
  static async findBySenderId(senderId, filters = {}) {
    let sql = `
      SELECT 
        d.*,
        st.email as student_email,
        st.phone as student_phone,
        stu.first_name as student_first_name,
        stu.last_name as student_last_name
      FROM deliveries d
      LEFT JOIN users st ON d.student_user_id = st.id
      LEFT JOIN students stu ON st.id = stu.user_id
      WHERE d.sender_user_id = ?
    `;
    const params = [senderId];

    // Durum filtresi
    if (filters.status) {
      sql += ' AND d.status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY d.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // ÖĞRENCİNİN İŞLERİ
static async findByStudentId(studentId, filters = {}) {
  let sql = `
    SELECT 
      d.*,
      s.email as sender_email,
      s.phone as sender_phone
    FROM deliveries d
    LEFT JOIN users s ON d.sender_user_id = s.id
    WHERE d.student_user_id = ?
  `;
  const params = [studentId];

  // ⭐ Durum filtresi - Array desteği
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      // Array ise IN kullan
      const placeholders = filters.status.map(() => '?').join(',');
      sql += ` AND d.status IN (${placeholders})`;
      params.push(...filters.status);
    } else {
      // String ise = kullan
      sql += ' AND d.status = ?';
      params.push(filters.status);
    }
  }

  sql += ' ORDER BY d.created_at DESC';

  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }

  return await db.query(sql, params);
}

  // İŞİ KABUL ET
static async acceptJob(deliveryId, studentId) {
  const query = `
    UPDATE deliveries 
    SET student_user_id = ?, 
        status = 'accepted', 
        accepted_at = NOW(), 
        updated_at = NOW()
    WHERE id = ? AND status = 'pending'
  `;
  
  // ⭐ DÜZELTİLDİ: Destructuring kaldırıldı
  const result = await db.query(query, [studentId, deliveryId]);
  
  // Result formatını kontrol et
  if (Array.isArray(result)) {
    return result[0]?.affectedRows > 0;
  }
  
  return result?.affectedRows > 0;
}

  // İŞE BAŞLA
  static async startJob(deliveryId, studentId) {
    const sql = `
      UPDATE deliveries 
      SET status = 'in_progress', 
          started_at = NOW()
      WHERE id = ? AND student_user_id = ? AND status = 'accepted'
    `;
    const result = await db.query(sql, [deliveryId, studentId]);
    return result.affectedRows > 0;
  }

  // İŞİ TAMAMLA
  static async completeJob(deliveryId, studentId) {
    const sql = `
      UPDATE deliveries 
      SET status = 'completed', 
          completed_at = NOW()
      WHERE id = ? AND student_user_id = ? AND status = 'in_progress'
    `;
    const result = await db.query(sql, [deliveryId, studentId]);
    return result.affectedRows > 0;
  }

  // İŞİ İPTAL ET
  static async cancelJob(deliveryId, userId, reason) {
    const sql = `
      UPDATE deliveries 
      SET status = 'cancelled', 
          cancelled_at = NOW(),
          cancellation_reason = ?
      WHERE id = ? AND sender_user_id = ? AND status IN ('pending', 'accepted')
    `;
    const result = await db.query(sql, [reason, deliveryId, userId]);
    return result.affectedRows > 0;
  }

  // ÖDEME DURUMU GÜNCELLE (Admin için)
  static async updatePaymentStatus(deliveryId, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const sql = `UPDATE deliveries SET ${fields} WHERE id = ?`;
    await db.query(sql, [...values, deliveryId]);
  }

  // ADMIN - TÜM İŞLER
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        d.*,
        s.email as sender_email,
        s.phone as sender_phone,
        st.email as student_email,
        st.phone as student_phone,
        stu.first_name as student_first_name,
        stu.last_name as student_last_name
      FROM deliveries d
      LEFT JOIN users s ON d.sender_user_id = s.id
      LEFT JOIN users st ON d.student_user_id = st.id
      LEFT JOIN students stu ON st.id = stu.user_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND d.status = ?';
      params.push(filters.status);
    }

    if (filters.payment_status) {
      sql += ' AND d.payment_status = ?';
      params.push(filters.payment_status);
    }

    sql += ' ORDER BY d.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // İSTATİSTİKLER
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN payment_amount ELSE 0 END) as total_completed_amount,
        AVG(CASE WHEN status = 'completed' THEN payment_amount END) as avg_payment
      FROM deliveries
    `;
    const results = await db.query(sql);
    return results[0];
  }
}

module.exports = DeliveryQueries;