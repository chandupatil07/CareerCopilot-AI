/**
 * File Explanation: applications.js
 * 
 * Reusable API service for backend Job Applications endpoints.
 */

import api from './api';

export const applicationsService = {
  async getStatistics() {
    const response = await api.get('/applications/statistics');
    return response.data;
  },

  async listApplications(params = {}) {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  async getApplication(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  async createApplication(data) {
    const response = await api.post('/applications', data);
    return response.data;
  },

  async updateApplication(id, data) {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  async updateStatus(id, status, notes = '') {
    const response = await api.patch(`/applications/${id}/status`, { status, notes });
    return response.data;
  },

  async deleteApplication(id) {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

export default applicationsService;
