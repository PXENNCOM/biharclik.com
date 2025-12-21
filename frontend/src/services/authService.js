import api from './api';

export const authService = {
  // Öğrenci kayıt (FormData ile - dosya yükleme)
  registerStudent: async (formData) => {
    const response = await api.post('/auth/register/student', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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
