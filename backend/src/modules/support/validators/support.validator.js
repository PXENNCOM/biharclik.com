// Dosya: /src/modules/support/validators/support.validator.js

const Joi = require('joi');

class SupportValidator {
  // =============================================
  // TICKET OLUŞTURMA
  // =============================================

  static createTicket = Joi.object({
    category: Joi.string()
      .valid('delivery', 'payment', 'account', 'technical', 'other')
      .required()
      .messages({
        'any.required': 'Kategori seçimi zorunludur',
        'any.only': 'Geçersiz kategori'
      }),
    
    message: Joi.string()
      .min(10)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Mesaj en az 10 karakter olmalıdır',
        'string.max': 'Mesaj en fazla 2000 karakter olabilir',
        'any.required': 'Mesaj zorunludur'
      }),
    
    delivery_id: Joi.number()
      .integer()
      .positive()
      .optional()
      .allow(null)
      .messages({
        'number.base': 'Geçersiz teslimat ID',
        'number.integer': 'Teslimat ID tam sayı olmalıdır',
        'number.positive': 'Teslimat ID pozitif olmalıdır'
      }),
    
    priority: Joi.string()
      .valid('low', 'normal', 'high', 'urgent')
      .optional()
      .default('normal')
      .messages({
        'any.only': 'Geçersiz öncelik seviyesi'
      })
  });

  // =============================================
  // MESAJ GÖNDERME
  // =============================================

  static addMessage = Joi.object({
    message: Joi.string()
      .min(1)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Mesaj boş olamaz',
        'string.max': 'Mesaj en fazla 2000 karakter olabilir',
        'any.required': 'Mesaj zorunludur'
      })
  });

  // =============================================
  // DURUM GÜNCELLEME (ADMIN)
  // =============================================

  static updateStatus = Joi.object({
    status: Joi.string()
      .valid('open', 'answered', 'waiting_user', 'resolved', 'closed')
      .required()
      .messages({
        'any.required': 'Durum zorunludur',
        'any.only': 'Geçersiz durum'
      })
  });
}

module.exports = SupportValidator;