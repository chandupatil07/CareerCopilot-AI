/**
 * File Explanation: AuthContext.jsx
 * 
 * Global React Context Provider governing authentication states.
 * Orchestrates session recovery, logins, registrations, logouts, loading flags,
 * and handles automatic cookie invalidation events.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { tokenService } from '../services/tokenService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recover active session on mount
  useEffect(() => {
    async function recoverSession() {
      if (tokenService.hasToken()) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
        } catch (e) {
          console.error('Session recovery failed:', e);
          tokenService.removeToken();
        }
      }
      setLoading(false);
    }
    recoverSession();
  }, []);

  // Listen for session invalidation events from Axios response interceptors
  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null);
      setError('Session expired. Please log in again.');
      tokenService.removeToken();
    };

    window.addEventListener('auth:session_expired', handleExpiredSession);
    return () => {
      window.removeEventListener('auth:session_expired', handleExpiredSession);
    };
  }, []);

  /**
   * Login session handler
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      tokenService.saveToken(data.access_token);
      
      const profile = await authService.getCurrentUser();
      setUser(profile);
      setLoading(false);
      return profile;
    } catch (e) {
      setLoading(false);
      const msg = e.response?.data?.detail || 'Invalid email or password.';
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Register candidate account
   */
  const register = async (email, name, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(email, name, password);
      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      const msg = e.response?.data?.detail || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Revoke active candidate session
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout endpoint call failed, clearing local state anyway:', e);
    } finally {
      tokenService.removeToken();
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
