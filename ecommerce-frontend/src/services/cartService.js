import api from './api';

const cartService = {
  // Get user cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Get cart summary (item count, subtotal)
  getCartSummary: async () => {
    const response = await api.get('/cart/summary');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variant = null) => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      variant
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/item/${itemId}`, {
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Merge guest cart with user cart (after login)
  mergeCart: async (guestSessionId) => {
    const response = await api.post('/cart/merge', {
      guestSessionId
    });
    return response.data;
  },

  // Apply coupon code
  applyCoupon: async (couponCode) => {
    const response = await api.post('/cart/coupon', {
      code: couponCode
    });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await api.delete('/cart/coupon');
    return response.data;
  },

  // Calculate shipping
  calculateShipping: async (address) => {
    const response = await api.post('/cart/shipping', address);
    return response.data;
  },

  // Calculate tax
  calculateTax: async (address) => {
    const response = await api.post('/cart/tax', address);
    return response.data;
  }
};

export default cartService;