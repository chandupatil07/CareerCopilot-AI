/**
 * File Explanation: resume.js
 * 
 * Reusable API service for backend Resume management endpoints.
 * Maps actions to the correct plural /resumes endpoints matching the FastAPI router prefix.
 */

import api from './api';

export const resumeService = {
  async listResumes() {
    const response = await api.get('/resumes');
    return response.data;
  },

  async getResume(id) {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async activateResume(id) {
    const response = await api.put(`/resumes/${id}/activate`);
    return response.data;
  },

  async deleteResume(id) {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  async parseResume(id) {
    const response = await api.post(`/resumes/${id}/parse`);
    return response.data;
  },

  async getResumeAnalysis(id) {
    const response = await api.get(`/resumes/${id}/analysis`);
    return response.data;
  },

  async getAtsScore(id) {
    const response = await api.get(`/resumes/${id}/ats-score`);
    return response.data;
  },

  getDownloadUrl(id) {
    return `${import.meta.env.VITE_API_BASE_URL}/resumes/${id}/download`;
  }
};

export default resumeService;
