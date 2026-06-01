const PaymentService = require('../services/payment.service');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class PaymentController {

  // Ödeme formunu başlat
  static async initializePayment(req, res, next) {
    try {
      const { deliveryId } = req.params;
      const buyerInfo = {
        ...req.body,
        ip: req.ip || req.headers['x-forwarded-for'] || '85.34.78.112'
      };

      const result = await PaymentService.initializePayment(
        parseInt(deliveryId),
        req.user.id,
        buyerInfo
      );

      return ApiResponse.success(res, 'Ödeme formu oluşturuldu', result);
    } catch (error) {
      logger.error('Initialize payment error:', error);
      return ApiResponse.error(res, error.message, 400);
    }
  }

  // İyzico callback (POST - iyzico çağırır)
  static async handleCallback(req, res) {
  try {
    const { token } = req.body;
    const delivery = await PaymentService.handleCallback(token);

    logger.info('Payment successful', {
      deliveryId: delivery.id,
      orderNumber: delivery.order_number
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?order=${delivery.order_number}`
    );

  } catch (error) {
    logger.error('Payment callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
}

  // Perşembe ödeme listesi (Admin)
  static async getPendingStudentPayments(req, res, next) {
    try {
      const payments = await PaymentService.getPendingStudentPayments();
      return ApiResponse.success(res, 'Bekleyen öğrenci ödemeleri', {
        count: payments.length,
        total: payments.reduce((sum, p) => sum + parseFloat(p.payment_amount), 0),
        payments
      });
    } catch (error) {
      logger.error('Get pending payments error:', error);
      next(error);
    }
  }

  static async initializeGuestPayment(req, res, next) {
  try {
    const { deliveryId } = req.params;
    const buyerInfo = {
      ...req.body,
      ip: req.ip || req.headers['x-forwarded-for'] || '85.34.78.112'
    };

    const result = await PaymentService.initializeGuestPayment(
      parseInt(deliveryId),
      buyerInfo
    );

    return ApiResponse.success(res, 'Ödeme formu oluşturuldu', result);
  } catch (error) {
    logger.error('Initialize guest payment error:', error);
    return ApiResponse.error(res, error.message, 400);
  }
}
}


module.exports = PaymentController;