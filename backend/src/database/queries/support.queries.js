// Dosya: /database/queries/support.queries.js

const db = require('../connection');

class SupportQueries {
  // =============================================
  // TICKET İŞLEMLERİ
  // =============================================

  // Yeni ticket oluştur
  static async createTicket(ticketData) {
    // Ticket numarası oluştur: TKT-YYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    
    // Bugün oluşturulan son ticket numarasını bul
    const lastTicketSql = `
      SELECT ticket_number 
      FROM support_tickets 
      WHERE ticket_number LIKE ?
      ORDER BY id DESC 
      LIMIT 1
    `;
    const lastTickets = await db.query(lastTicketSql, [`TKT-${dateStr}-%`]);
    
    let sequence = 1;
    if (lastTickets.length > 0) {
      const lastNumber = lastTickets[0].ticket_number.split('-')[2];
      sequence = parseInt(lastNumber) + 1;
    }
    
    const ticketNumber = `TKT-${dateStr}-${String(sequence).padStart(4, '0')}`;

    const sql = `
      INSERT INTO support_tickets (
        ticket_number, user_id, delivery_id, category, message, priority, status, last_message_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const result = await db.query(sql, [
      ticketNumber,
      ticketData.user_id,
      ticketData.delivery_id || null,
      ticketData.category,
      ticketData.message,
      ticketData.priority || 'normal',
      'open'
    ]);

    // İlk mesajı da ekle
    await this.addMessage({
      ticket_id: result.insertId,
      user_id: ticketData.user_id,
      message: ticketData.message,
      is_admin_reply: false
    });

    return { insertId: result.insertId, ticketNumber };
  }

  // Ticket'a mesaj ekle
  static async addMessage(messageData) {
    const sql = `
      INSERT INTO support_messages (
        ticket_id, user_id, message, is_admin_reply
      ) VALUES (?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      messageData.ticket_id,
      messageData.user_id,
      messageData.message,
      messageData.is_admin_reply || false
    ]);

    // Ticket'ın last_message_at'ini güncelle
    await db.query(
      'UPDATE support_tickets SET last_message_at = NOW() WHERE id = ?',
      [messageData.ticket_id]
    );

    // Eğer admin mesaj attıysa status'u güncelle
    if (messageData.is_admin_reply) {
      await db.query(
        'UPDATE support_tickets SET status = ? WHERE id = ?',
        ['answered', messageData.ticket_id]
      );
    } else {
      // Kullanıcı mesaj attıysa waiting_user'dan open'a çek
      await db.query(
        'UPDATE support_tickets SET status = ? WHERE id = ? AND status = ?',
        ['open', messageData.ticket_id, 'waiting_user']
      );
    }

    return result.insertId;
  }

  // Dosya ekle
  static async addAttachment(attachmentData) {
    const sql = `
      INSERT INTO support_attachments (
        message_id, file_name, file_path, file_type, file_size
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      attachmentData.message_id,
      attachmentData.file_name,
      attachmentData.file_path,
      attachmentData.file_type,
      attachmentData.file_size
    ]);

    return result.insertId;
  }

  // Kullanıcının ticket'larını getir
  static async getUserTickets(userId, filters = {}) {
    let sql = `
      SELECT 
        t.id,
        t.ticket_number,
        t.category,
        t.priority,
        t.status,
        t.delivery_id,
        t.created_at,
        t.last_message_at,
        t.message as first_message,
        d.order_number,
        (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id) as message_count,
        (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id AND is_read = FALSE AND is_admin_reply = TRUE) as unread_count
      FROM support_tickets t
      LEFT JOIN deliveries d ON t.delivery_id = d.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      sql += ' AND t.category = ?';
      params.push(filters.category);
    }

    sql += ' ORDER BY t.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // Ticket detayı getir (mesajlarla birlikte)
  static async getTicketDetail(ticketId, userId = null) {
    const ticketSql = `
      SELECT 
        t.*,
        u.email as user_email,
        u.phone as user_phone,
        u.role as user_role,
        CASE 
          WHEN u.role = 'student' THEN CONCAT(s.first_name, ' ', s.last_name)
          WHEN u.role = 'sender' AND i.user_id IS NOT NULL THEN CONCAT(i.first_name, ' ', i.last_name)
          WHEN u.role = 'sender' AND c.user_id IS NOT NULL THEN c.company_name
          ELSE 'Bilinmeyen'
        END as user_name,
        d.order_number,
        d.status as delivery_status
      FROM support_tickets t
      INNER JOIN users u ON t.user_id = u.id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN individual_senders i ON u.id = i.user_id
      LEFT JOIN corporate_senders c ON u.id = c.user_id
      LEFT JOIN deliveries d ON t.delivery_id = d.id
      WHERE t.id = ?
    `;
    
    let ticketParams = [ticketId];
    
    // Eğer userId verilmişse, sadece o kullanıcının ticketını getir
    if (userId) {
      const ticketSqlWithUser = ticketSql + ' AND t.user_id = ?';
      ticketParams.push(userId);
      const tickets = await db.query(ticketSqlWithUser, ticketParams);
      if (tickets.length === 0) return null;
    } else {
      const tickets = await db.query(ticketSql, [ticketId]);
      if (tickets.length === 0) return null;
    }

    const tickets = await db.query(userId ? ticketSql + ' AND t.user_id = ?' : ticketSql, ticketParams);
    if (tickets.length === 0) return null;

    const ticket = tickets[0];

    // Mesajları getir
    const messagesSql = `
      SELECT 
        m.id,
        m.message,
        m.is_admin_reply,
        m.is_read,
        m.created_at,
        m.user_id,
        u.email as sender_email,
        CASE 
          WHEN u.role = 'admin' THEN 'Destek Ekibi'
          WHEN u.role = 'student' THEN CONCAT(s.first_name, ' ', s.last_name)
          WHEN u.role = 'sender' AND i.user_id IS NOT NULL THEN CONCAT(i.first_name, ' ', i.last_name)
          WHEN u.role = 'sender' AND c.user_id IS NOT NULL THEN c.company_name
          ELSE 'Bilinmeyen'
        END as sender_name
      FROM support_messages m
      INNER JOIN users u ON m.user_id = u.id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN individual_senders i ON u.id = i.user_id
      LEFT JOIN corporate_senders c ON u.id = c.user_id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
    `;

    const messages = await db.query(messagesSql, [ticketId]);

    // Her mesaj için attachments getir
    for (let message of messages) {
      const attachmentsSql = `
        SELECT id, file_name, file_path, file_type, file_size
        FROM support_attachments
        WHERE message_id = ?
      `;
      message.attachments = await db.query(attachmentsSql, [message.id]);
    }

    return {
      ...ticket,
      messages
    };
  }

  // Tüm ticketları getir (ADMIN)
  static async getAllTickets(filters = {}) {
    let sql = `
      SELECT 
        t.id,
        t.ticket_number,
        t.category,
        t.priority,
        t.status,
        t.delivery_id,
        t.created_at,
        t.last_message_at,
        t.user_id,
        t.message as first_message,
        u.email as user_email,
        u.role as user_role,
        CASE 
          WHEN u.role = 'student' THEN CONCAT(s.first_name, ' ', s.last_name)
          WHEN u.role = 'sender' AND i.user_id IS NOT NULL THEN CONCAT(i.first_name, ' ', i.last_name)
          WHEN u.role = 'sender' AND c.user_id IS NOT NULL THEN c.company_name
          ELSE 'Bilinmeyen'
        END as user_name,
        d.order_number,
        (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id) as message_count,
        (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id AND is_read = FALSE AND is_admin_reply = FALSE) as unread_admin_count
      FROM support_tickets t
      INNER JOIN users u ON t.user_id = u.id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN individual_senders i ON u.id = i.user_id
      LEFT JOIN corporate_senders c ON u.id = c.user_id
      LEFT JOIN deliveries d ON t.delivery_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      sql += ' AND t.category = ?';
      params.push(filters.category);
    }

    if (filters.priority) {
      sql += ' AND t.priority = ?';
      params.push(filters.priority);
    }

    if (filters.user_role) {
      sql += ' AND u.role = ?';
      params.push(filters.user_role);
    }

    sql += ' ORDER BY t.priority DESC, t.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await db.query(sql, params);
  }

  // Ticket durumunu güncelle
  static async updateTicketStatus(ticketId, status) {
    const sql = 'UPDATE support_tickets SET status = ?, updated_at = NOW() WHERE id = ?';
    const result = await db.query(sql, [status, ticketId]);
    return result.affectedRows > 0;
  }

  // Ticket'ı kapat
  static async closeTicket(ticketId, closedBy) {
    const sql = `
      UPDATE support_tickets 
      SET status = 'closed', closed_at = NOW(), closed_by = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const result = await db.query(sql, [closedBy, ticketId]);
    return result.affectedRows > 0;
  }

  // Mesajları okundu işaretle
  static async markMessagesAsRead(ticketId, isAdminReading) {
    const sql = `
      UPDATE support_messages 
      SET is_read = TRUE 
      WHERE ticket_id = ? AND is_admin_reply = ?
    `;
    await db.query(sql, [ticketId, !isAdminReading]);
  }

  // Destek istatistikleri (ADMIN)
  static async getSupportStats() {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM support_tickets) as total_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'answered') as answered_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'waiting_user') as waiting_user_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'resolved') as resolved_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'closed') as closed_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE priority = 'urgent') as urgent_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE priority = 'high') as high_priority_tickets,
        (SELECT COUNT(*) FROM support_messages WHERE is_read = FALSE AND is_admin_reply = FALSE) as unread_messages,
        (SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, closed_at)) FROM support_tickets WHERE status = 'closed' AND closed_at IS NOT NULL) as avg_resolution_hours
    `;
    const results = await db.query(sql);
    return results[0];
  }
}

module.exports = SupportQueries;