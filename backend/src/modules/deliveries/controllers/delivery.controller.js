const DeliveryService = require('../services/delivery.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class DeliveryController {
  // YENİ İŞ OLUŞTUR (Gönderici)
  static async createDelivery(req, res, next) {
    try {
      const delivery = await DeliveryService.createDelivery(req.user.id, req.body);

      logger.info('Delivery created', {
        userId: req.user.id,
        deliveryId: delivery.id,
        orderNumber: delivery.order_number
      });

      return ApiResponse.success(
        res,
        'İş başarıyla oluşturuldu',
        delivery,
        201
      );
    } catch (error) {
      logger.error('Create delivery error:', error);
      next(error);
    }
  }

  // MÜSAİT İŞLER (Öğrenci)
  static async getAvailableJobs(req, res, next) {
    try {
      const filters = {
        pickup_district: req.query.pickup_district,
        delivery_district: req.query.delivery_district,
        min_amount: req.query.min_amount,
        max_amount: req.query.max_amount,
        limit: req.query.limit || 50
      };

      const jobs = await DeliveryService.getAvailableJobs(filters);

      return ApiResponse.success(
        res,
        'Müsait işler listelendi',
        { 
          count: jobs.length,
          jobs 
        }
      );
    } catch (error) {
      logger.error('Get available jobs error:', error);
      next(error);
    }
  }

  // GÖNDERİCİNİN SİPARİŞLERİ
  static async getMySenderOrders(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        limit: req.query.limit || 50
      };

      const orders = await DeliveryService.getMySenderOrders(req.user.id, filters);

      return ApiResponse.success(
        res,
        'Siparişleriniz listelendi',
        { 
          count: orders.length,
          orders 
        }
      );
    } catch (error) {
      logger.error('Get my sender orders error:', error);
      next(error);
    }
  }

  // ÖĞRENCİNİN İŞLERİ
  static async getMyStudentJobs(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        limit: req.query.limit || 50
      };

      const jobs = await DeliveryService.getMyStudentJobs(req.user.id, filters);

      return ApiResponse.success(
        res,
        'İşleriniz listelendi',
        { 
          count: jobs.length,
          jobs 
        }
      );
    } catch (error) {
      logger.error('Get my student jobs error:', error);
      next(error);
    }
  }

  // İŞ DETAYI
  static async getDeliveryById(req, res, next) {
    try {
      const delivery = await DeliveryService.getDeliveryById(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return ApiResponse.success(
        res,
        'İş detayı getirildi',
        delivery
      );
    } catch (error) {
      logger.error('Get delivery by id error:', error);
      return ApiResponse.error(res, error.message, 404);
    }
  }

  // İŞİ KABUL ET (Öğrenci)
  static async acceptJob(req, res, next) {
    try {
      const delivery = await DeliveryService.acceptJob(
        req.params.id,
        req.user.id
      );

      logger.info('Job accepted', {
        deliveryId: delivery.id,
        studentId: req.user.id
      });

      return ApiResponse.success(
        res,
        'İş başarıyla kabul edildi',
        delivery
      );
    } catch (error) {
      logger.error('Accept job error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // İŞE BAŞLA (Öğrenci)
  static async startJob(req, res, next) {
    try {
      const delivery = await DeliveryService.startJob(
        req.params.id,
        req.user.id
      );

      logger.info('Job started', {
        deliveryId: delivery.id,
        studentId: req.user.id
      });

      return ApiResponse.success(
        res,
        'İşe başladınız',
        delivery
      );
    } catch (error) {
      logger.error('Start job error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // İŞİ TAMAMLA (Öğrenci)
  static async completeJob(req, res, next) {
    try {
      const delivery = await DeliveryService.completeJob(
        req.params.id,
        req.user.id
      );

      logger.info('Job completed', {
        deliveryId: delivery.id,
        studentId: req.user.id
      });

      return ApiResponse.success(
        res,
        'İş başarıyla tamamlandı',
        delivery
      );
    } catch (error) {
      logger.error('Complete job error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // İŞİ İPTAL ET (Gönderici)
  static async cancelJob(req, res, next) {
    try {
      const delivery = await DeliveryService.cancelJob(
        req.params.id,
        req.user.id,
        req.body.cancellation_reason
      );

      logger.info('Job cancelled', {
        deliveryId: delivery.id,
        senderId: req.user.id
      });

      return ApiResponse.success(
        res,
        'İş başarıyla iptal edildi',
        delivery
      );
    } catch (error) {
      logger.error('Cancel job error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // ÖDEME DURUMU GÜNCELLE (Admin)
  static async updatePaymentStatus(req, res, next) {
    try {
      const delivery = await DeliveryService.updatePaymentStatus(
        req.params.id,
        req.body
      );

      logger.info('Payment status updated', {
        deliveryId: delivery.id,
        adminId: req.user.id,
        paymentStatus: req.body.payment_status
      });

      return ApiResponse.success(
        res,
        'Ödeme durumu güncellendi',
        delivery
      );
    } catch (error) {
      logger.error('Update payment status error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // TÜM İŞLER (Admin)
  static async getAllDeliveries(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        payment_status: req.query.payment_status,
        limit: req.query.limit || 100
      };

      const deliveries = await DeliveryService.getAllDeliveries(filters);

      return ApiResponse.success(
        res,
        'Tüm işler listelendi',
        { 
          count: deliveries.length,
          deliveries 
        }
      );
    } catch (error) {
      logger.error('Get all deliveries error:', error);
      next(error);
    }
  }

  // İSTATİSTİKLER (Admin)
  static async getStats(req, res, next) {
    try {
      const stats = await DeliveryService.getStats();

      return ApiResponse.success(
        res,
        'İstatistikler getirildi',
        stats
      );
    } catch (error) {
      logger.error('Get stats error:', error);
      next(error);
    }
  }
}

module.exports = DeliveryController;
