import api from './api';

// Get comments for a post
export const getComments = async (postId, showAll = false) => {
    const approved = showAll ? 'all' : 'true';
    const response = await api.get(`/comments/post/${postId}?approved=${approved}`);
    return response.data;
};

// Get all comments (admin)
export const getAllComments = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/comments${params ? `?${params}` : ''}`);
    return response.data;
};

// Add comment to post
export const addComment = async (postId, commentData) => {
    const response = await api.post(`/comments/post/${postId}`, commentData);
    return response.data;
};

// Approve comment (admin/author)
export const approveComment = async (commentId) => {
    const response = await api.patch(`/comments/${commentId}/approve`);
    return response.data;
};

// Delete comment (admin/author)
export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
};

// Alias for backward compatibility
export const getPostComments = getComments;

const commentServiceObj = {
    getComments,
    getPostComments,
    getAllComments,
    addComment,
    approveComment,
    deleteComment
};

export default commentServiceObj;
