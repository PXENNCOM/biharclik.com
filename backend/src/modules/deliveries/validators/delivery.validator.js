const Joi = require('joi');
const { ISTANBUL_DISTRICTS, PAYMENT_LIMITS } = require('../../../config/constants');

class DeliveryValidator {
  // YENİ İŞ OLUŞTUR
  static createDelivery = Joi.object({
    // Alış adresi
    pickup_address: Joi.string().min(10).required().messages({
      'string.min': 'Alış adresi en az 10 karakter olmalıdır',
      'any.required': 'Alış adresi zorunludur'
    }),
    pickup_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Alış ilçesi zorunludur'
    }),
    pickup_latitude: Joi.number()
      .min(-90)
      .max(90)
      .allow(null)
      .messages({
        'number.base': 'Alış enlem değeri sayı olmalıdır',
        'number.min': 'Alış enlem -90 ile 90 arasında olmalıdır',
        'number.max': 'Alış enlem -90 ile 90 arasında olmalıdır'
      }),
    pickup_longitude: Joi.number()
      .min(-180)
      .max(180)
      .allow(null)
      .messages({
        'number.base': 'Alış boylam değeri sayı olmalıdır',
        'number.min': 'Alış boylam -180 ile 180 arasında olmalıdır',
        'number.max': 'Alış boylam -180 ile 180 arasında olmalıdır'
      }),
    pickup_contact_name: Joi.string().min(2).required().messages({
      'string.min': 'Alış noktası iletişim adı en az 2 karakter olmalıdır',
      'any.required': 'Alış noktası iletişim adı zorunludur'
    }),
    pickup_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Alış noktası telefonu zorunludur'
    }),
    pickup_notes: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Alış notları en fazla 500 karakter olabilir'
    }),

    // Teslimat adresi
    delivery_address: Joi.string().min(10).required().messages({
      'string.min': 'Teslimat adresi en az 10 karakter olmalıdır',
      'any.required': 'Teslimat adresi zorunludur'
    }),
    delivery_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Teslimat ilçesi zorunludur'
    }),
    delivery_latitude: Joi.number()
      .min(-90)
      .max(90)
      .allow(null)
      .messages({
        'number.base': 'Teslimat enlem değeri sayı olmalıdır',
        'number.min': 'Teslimat enlem -90 ile 90 arasında olmalıdır',
        'number.max': 'Teslimat enlem -90 ile 90 arasında olmalıdır'
      }),
    delivery_longitude: Joi.number()
      .min(-180)
      .max(180)
      .allow(null)
      .messages({
        'number.base': 'Teslimat boylam değeri sayı olmalıdır',
        'number.min': 'Teslimat boylam -180 ile 180 arasında olmalıdır',
        'number.max': 'Teslimat boylam -180 ile 180 arasında olmalıdır'
      }),
    delivery_contact_name: Joi.string().min(2).required().messages({
      'string.min': 'Teslimat noktası iletişim adı en az 2 karakter olmalıdır',
      'any.required': 'Teslimat noktası iletişim adı zorunludur'
    }),
    delivery_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Teslimat noktası telefonu zorunludur'
    }),
    delivery_notes: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Teslimat notları en fazla 500 karakter olabilir'
    }),

    // Paket bilgileri
    package_description: Joi.string().min(3).max(500).required().messages({
      'string.min': 'Paket açıklaması en az 3 karakter olmalıdır',
      'string.max': 'Paket açıklaması en fazla 500 karakter olabilir',
      'any.required': 'Ne gönderdiğinizi belirtiniz'
    }),
    package_size: Joi.string().valid('small', 'medium', 'large').default('small').messages({
      'any.only': 'Paket boyutu small, medium veya large olmalıdır'
    }),

    // Harçlık (minimum 100 TL, üst limit yok)
    payment_amount: Joi.number()
      .min(PAYMENT_LIMITS.MIN_AMOUNT)
      .max(PAYMENT_LIMITS.MAX_AMOUNT)
      .required()
      .messages({
        'number.min': `Harçlık en az ${PAYMENT_LIMITS.MIN_AMOUNT} TL olmalıdır`,
        'number.max': 'Harçlık tutarı çok yüksek',
        'any.required': 'Harçlık tutarı zorunludur'
      }),
    
    // Genel notlar (opsiyonel)
    notes: Joi.string().max(1000).allow('', null).messages({
      'string.max': 'Notlar en fazla 1000 karakter olabilir'
    })
  });

  // İŞİ İPTAL ET
  static cancelDelivery = Joi.object({
    cancellation_reason: Joi.string().min(10).max(500).required().messages({
      'string.min': 'İptal nedeni en az 10 karakter olmalıdır',
      'string.max': 'İptal nedeni en fazla 500 karakter olabilir',
      'any.required': 'İptal nedeni zorunludur'
    })
  });

  // ÖDEME DURUMU GÜNCELLE (Admin)
  static updatePaymentStatus = Joi.object({
    payment_status: Joi.string().valid('waiting', 'sender_paid', 'student_paid', 'completed').required(),
    sender_payment_proof_url: Joi.string().uri().allow(null, ''),
    sender_paid_at: Joi.date().allow(null),
    student_payment_proof_url: Joi.string().uri().allow(null, ''),
    student_paid_at: Joi.date().allow(null),
    admin_notes: Joi.string().max(1000).allow(null, '')
  });
}

module.exports = DeliveryValidator;