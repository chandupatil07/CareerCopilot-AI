/**
 * File Explanation: tokenService.js
 * 
 * Token management service. Encapsulates all reads/writes to localStorage
 * for the user's JWT access token to ensure we do not touch localStorage directly
 * from multiple components.
 */

const TOKEN_KEY = 'cc_access_token';

export const tokenService = {
  /**
   * Save the JWT access token in browser storage
   */
  saveToken(token) {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Retrieve the JWT access token from browser storage
   */
  getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove the JWT access token (logs out user session)
   */
  removeToken() {
    window.localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Helper to check if a token is stored
   */
  hasToken() {
    return !!this.getToken();
  }
};

export default tokenService;
