import api from './api';

// Get all users (admin only)
export const getAllUsers = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/users${params ? `?${params}` : ''}`);
    return response.data;
};

// Get pending users (admin only)
export const getPendingUsers = async () => {
    const response = await api.get('/users/pending');
    return response.data;
};

// Approve user (admin only)
export const approveUser = async (userId) => {
    const response = await api.patch(`/users/${userId}/approve`);
    return response.data;
};

// Reject user (admin only)
export const rejectUser = async (userId) => {
    const response = await api.patch(`/users/${userId}/reject`);
    return response.data;
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/users/${userId}`, { role });
    return response.data;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const toggleBookmark = async (postId) => {
    const response = await api.post(`/users/bookmarks/${postId}`);
    return response.data;
};

const userServiceObj = {
    getAllUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
    updateUser,
    updateUserRole,
    deleteUser,
    toggleBookmark
};

export default userServiceObj;
