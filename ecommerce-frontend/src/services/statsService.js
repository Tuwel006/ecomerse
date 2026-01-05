import api from './api';

// Get dashboard statistics (admin only)
export const getDashboardStats = async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
};

// Get analytics data with time range
export const getAnalytics = async (timeRange = '7d') => {
    const response = await api.get(`/stats/analytics?range=${timeRange}`);
    return response.data;
};

// Get top performing posts
export const getTopPosts = async (limit = 10) => {
    const response = await api.get(`/stats/top-posts?limit=${limit}`);
    return response.data;
};

// Get category statistics
export const getCategoryStats = async () => {
    const response = await api.get('/stats/categories');
    return response.data;
};

// Get user demographics
export const getUserDemographics = async () => {
    const response = await api.get('/stats/demographics');
    return response.data;
};

// Get engagement metrics
export const getEngagementMetrics = async (timeRange = '7d') => {
    const response = await api.get(`/stats/engagement?range=${timeRange}`);
    return response.data;
};

// Get user statistics
export const getUserStats = async (userId) => {
    const url = userId ? `/stats/user/${userId}` : '/stats/user';
    const response = await api.get(url);
    return response.data;
};

const statsServiceObj = {
    getDashboardStats,
    getAnalytics,
    getTopPosts,
    getCategoryStats,
    getUserDemographics,
    getEngagementMetrics,
    getUserStats
};

export default statsServiceObj;
