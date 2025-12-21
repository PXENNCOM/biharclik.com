import api from './api';

export const adminService = {
  // Dashboard istatistikleri
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Öğrenci yönetimi
  getAllStudents: async (filters = {}) => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const params = new URLSearchParams(cleanFilters).toString();
    const response = await api.get(`/admin/students${params ? '?' + params : ''}`);
    return response.data;
  },

  getStudentDetail: async (id) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  approveStudent: async (id) => {
    const response = await api.put(`/admin/students/${id}/approve`);
    return response.data;
  },

  unapproveStudent: async (id) => {
    const response = await api.put(`/admin/students/${id}/unapprove`);
    return response.data;
  },

  // Kullanıcı yönetimi
  toggleUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  deleteUser: async (id, reason) => {
    const response = await api.delete(`/admin/users/${id}`, {
      data: { deletion_reason: reason },
    });
    return response.data;
  },

  // Gönderici yönetimi
  getAllSenders: async (filters = {}) => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const params = new URLSearchParams(cleanFilters).toString();
    const response = await api.get(`/admin/senders${params ? '?' + params : ''}`);
    return response.data;
  },

  getSenderDetail: async (id) => {
    const response = await api.get(`/admin/senders/${id}`);
    return response.data;
  },
};