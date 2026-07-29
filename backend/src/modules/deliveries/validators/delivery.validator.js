const Joi = require('joi');
const { ISTANBUL_DISTRICTS, PAYMENT_LIMITS } = require('../../../config/constants');

class DeliveryValidator {
  // YENİ İŞ OLUŞTUR (Üye Gönderici)
  static createDelivery = Joi.object({
    pickup_address: Joi.string().min(10).required().messages({
      'string.min': 'Alış adresi en az 10 karakter olmalıdır',
      'any.required': 'Alış adresi zorunludur'
    }),
    pickup_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Alış ilçesi zorunludur'
    }),
    pickup_latitude: Joi.number().min(-90).max(90).allow(null),
    pickup_longitude: Joi.number().min(-180).max(180).allow(null),
    pickup_contact_name: Joi.string().min(2).required().messages({
      'string.min': 'Alış noktası iletişim adı en az 2 karakter olmalıdır',
      'any.required': 'Alış noktası iletişim adı zorunludur'
    }),
    pickup_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Alış noktası telefonu zorunludur'
    }),
    pickup_notes: Joi.string().max(500).allow('', null),

    delivery_address: Joi.string().min(10).required().messages({
      'string.min': 'Teslimat adresi en az 10 karakter olmalıdır',
      'any.required': 'Teslimat adresi zorunludur'
    }),
    delivery_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Teslimat ilçesi zorunludur'
    }),
    delivery_latitude: Joi.number().min(-90).max(90).allow(null),
    delivery_longitude: Joi.number().min(-180).max(180).allow(null),
    delivery_contact_name: Joi.string().min(2).required().messages({
      'string.min': 'Teslimat noktası iletişim adı en az 2 karakter olmalıdır',
      'any.required': 'Teslimat noktası iletişim adı zorunludur'
    }),
    delivery_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Teslimat noktası telefonu zorunludur'
    }),
    delivery_notes: Joi.string().max(500).allow('', null),

    package_description: Joi.string().min(3).max(500).required().messages({
      'string.min': 'Paket açıklaması en az 3 karakter olmalıdır',
      'string.max': 'Paket açıklaması en fazla 500 karakter olabilir',
      'any.required': 'Ne gönderdiğinizi belirtiniz'
    }),
    package_size: Joi.string().valid('small', 'medium', 'large').default('small'),

    payment_amount: Joi.number()
      .min(PAYMENT_LIMITS.MIN_AMOUNT)
      .max(PAYMENT_LIMITS.MAX_AMOUNT)
      .required()
      .messages({
        'number.min': `Harçlık en az ${PAYMENT_LIMITS.MIN_AMOUNT} TL olmalıdır`,
        'number.max': 'Harçlık tutarı çok yüksek',
        'any.required': 'Harçlık tutarı zorunludur'
      }),
  });

  // MİSAFİR SİPARİŞ OLUŞTUR
  static createGuestDelivery = Joi.object({
    // Misafir bilgileri — email ve pickup_contact_name kaldırıldı, guest_name = pickup ile aynı kişi varsayılıyor
    guest_name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Ad soyad en az 2 karakter olmalıdır',
      'any.required': 'Ad soyad zorunludur'
    }),
    guest_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Telefon numarası zorunludur'
    }),

    // Alış adresi
    pickup_address: Joi.string().min(10).required().messages({
      'string.min': 'Alış adresi en az 10 karakter olmalıdır',
      'any.required': 'Alış adresi zorunludur'
    }),
    pickup_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Alış ilçesi zorunludur'
    }),
    pickup_latitude: Joi.number().min(-90).max(90).allow(null),
    pickup_longitude: Joi.number().min(-180).max(180).allow(null),
    // artık zorunlu değil — boş gelirse Service katmanında guest_name'e düşürülüyor
    pickup_contact_name: Joi.string().min(2).allow('', null),
    pickup_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Alış noktası telefonu zorunludur'
    }),
    pickup_notes: Joi.string().max(500).allow('', null),

    // Teslimat adresi
    delivery_address: Joi.string().min(10).required().messages({
      'string.min': 'Teslimat adresi en az 10 karakter olmalıdır',
      'any.required': 'Teslimat adresi zorunludur'
    }),
    delivery_district: Joi.string().valid(...ISTANBUL_DISTRICTS).required().messages({
      'any.only': 'Geçerli bir İstanbul ilçesi seçiniz',
      'any.required': 'Teslimat ilçesi zorunludur'
    }),
    delivery_latitude: Joi.number().min(-90).max(90).allow(null),
    delivery_longitude: Joi.number().min(-180).max(180).allow(null),
    delivery_contact_name: Joi.string().min(2).required().messages({
      'string.min': 'Alıcı adı en az 2 karakter olmalıdır',
      'any.required': 'Alıcı adı zorunludur'
    }),
    delivery_contact_phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Teslimat noktası telefonu zorunludur'
    }),
    delivery_notes: Joi.string().max(500).allow('', null),

    // Paket bilgileri
    package_description: Joi.string().min(3).max(500).required().messages({
      'string.min': 'Paket açıklaması en az 3 karakter olmalıdır',
      'any.required': 'Ne gönderdiğinizi belirtiniz'
    }),
    package_size: Joi.string().valid('small', 'medium', 'large').default('small'),

    // Harçlık
    payment_amount: Joi.number()
      .min(PAYMENT_LIMITS.MIN_AMOUNT)
      .max(PAYMENT_LIMITS.MAX_AMOUNT)
      .required()
      .messages({
        'number.min': `Harçlık en az ${PAYMENT_LIMITS.MIN_AMOUNT} TL olmalıdır`,
        'any.required': 'Harçlık tutarı zorunludur'
      }),

    // guest_email ve notes (genel) kaldırıldı
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