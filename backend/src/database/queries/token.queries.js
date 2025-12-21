const db = require('../connection');

class TokenQueries {
  static async saveRefreshToken(userId, token, expiresAt) {
    const sql = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;
    await db.query(sql, [userId, token, expiresAt]);
  }

  static async findRefreshToken(token) {
    const sql = 'SELECT * FROM refresh_tokens WHERE token = ?';
    const results = await db.query(sql, [token]);
    return results[0];
  }

  static async deleteRefreshToken(token) {
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    await db.query(sql, [token]);
  }

  static async deleteUserTokens(userId) {
    const sql = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    await db.query(sql, [userId]);
  }

  static async cleanExpiredTokens() {
    const sql = 'DELETE FROM refresh_tokens WHERE expires_at < NOW()';
    await db.query(sql);
  }
}

module.exports = TokenQueries;
