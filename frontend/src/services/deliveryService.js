import api from './api';

export const deliveryService = {
  // Öğrenci için
  getAvailableJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/deliveries/available?${params}`);
    return response.data;
  },

  acceptJob: async (id) => {
    const response = await api.post(`/deliveries/${id}/accept`);
    return response.data;
  },

  startJob: async (id) => {
    const response = await api.put(`/deliveries/${id}/start`);
    return response.data;
  },

  completeJob: async (id) => {
    const response = await api.put(`/deliveries/${id}/complete`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/deliveries/my-jobs');
    return response.data;
  },

  // Gönderici için
  createDelivery: async (data) => {
    const response = await api.post('/deliveries', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/deliveries/my-orders');
    return response.data;
  },

  cancelDelivery: async (id, cancellation_reason) => {
  const response = await api.put(`/deliveries/${id}/cancel`, {
    cancellation_reason: cancellation_reason || 'Kullanıcı iptal etti'
  });
  return response.data;
},

  // Ortak
  getDeliveryDetail: async (id) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },
};
