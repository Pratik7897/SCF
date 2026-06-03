/**
 * Auth Context
 * Global state management for admin authentication
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Check token on mount

  /**
   * Verify stored token on app initialization
   */
  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      if (data.success) {
        setAdmin(data.data);
      } else {
        // Token invalid — clear storage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    } catch {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  /**
   * Login admin and persist token
   */
  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    if (data.success) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      setAdmin(data.admin);
    }
    return data;
  };

  /**
   * Clear session and log out
   */
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
