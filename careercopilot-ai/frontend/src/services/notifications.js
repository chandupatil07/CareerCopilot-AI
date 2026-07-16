/**
 * File Explanation: notifications.js
 * 
 * Reusable API service for backend Notifications endpoints.
 */

import api from './api';

export const notificationsService = {
  async listNotifications(params = {}) {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  async getNotification(id) {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  async markRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  async deleteExpired() {
    const response = await api.delete('/notifications/expired');
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default notificationsService;
