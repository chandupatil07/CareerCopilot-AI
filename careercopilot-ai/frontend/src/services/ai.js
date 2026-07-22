/**
 * File Explanation: ai.js
 * 
 * Reusable API service for backend AI Assistant conversation sessions
 * and chat messages. Enforces JWT auth parameters via central Axios client instance.
 */

import api from './api';

export const aiService = {
  async listConversations() {
    const response = await api.get('/ai/conversations');
    return response.data;
  },

  async createConversation(title) {
    const response = await api.post('/ai/conversations', { title });
    return response.data;
  },

  async getMessages(sessionId) {
    const response = await api.get(`/ai/conversations/${sessionId}/messages`);
    return response.data;
  },

  async sendMessage(sessionId, content, role = 'user') {
    const response = await api.post(`/ai/conversations/${sessionId}/messages`, {
      role,
      content
    });
    return response.data;
  },

  async deleteConversation(sessionId) {
    const response = await api.delete(`/ai/conversations/${sessionId}`);
    return response.data;
  }
};

export default aiService;
