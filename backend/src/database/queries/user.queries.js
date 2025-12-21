const db = require('../connection');

class UserQueries {
  static async createUser(userData) {
    const sql = `
      INSERT INTO users (email, phone, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      userData.email,
      userData.phone,
      userData.password_hash,
      userData.role
    ]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await db.query(sql, [email]);
    return results[0];
  }

  static async findByPhone(phone) {
    const sql = 'SELECT * FROM users WHERE phone = ?';
    const results = await db.query(sql, [phone]);
    return results[0];
  }

  static async findByEmailOrPhone(identifier) {
    const sql = 'SELECT * FROM users WHERE email = ? OR phone = ?';
    const results = await db.query(sql, [identifier, identifier]);
    return results[0];
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await db.query(sql, [id]);
    return results[0];
  }

  static async updateUser(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    await db.query(sql, [...values, id]);
  }

  static async verifyEmail(userId) {
    const sql = 'UPDATE users SET email_verified = TRUE WHERE id = ?';
    await db.query(sql, [userId]);
  }

  static async verifyPhone(userId) {
    const sql = 'UPDATE users SET phone_verified = TRUE WHERE id = ?';
    await db.query(sql, [userId]);
  }
}

module.exports = UserQueries;
