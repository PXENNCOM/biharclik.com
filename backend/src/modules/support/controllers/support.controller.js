// Dosya: /src/modules/support/controllers/support.controller.js

const SupportService = require('../services/support.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class SupportController {
  // =============================================
  // TICKET OLUŞTURMA
  // =============================================

  static async createTicket(req, res, next) {
    try {
      const ticketData = {
        category: req.body.category,
        message: req.body.message,
        delivery_id: req.body.delivery_id || null,
        priority: req.body.priority || 'normal'
      };

      logger.info('Creating ticket', {
        userId: req.user.id,
        category: ticketData.category
      });

      const ticket = await SupportService.createTicket(req.user.id, ticketData);

      return ApiResponse.success(
        res,
        'Destek talebiniz oluşturuldu. En kısa sürede size dönüş yapılacaktır.',
        ticket,
        201
      );
    } catch (error) {
      logger.error('Create ticket error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // TICKET LİSTELEME
  // =============================================

  static async getMyTickets(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        category: req.query.category,
        limit: req.query.limit || 50
      };

      logger.info('Getting user tickets', {
        userId: req.user.id,
        filters
      });

      const tickets = await SupportService.getMyTickets(req.user.id, filters);

      return ApiResponse.success(
        res,
        'Destek talepleriniz listelendi',
        {
          count: tickets.length,
          tickets
        }
      );
    } catch (error) {
      logger.error('Get my tickets error:', error);
      next(error);
    }
  }

  static async getAllTickets(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        category: req.query.category,
        priority: req.query.priority,
        user_role: req.query.user_role,
        limit: req.query.limit || 100
      };

      logger.info('Getting all tickets (admin)', { filters });

      const tickets = await SupportService.getAllTickets(filters);

      return ApiResponse.success(
        res,
        'Tüm destek talepleri listelendi',
        {
          count: tickets.length,
          tickets
        }
      );
    } catch (error) {
      logger.error('Get all tickets error:', error);
      next(error);
    }
  }

  // =============================================
  // TICKET DETAY
  // =============================================

  static async getTicketDetail(req, res, next) {
    try {
      logger.info('Getting ticket detail', {
        ticketId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role
      });

      const ticket = await SupportService.getTicketDetail(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return ApiResponse.success(
        res,
        'Destek talebi detayı getirildi',
        ticket
      );
    } catch (error) {
      logger.error('Get ticket detail error:', error);
      return ApiResponse.error(res, error.message, 404);
    }
  }

  // =============================================
  // MESAJ GÖNDERME
  // =============================================

  static async addMessage(req, res, next) {
    try {
      const messageData = {
        message: req.body.message
      };

      logger.info('Adding message to ticket', {
        ticketId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role
      });

      const ticket = await SupportService.addMessage(
        req.params.id,
        req.user.id,
        req.user.role,
        messageData
      );

      return ApiResponse.success(
        res,
        'Mesajınız gönderildi',
        ticket
      );
    } catch (error) {
      logger.error('Add message error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // TICKET DURUM GÜNCELLEMELERİ (ADMIN)
  // =============================================

  static async updateTicketStatus(req, res, next) {
    try {
      const { status } = req.body;

      logger.info('Updating ticket status', {
        ticketId: req.params.id,
        status,
        adminId: req.user.id
      });

      const ticket = await SupportService.updateTicketStatus(req.params.id, status);

      return ApiResponse.success(
        res,
        'Ticket durumu güncellendi',
        ticket
      );
    } catch (error) {
      logger.error('Update ticket status error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async closeTicket(req, res, next) {
    try {
      logger.info('Closing ticket', {
        ticketId: req.params.id,
        adminId: req.user.id
      });

      const ticket = await SupportService.closeTicket(req.params.id, req.user.id);

      return ApiResponse.success(
        res,
        'Ticket kapatıldı',
        ticket
      );
    } catch (error) {
      logger.error('Close ticket error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async reopenTicket(req, res, next) {
    try {
      logger.info('Reopening ticket', {
        ticketId: req.params.id,
        adminId: req.user.id
      });

      const ticket = await SupportService.reopenTicket(req.params.id);

      return ApiResponse.success(
        res,
        'Ticket yeniden açıldı',
        ticket
      );
    } catch (error) {
      logger.error('Reopen ticket error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // =============================================
  // İSTATİSTİKLER (ADMIN)
  // =============================================

  static async getSupportStats(req, res, next) {
    try {
      logger.info('Getting support stats', { adminId: req.user.id });

      const stats = await SupportService.getSupportStats();

      return ApiResponse.success(
        res,
        'Destek istatistikleri getirildi',
        stats
      );
    } catch (error) {
      logger.error('Get support stats error:', error);
      next(error);
    }
  }
}

module.exports = SupportController;