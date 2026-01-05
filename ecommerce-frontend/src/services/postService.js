import api from './api';

// Get all posts with filters
export const getAllPosts = async (filters = {}) => {
    // Remove undefined values to avoid sending them as 'undefined' string
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(cleanFilters).toString();
    const response = await api.get(`/posts${params ? `?${params}` : ''}`);
    return response.data;
};

// Get single post by ID or slug
export const getPostById = async (identifier) => {
    const response = await api.get(`/posts/${identifier}`);
    return response.data;
};

// Get recent posts
export const getRecentPosts = async (limit = 5) => {
    const response = await api.get(`/posts/recent?limit=${limit}`);
    return response.data;
};

// Get popular posts
export const getPopularPosts = async (limit = 5) => {
    const response = await api.get(`/posts/popular?limit=${limit}`);
    return response.data;
};

// Create new post
export const createPost = async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
};

// Update post
export const updatePost = async (id, postData) => {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
};

// Delete post
export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};

// Increment post views
export const incrementViews = async (id) => {
    const response = await api.post(`/posts/${id}/view`);
    return response.data;
};

// Like post
export const likePost = async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
};

const postServiceObj = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getRecentPosts,
    getPopularPosts,
    incrementViews,
    likePost
};

export default postServiceObj;
