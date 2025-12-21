const Joi = require('joi');
const { USER_ROLES, SENDER_TYPES } = require('../../../config/constants');

class AuthValidator {
  // ÖĞRENCİ KAYIT VALIDASYONU
  static studentRegister = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Geçerli bir e-posta adresi giriniz',
      'any.required': 'E-posta adresi zorunludur'
    }),
    phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Telefon numarası zorunludur'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre zorunludur'
    }),
    password_confirm: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Şifreler eşleşmiyor',
      'any.required': 'Şifre tekrarı zorunludur'
    }),
    first_name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'any.required': 'Ad zorunludur'
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Soyad en az 2 karakter olmalıdır',
      'any.required': 'Soyad zorunludur'
    }),
    tc_no: Joi.string().pattern(/^[1-9][0-9]{10}$/).required().messages({
      'string.pattern.base': 'Geçerli bir T.C. Kimlik Numarası giriniz (11 haneli)',
      'any.required': 'T.C. Kimlik Numarası zorunludur'
    }),
    birth_date: Joi.date().max('now').required().messages({
      'date.max': 'Geçerli bir doğum tarihi giriniz',
      'any.required': 'Doğum tarihi zorunludur'
    }),
    iban: Joi.string().pattern(/^TR[0-9]{24}$/).required().messages({
      'string.pattern.base': 'Geçerli bir IBAN numarası giriniz (TR ile başlayan 26 haneli)',
      'any.required': 'IBAN numarası zorunludur'
    }),
    address: Joi.string().min(10).required().messages({
      'string.min': 'Adres en az 10 karakter olmalıdır',
      'any.required': 'İkametgah adresi zorunludur'
    }),
    university: Joi.string().min(2).required().messages({
      'string.min': 'Üniversite adı en az 2 karakter olmalıdır',
      'any.required': 'Üniversite bilgisi zorunludur'
    }),
    department: Joi.string().min(2).required().messages({
      'string.min': 'Bölüm adı en az 2 karakter olmalıdır',
      'any.required': 'Bölüm bilgisi zorunludur'
    }),
    kvkk_accepted: Joi.boolean().valid(true).required().messages({
      'any.only': 'KVKK onayı zorunludur'
    }),
    terms_accepted: Joi.boolean().valid(true).required().messages({
      'any.only': 'Kullanıcı sözleşmesi onayı zorunludur'
    })
  });

  // GÖNDERİCİ KAYIT VALIDASYONU
  static senderRegister = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Geçerli bir e-posta adresi giriniz',
      'any.required': 'E-posta adresi zorunludur'
    }),
    phone: Joi.string().pattern(/^(05)[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)',
      'any.required': 'Telefon numarası zorunludur'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre zorunludur'
    }),
    password_confirm: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Şifreler eşleşmiyor',
      'any.required': 'Şifre tekrarı zorunludur'
    }),
    account_type: Joi.string().valid(SENDER_TYPES.INDIVIDUAL, SENDER_TYPES.CORPORATE).required().messages({
      'any.only': 'Hesap tipi "individual" veya "corporate" olmalıdır',
      'any.required': 'Hesap tipi zorunludur'
    }),
    
    // BİREYSEL - Conditional fields
    first_name: Joi.when('account_type', {
      is: SENDER_TYPES.INDIVIDUAL,
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    }),
    last_name: Joi.when('account_type', {
      is: SENDER_TYPES.INDIVIDUAL,
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    }),
    tc_no: Joi.when('account_type', {
      is: SENDER_TYPES.INDIVIDUAL,
      then: Joi.string().pattern(/^[1-9][0-9]{10}$/).required(),
      otherwise: Joi.forbidden()
    }),
    
    // KURUMSAL - Conditional fields
    company_name: Joi.when('account_type', {
      is: SENDER_TYPES.CORPORATE,
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    }),
    tax_office: Joi.when('account_type', {
      is: SENDER_TYPES.CORPORATE,
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    }),
    tax_number: Joi.when('account_type', {
      is: SENDER_TYPES.CORPORATE,
      then: Joi.string().pattern(/^[0-9]{10}$/).required(),
      otherwise: Joi.forbidden()
    }),
    
    // ORTAK ALANLAR
    billing_address: Joi.string().min(10).required().messages({
      'string.min': 'Fatura adresi en az 10 karakter olmalıdır',
      'any.required': 'Fatura adresi zorunludur'
    }),
    kvkk_accepted: Joi.boolean().valid(true).required().messages({
      'any.only': 'KVKK onayı zorunludur'
    }),
    terms_accepted: Joi.boolean().valid(true).required().messages({
      'any.only': 'Kullanıcı sözleşmesi onayı zorunludur'
    })
  });

  // GİRİŞ VALIDASYONU
  static login = Joi.object({
    identifier: Joi.string().required().messages({
      'any.required': 'E-posta veya telefon numarası zorunludur'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Şifre zorunludur'
    })
  });

  // REFRESH TOKEN VALIDASYONU
  static refreshToken = Joi.object({
    refresh_token: Joi.string().required().messages({
      'any.required': 'Refresh token zorunludur'
    })
  });
}

module.exports = AuthValidator;
