/**
 * File Explanation: interviews.js
 * 
 * Reusable API service for backend Interview Scheduling endpoints.
 */

import api from './api';

export const interviewsService = {
  async listInterviews(params = {}) {
    const response = await api.get('/interviews', { params });
    return response.data;
  },

  async getInterview(id) {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  async createInterview(data) {
    const response = await api.post('/interviews', data);
    return response.data;
  },

  async updateInterview(id, data) {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data;
  },

  async deleteInterview(id) {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
  }
};

export default interviewsService;
