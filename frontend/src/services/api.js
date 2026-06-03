/**
 * API Service Layer
 * Centralized Axios instance with interceptors for all API calls
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────
// Automatically attach JWT token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
// Handle auth errors globally (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Contact API ──────────────────────────────────────────────
export const contactAPI = {
  /**
   * Submit contact form
   * @param {Object} data - { fullName, email, message }
   */
  submit: (data) => api.post('/contact', data),

  /**
   * Get all submissions (admin)
   * @param {Object} params - { page, limit, status, search }
   */
  getAll: (params = {}) => api.get('/contact/submissions', { params }),

  /**
   * Get single submission by ID (admin)
   */
  getById: (id) => api.get(`/contact/submissions/${id}`),

  /**
   * Update submission status (admin)
   */
  updateStatus: (id, data) => api.patch(`/contact/submissions/${id}`, data),

  /**
   * Delete submission (admin)
   */
  delete: (id) => api.delete(`/contact/submissions/${id}`),

  /**
   * Get dashboard statistics (admin)
   */
  getStats: () => api.get('/contact/stats'),
};

// ─── Auth API ─────────────────────────────────────────────────
export const authAPI = {
  /**
   * Admin login
   * @param {Object} credentials - { email, password }
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Get current admin profile
   */
  getMe: () => api.get('/auth/me'),

  /**
   * One-time admin setup
   */
  setup: (data) => api.post('/auth/setup', data),
};

export default api;
