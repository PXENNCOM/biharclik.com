// Dosya: /src/modules/support/services/support.service.js

const SupportQueries = require('../../../database/queries/support.queries');
const DeliveryQueries = require('../../../database/queries/delivery.queries');
const { USER_ROLES } = require('../../../config/constants');
const logger = require('../../../shared/utils/logger.util');

class SupportService {
  // =============================================
  // TICKET OLUŞTURMA
  // =============================================

  static async createTicket(userId, ticketData) {
    // Delivery ID kontrolü (varsa)
    if (ticketData.delivery_id) {
      const delivery = await DeliveryQueries.findById(ticketData.delivery_id);
      
      // Delivery var mı?
      if (!delivery) {
        throw new Error('Teslimat bulunamadı');
      }

      // Kullanıcı bu deliveryla ilişkili mi?
      if (delivery.sender_user_id !== userId && delivery.student_user_id !== userId) {
        throw new Error('Bu teslimatla ilgili destek talebi oluşturamazsınız');
      }
    }

    // Ticket oluştur
    const result = await SupportQueries.createTicket({
      user_id: userId,
      delivery_id: ticketData.delivery_id,
      category: ticketData.category,
      message: ticketData.message,
      priority: ticketData.priority || 'normal'
    });

    logger.info('Ticket created', {
      ticketId: result.insertId,
      ticketNumber: result.ticketNumber,
      userId,
      category: ticketData.category
    });

    // Oluşturulan ticket'ı getir
    return await SupportQueries.getTicketDetail(result.insertId, userId);
  }

  // =============================================
  // TICKET LİSTELEME
  // =============================================

  static async getMyTickets(userId, filters) {
    return await SupportQueries.getUserTickets(userId, filters);
  }

  static async getAllTickets(filters) {
    return await SupportQueries.getAllTickets(filters);
  }

  // =============================================
  // TICKET DETAY
  // =============================================

  static async getTicketDetail(ticketId, userId, userRole) {
    const ticket = await SupportQueries.getTicketDetail(
      ticketId,
      userRole === USER_ROLES.ADMIN ? null : userId
    );

    if (!ticket) {
      throw new Error('Ticket bulunamadı veya erişim yetkiniz yok');
    }

    // Mesajları okundu işaretle
    const isAdminReading = userRole === USER_ROLES.ADMIN;
    await SupportQueries.markMessagesAsRead(ticketId, isAdminReading);

    return ticket;
  }

  // =============================================
  // MESAJ GÖNDERME
  // =============================================

  static async addMessage(ticketId, userId, userRole, messageData) {
    // Ticket var mı ve yetkili mi?
    const ticket = await SupportQueries.getTicketDetail(
      ticketId,
      userRole === USER_ROLES.ADMIN ? null : userId
    );

    if (!ticket) {
      throw new Error('Ticket bulunamadı veya erişim yetkiniz yok');
    }

    // Kapalı ticket'a mesaj gönderilemez
    if (ticket.status === 'closed') {
      throw new Error('Kapalı ticket\'a mesaj gönderilemez');
    }

    // Mesaj ekle
    const messageId = await SupportQueries.addMessage({
      ticket_id: ticketId,
      user_id: userId,
      message: messageData.message,
      is_admin_reply: userRole === USER_ROLES.ADMIN
    });

    logger.info('Message added to ticket', {
      ticketId,
      messageId,
      userId,
      isAdminReply: userRole === USER_ROLES.ADMIN
    });

    // Güncel ticket detayını dön
    return await SupportQueries.getTicketDetail(ticketId);
  }

  // =============================================
  // TICKET DURUM GÜNCELLEMELERİ (ADMIN)
  // =============================================

  static async updateTicketStatus(ticketId, status) {
    const validStatuses = ['open', 'answered', 'waiting_user', 'resolved', 'closed'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Geçersiz durum');
    }

    const success = await SupportQueries.updateTicketStatus(ticketId, status);
    
    if (!success) {
      throw new Error('Ticket durumu güncellenemedi');
    }

    logger.info('Ticket status updated', { ticketId, status });

    return await SupportQueries.getTicketDetail(ticketId);
  }

  static async closeTicket(ticketId, adminId) {
    const success = await SupportQueries.closeTicket(ticketId, adminId);
    
    if (!success) {
      throw new Error('Ticket kapatılamadı');
    }

    logger.info('Ticket closed', { ticketId, closedBy: adminId });

    return await SupportQueries.getTicketDetail(ticketId);
  }

  static async reopenTicket(ticketId) {
    const success = await SupportQueries.updateTicketStatus(ticketId, 'open');
    
    if (!success) {
      throw new Error('Ticket yeniden açılamadı');
    }

    logger.info('Ticket reopened', { ticketId });

    return await SupportQueries.getTicketDetail(ticketId);
  }

  // =============================================
  // İSTATİSTİKLER (ADMIN)
  // =============================================

  static async getSupportStats() {
    return await SupportQueries.getSupportStats();
  }
}

module.exports = SupportService;