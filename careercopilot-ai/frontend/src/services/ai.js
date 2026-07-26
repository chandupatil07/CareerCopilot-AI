/**
 * File Explanation: ai.js
 * 
 * Reusable API service for backend AI Assistant conversation sessions
 * and chat messages. Enforces JWT auth parameters via central Axios client instance.
 */

import api from './api';
import { tokenService } from './tokenService';

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

  async sendMessageStream(sessionId, content, { onChunk, onError, onDone, signal }) {
    const token = tokenService.getToken();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/conversations/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: 'user', content }),
      signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.detail || 'Failed to start stream';
      throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Save the last partial line back to buffer
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          const jsonStr = trimmed.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            if (data.error) {
              onError(data.error);
            } else if (data.done) {
              onDone(data);
            } else if (data.content !== undefined) {
              onChunk(data.content);
            }
          } catch (e) {
            console.error('Error parsing stream line:', e);
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        onError(err.message || 'Stream connection error');
      }
    }
  },

  async renameConversation(sessionId, title) {
    const response = await api.put(`/ai/conversations/${sessionId}`, { title });
    return response.data;
  },

  async deleteConversation(sessionId) {
    const response = await api.delete(`/ai/conversations/${sessionId}`);
    return response.data;
  }
};

export default aiService;
