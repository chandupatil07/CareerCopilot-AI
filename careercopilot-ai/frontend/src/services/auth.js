/**
 * File Explanation: auth.js
 * 
 * Authentication endpoints handler. Encapsulates direct API network communications
 * for login, register, logout, and fetching candidate profile details.
 */

import api from './api';

export const authService = {
  /**
   * Register a new candidate account
   */
  async register(email, name, password) {
    const response = await api.post('/auth/register', {
      email,
      full_name: name,
      password
    });
    return response.data;
  },

  /**
   * Log in user session. Takes credentials and returns access token payload,
   * setting the refresh token inside secure cookies.
   */
  async login(email, password) {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    });
    return response.data;
  },

  /**
   * Revoke active user session credentials
   */
  async logout() {
    const response = await api.post('/auth/logout', {}, {
      withCredentials: true
    });
    return response.data;
  },

  /**
   * Fetch authenticated profile details
   */
  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }
};

export default authService;
