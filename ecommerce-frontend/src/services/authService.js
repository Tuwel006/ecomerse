import api from './api';

// Register new user
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Login user
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Request admin/author access
export const requestAccess = async (userData) => {
    const response = await api.post('/auth/request-access', userData);
    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Logout user
export const logout = async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
};

// Get stored user from localStorage
export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Get stored token from localStorage
export const getStoredToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getStoredToken();
};

// Update user profile
export const updateProfile = async (userData) => {
    const response = await api.patch('/auth/profile', userData);
    if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Update password
export const updatePassword = async (passwordData) => {
    const response = await api.patch('/auth/password', passwordData);
    return response.data;
};

const authServiceObj = {
    login,
    register,
    requestAccess,
    getCurrentUser,
    logout,
    getStoredToken,
    getStoredUser,
    isAuthenticated,
    updateProfile,
    updatePassword
};

export default authServiceObj;
