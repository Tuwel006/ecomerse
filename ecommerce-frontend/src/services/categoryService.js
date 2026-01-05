import api from './api';

// Get all categories
export const getAllCategories = async (includeInactive = false) => {
    const response = await api.get('/categories', {
        params: { includeInactive }
    });
    return response.data;
};

// Get category tree structure
export const getCategoryTree = async () => {
    const response = await api.get('/categories/tree');
    return response.data;
};

// Get single category by slug
export const getCategory = async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
};

// Create new category (admin only)
export const createCategory = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

// Update category (admin only)
export const updateCategory = async (id, categoryData) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
};

// Delete category (admin only)
export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Reorder categories (admin only)
export const reorderCategories = async (categories) => {
    const response = await api.patch('/categories/reorder', { categories });
    return response.data;
};

const categoryServiceObj = {
    getAllCategories,
    getCategoryTree,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
};

export default categoryServiceObj;
