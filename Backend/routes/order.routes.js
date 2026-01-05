const express = require('express');
const router = express.Router();
const {
    getOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderAnalytics
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/acl');

// All routes require authentication
router.use(protect);

// Customer routes
router.get('/my-orders', getUserOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Admin/Manager routes
router.get('/', checkPermission('manage_orders'), getOrders);
router.patch('/:id/status', checkPermission('manage_orders'), updateOrderStatus);
router.patch('/:id/payment', checkPermission('manage_orders'), updatePaymentStatus);
router.get('/analytics/summary', checkPermission('view_reports'), getOrderAnalytics);

module.exports = router;