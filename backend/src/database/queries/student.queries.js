const db = require('../connection');

class StudentQueries {
  static async createStudent(studentData) {
    const sql = `
      INSERT INTO students (
        user_id, first_name, last_name, tc_no, birth_date,
        iban, address, university, department, student_document_url,
        kvkk_accepted, terms_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      studentData.user_id,
      studentData.first_name,
      studentData.last_name,
      studentData.tc_no,
      studentData.birth_date,
      studentData.iban,
      studentData.address,
      studentData.university,
      studentData.department,
      studentData.student_document_url,
      studentData.kvkk_accepted,
      studentData.terms_accepted
    ]);
    return result.insertId;
  }

  static async findByUserId(userId) {
    const sql = 'SELECT * FROM students WHERE user_id = ?';
    const results = await db.query(sql, [userId]);
    return results[0];
  }

  static async findByTcNo(tcNo) {
    const sql = 'SELECT * FROM students WHERE tc_no = ?';
    const results = await db.query(sql, [tcNo]);
    return results[0];
  }

  static async approveStudent(userId) {
    const sql = 'UPDATE students SET admin_approved = TRUE WHERE user_id = ?';
    await db.query(sql, [userId]);
  }

  static async getStudentFullInfo(userId) {
  const sql = `
    SELECT 
      u.id, u.email, u.phone, u.role, u.email_verified, u.phone_verified,
      s.first_name, s.last_name, s.tc_no, s.birth_date, s.iban,
      s.address, s.university, s.department, s.student_document_url,
      s.profile_photo,
      s.admin_approved,
      s.created_at
    FROM users u
    INNER JOIN students s ON u.id = s.user_id
    WHERE u.id = ?
  `;
  const results = await db.query(sql, [userId]);
  return results[0];
}

  // ADMIN - TÜM ÖĞRENCİLER (İstatistiklerle)
  static async findAllWithStats(filters = {}) {
    let sql = `
      SELECT 
        u.id, u.email, u.phone, u.is_active, u.created_at,
        s.first_name, s.last_name, s.university, s.department, s.grade, s.student_number,
        COUNT(DISTINCT d.id) as total_jobs,
        COALESCE(SUM(CASE WHEN d.status = 'completed' THEN d.payment_amount ELSE 0 END), 0) as total_earnings
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      LEFT JOIN deliveries d ON u.id = d.student_user_id
      WHERE u.role = 'student'
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND u.is_active = ?';
      params.push(filters.is_active);
    }

    sql += ' GROUP BY u.id, u.email, u.phone, u.is_active, u.created_at, s.first_name, s.last_name, s.university, s.department, s.grade, s.student_number';
    sql += ' ORDER BY u.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }
}

module.exports = StudentQueries;
