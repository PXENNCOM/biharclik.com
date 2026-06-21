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
    return response.data; // Backend'den ApiResponse.success formatında geliyor
  },
  
  // Gönderici kayıt
  registerSender: async (data) => {
    const response = await api.post('/auth/register/sender', data);
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

  verifyPhoneNumber: async (firebaseIdToken) => {
  const response = await api.post('/auth/phone-verification/verify', {
    firebaseIdToken,
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
};
