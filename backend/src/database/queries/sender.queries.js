const db = require('../connection');

class SenderQueries {
  // BİREYSEL GÖNDERİCİ
  static async createIndividualSender(senderData) {
    const sql = `
      INSERT INTO individual_senders (
        user_id, first_name, last_name, tc_no, billing_address,
        kvkk_accepted, terms_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      senderData.user_id,
      senderData.first_name,
      senderData.last_name,
      senderData.tc_no,
      senderData.billing_address,
      senderData.kvkk_accepted,
      senderData.terms_accepted
    ]);
    return result.insertId;
  }

  static async findIndividualByUserId(userId) {
    const sql = 'SELECT * FROM individual_senders WHERE user_id = ?';
    const results = await db.query(sql, [userId]);
    return results[0];
  }

  static async getIndividualFullInfo(userId) {
    const sql = `
      SELECT 
        u.id, u.email, u.phone, u.role, u.email_verified, u.phone_verified,
        i.first_name, i.last_name, i.tc_no, i.billing_address, i.created_at
      FROM users u
      INNER JOIN individual_senders i ON u.id = i.user_id
      WHERE u.id = ?
    `;
    const results = await db.query(sql, [userId]);
    return results[0];
  }

  // KURUMSAL GÖNDERİCİ
  static async createCorporateSender(senderData) {
    const sql = `
      INSERT INTO corporate_senders (
        user_id, company_name, tax_office, tax_number, billing_address,
        kvkk_accepted, terms_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      senderData.user_id,
      senderData.company_name,
      senderData.tax_office,
      senderData.tax_number,
      senderData.billing_address,
      senderData.kvkk_accepted,
      senderData.terms_accepted
    ]);
    return result.insertId;
  }

  static async findCorporateByUserId(userId) {
    const sql = 'SELECT * FROM corporate_senders WHERE user_id = ?';
    const results = await db.query(sql, [userId]);
    return results[0];
  }

  static async getCorporateFullInfo(userId) {
    const sql = `
      SELECT 
        u.id, u.email, u.phone, u.role, u.email_verified, u.phone_verified,
        c.company_name, c.tax_office, c.tax_number, c.billing_address, c.created_at
      FROM users u
      INNER JOIN corporate_senders c ON u.id = c.user_id
      WHERE u.id = ?
    `;
    const results = await db.query(sql, [userId]);
    return results[0];
  }

  static async findByTaxNumber(taxNumber) {
    const sql = 'SELECT * FROM corporate_senders WHERE tax_number = ?';
    const results = await db.query(sql, [taxNumber]);
    return results[0];
  }
}

module.exports = SenderQueries;
