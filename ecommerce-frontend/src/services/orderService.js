import api from './api';

const orderService = {
  // Get user orders
  getUserOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get all orders (admin/manager)
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create order (checkout)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order status (admin/manager)
  updateOrderStatus: async (orderId, status, note = '', tracking = null) => {
    const response = await api.patch(`/orders/${orderId}/status`, {
      status,
      note,
      tracking
    });
    return response.data;
  },

  // Update payment status (admin/manager)
  updatePaymentStatus: async (orderId, paymentStatus, paymentDetails = null) => {
    const response = await api.patch(`/orders/${orderId}/payment`, {
      paymentStatus,
      paymentDetails
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    const response = await api.patch(`/orders/${orderId}/cancel`, {
      reason
    });
    return response.data;
  },

  // Get order analytics (admin)
  getOrderAnalytics: async (params = {}) => {
    const response = await api.get('/orders/analytics/summary', { params });
    return response.data;
  },

  // Track order
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data;
  },

  // Request refund
  requestRefund: async (orderId, refundData) => {
    const response = await api.post(`/orders/${orderId}/refund`, refundData);
    return response.data;
  },

  // Process refund (admin)
  processRefund: async (orderId, refundData) => {
    const response = await api.patch(`/orders/${orderId}/refund`, refundData);
    return response.data;
  },

  // Get order invoice
  getOrderInvoice: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Reorder (create new order from existing order)
  reorder: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/reorder`);
    return response.data;
  }
};

export default orderService;