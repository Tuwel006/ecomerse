import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    let message = 'Something went wrong';
    
    if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please try again.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Network error. Please check your connection.';
    } else if (error.response) {
      message = error.response.data?.message || `Error ${error.response.status}`;
      
      // Only redirect to login for 401 errors on protected routes, not login attempts
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/login';
        }
        message = 'Session expired. Please login again.';
      }
    }
    
    // Don't show toast for auth errors during login attempts
    const isLoginAttempt = error.config?.url?.includes('/auth/login');
    if (!isLoginAttempt && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('authAPI.login called with:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('authAPI.login response:', response);
      return response;
    } catch (error) {
      console.error('authAPI.login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response;
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response;
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default api;