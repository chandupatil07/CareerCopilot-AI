/**
 * File Explanation: api.js
 * 
 * Reusable Axios API client wrapper. Automatically adds the active JWT access token
 * in authorization headers, and intercepts responses. If an access token expires (401),
 * it calls the backend refresh endpoint with secure cookies and retries the original request.
 */

import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach access token if present
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Intercept 401 errors for token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint withCredentials to enable cookie passing
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access_token;
        tokenService.saveToken(newAccessToken);

        // Update authorization header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, purge token and bubble up rejection to trigger logout
        tokenService.removeToken();
        // Dispatches global session invalidation event
        window.dispatchEvent(new Event('auth:session_expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
