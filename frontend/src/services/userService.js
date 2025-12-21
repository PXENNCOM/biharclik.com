import api from './api';

export const userService = {
  // Profil
  getMyProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  updateEmail: async (email) => {
    const response = await api.put('/users/email', { email });
    return response.data;
  },

  updatePhone: async (phone) => {
    const response = await api.put('/users/phone', { phone });
    return response.data;
  },

  changePassword: async (oldPassword, newPassword, newPasswordConfirm) => {
    const response = await api.put('/users/password', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return response.data;
  },

  // Geçmiş
  getMyHistory: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/users/history?${params}`);
    return response.data;
  },
};
