import api from './api';

const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await api.get(`/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    const response = await api.get('/products', {
      params: { search: query, ...filters }
    });
    return response.data;
  },

  // Create product (admin/vendor)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Update inventory
  updateInventory: async (id, inventoryData) => {
    const response = await api.patch(`/products/${id}/inventory`, inventoryData);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await api.get('/products', {
      params: { category: categoryId, ...params }
    });
    return response.data;
  },

  // Get product analytics (admin)
  getProductAnalytics: async (params = {}) => {
    const response = await api.get('/products/analytics', { params });
    return response.data;
  }
};

export default productService;