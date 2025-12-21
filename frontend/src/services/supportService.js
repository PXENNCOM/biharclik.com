// Dosya: /src/services/supportService.js

import api from './api';

export const supportService = {
  // =============================================
  // KULLANICI (ÖĞRENCİ/GÖNDERİCİ) İŞLEMLERİ
  // =============================================

  // Yeni ticket oluştur
  createTicket: async (ticketData) => {
    const response = await api.post('/support', ticketData);
    return response.data;
  },

  // Kendi ticket'larımı listele
  getMyTickets: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/support/my-tickets?${params}`);
    return response.data;
  },

  // Ticket detayı görüntüle
  getTicketDetail: async (ticketId) => {
    const response = await api.get(`/support/${ticketId}`);
    return response.data;
  },

  // Ticket'a mesaj ekle
  addMessage: async (ticketId, message) => {
    const response = await api.post(`/support/${ticketId}/messages`, { message });
    return response.data;
  },

  // =============================================
  // ADMIN İŞLEMLERİ
  // =============================================

  // Tüm ticket'ları listele (ADMIN)
  getAllTickets: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/support/admin/all?${params}`);
    return response.data;
  },

  // Destek istatistikleri (ADMIN)
  getSupportStats: async () => {
    const response = await api.get('/support/admin/stats');
    return response.data;
  },

  // Ticket durumunu güncelle (ADMIN)
  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/support/${ticketId}/status`, { status });
    return response.data;
  },

  // Ticket'ı kapat (ADMIN)
  closeTicket: async (ticketId) => {
    const response = await api.put(`/support/${ticketId}/close`);
    return response.data;
  },

  // Ticket'ı yeniden aç (ADMIN)
  reopenTicket: async (ticketId) => {
    const response = await api.put(`/support/${ticketId}/reopen`);
    return response.data;
  },
};