const Joi = require('joi');

class UsersValidator {
  // PROFİL GÜNCELLEME
  static updateProfile = Joi.object({
    first_name: Joi.string().min(2).max(100),
    last_name: Joi.string().min(2).max(100),
    address: Joi.string().min(10),
    iban: Joi.string().pattern(/^TR[0-9]{24}$/),
    university: Joi.string().min(2),
    company_name: Joi.string().min(2),
    tax_office: Joi.string().min(2),
    billing_address: Joi.string().min(10)
  }).min(1); // En az 1 alan güncellenmeli

  // EMAIL GÜNCELLEME
  static updateEmail = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Geçerli bir e-posta adresi giriniz',
      'any.required': 'E-posta adresi zorunludur'
    })
  });

  // TELEFON GÜNCELLEME
  static updatePhone = Joi.object({
    phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Telefon numarası zorunludur'
    })
  });

  // ŞİFRE DEĞİŞTİRME
  static changePassword = Joi.object({
    old_password: Joi.string().required().messages({
      'any.required': 'Mevcut şifre zorunludur'
    }),
    new_password: Joi.string().min(6).required().messages({
      'string.min': 'Yeni şifre en az 6 karakter olmalıdır',
      'any.required': 'Yeni şifre zorunludur'
    }),
    new_password_confirm: Joi.string().valid(Joi.ref('new_password')).required().messages({
      'any.only': 'Şifreler eşleşmiyor',
      'any.required': 'Şifre tekrarı zorunludur'
    })
  });

  // KULLANICI SİLME
  static deleteUser = Joi.object({
    deletion_reason: Joi.string().min(10).max(500).required().messages({
      'string.min': 'Silme nedeni en az 10 karakter olmalıdır',
      'string.max': 'Silme nedeni en fazla 500 karakter olabilir',
      'any.required': 'Silme nedeni zorunludur'
    })
  });

  // KULLANICI DURUMU GÜNCELLEME
  static toggleStatus = Joi.object({
    is_active: Joi.boolean().required().messages({
      'any.required': 'Durum bilgisi zorunludur'
    })
  });
}

module.exports = UsersValidator;
