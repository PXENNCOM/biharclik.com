import api from './api';

export const authService = {
  // Öğrenci kayıt (FormData ile - dosya yükleme)
  registerStudent: async (formData) => {
    const response = await api.post('/auth/register/student', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  getBolumler: async () => {
    const response = await api.get('/auth/bolumler');
    return response.data;
  },

  // Gönderici kayıt
  registerSender: async (data) => {
    const response = await api.post('/auth/register/sender', data);
    return response.data;
  },

  // Telefon doğrulama
  verifyPhoneNumber: async (firebaseIdToken) => {
    const response = await api.post('/auth/phone-verification/verify', {
      firebaseIdToken,
    });
    return response.data;
  },

  // Login
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', {
      identifier,
      password,
    });
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Profil bilgisi
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Şifremi Unuttum - 1. adım: numara kayıtlı mı kontrol et
  checkPhoneForReset: async (phone) => {
    const response = await api.post('/auth/forgot-password/check-phone', { phone });
    return response.data;
  },

  // Şifremi Unuttum - 2. adım: Firebase token ile şifreyi güncelle
  resetPassword: async (phone, firebaseIdToken, newPassword) => {
    const response = await api.post('/auth/forgot-password/reset', {
      phone,
      firebaseIdToken,
      newPassword,
    });
    return response.data;
  },
};