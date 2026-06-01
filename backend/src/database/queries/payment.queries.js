const db = require('../connection');

class PaymentQueries {
  // İyzico ödeme bilgilerini kaydet
  static async saveIyzicoPayment(deliveryId, paymentId, conversationId) {
    const sql = `
      UPDATE deliveries 
      SET 
        iyzico_payment_id = ?,
        iyzico_conversation_id = ?,
        payment_method = 'iyzico',
        payment_status = 'sender_paid',
        sender_paid_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
    `;
    const result = await db.query(sql, [paymentId, conversationId, deliveryId]);
    return result.affectedRows > 0;
  }

  // Conversation ID ile delivery bul (callback için)
  static async findByConversationId(conversationId) {
    const sql = `SELECT * FROM deliveries WHERE iyzico_conversation_id = ?`;
    const results = await db.query(sql, [conversationId]);
    return results[0];
  }

  // Perşembe ödemesi için bekleyen öğrenci ödemeleri
  static async getPendingStudentPayments() {
    const sql = `
      SELECT 
        d.id,
        d.order_number,
        d.payment_amount,
        d.completed_at,
        u.id as student_user_id,
        u.email as student_email,
        u.phone as student_phone,
        s.first_name,
        s.last_name,
        s.iban
      FROM deliveries d
      JOIN users u ON d.student_user_id = u.id
      JOIN students s ON u.id = s.user_id
      WHERE d.status = 'completed'
        AND d.payment_status = 'sender_paid'
      ORDER BY d.completed_at ASC
    `;
    return await db.query(sql);
  }
}

module.exports = PaymentQueries;