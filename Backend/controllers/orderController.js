const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { apiResponse } = require('../utils/apiResponse');
const { STATUS_CODES, ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

// Get all orders (admin/manager)
const getOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
            search,
            startDate,
            endDate,
            sort = '-createdAt'
        } = req.query;

        const filter = {};

        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.lastName': { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            populate: [
                { path: 'customer', select: 'name email' },
                { path: 'items.product', select: 'name images' }
            ]
        };

        const orders = await Order.paginate(filter, options);

        return apiResponse(res, STATUS_CODES.OK, 'Orders retrieved successfully', orders);
    } catch (error) {
        console.error('Get orders error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve orders');
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const userId = req.user.id;

        const filter = { customer: userId };
        if (status) filter.status = status;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: '-createdAt',
            populate: [
                { path: 'items.product', select: 'name images slug' }
            ]
        };

        const orders = await Order.paginate(filter, options);

        return apiResponse(res, STATUS_CODES.OK, 'User orders retrieved successfully', orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve orders');
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const filter = { _id: id };
        
        // Non-admin users can only view their own orders
        if (!['admin', 'manager'].includes(userRole)) {
            filter.customer = userId;
        }

        const order = await Order.findOne(filter)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name images slug');

        if (!order) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Order not found');
        }

        return apiResponse(res, STATUS_CODES.OK, 'Order retrieved successfully', order);
    } catch (error) {
        console.error('Get order error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve order');
    }
};

// Create order (checkout)
const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            customerNotes
        } = req.body;

        const userId = req.user.id;

        // Validate and calculate order totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return apiResponse(res, STATUS_CODES.BAD_REQUEST, `Product ${item.product} not found`);
            }

            if (!product.isAvailable) {
                return apiResponse(res, STATUS_CODES.BAD_REQUEST, `Product ${product.name} is not available`);
            }

            if (product.trackQuantity && product.quantity < item.quantity) {
                return apiResponse(res, STATUS_CODES.BAD_REQUEST, `Insufficient stock for ${product.name}`);
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                variant: item.variant,
                sku: product.sku
            });
        }

        // Calculate tax and shipping (simplified)
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const total = subtotal + tax + shipping;

        // Create order
        const order = new Order({
            customer: userId,
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total,
            paymentMethod,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            customerNotes,
            timeline: [{
                status: 'pending',
                note: 'Order created',
                updatedBy: userId
            }]
        });

        await order.save();

        // Update product inventory
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { 
                    $inc: { 
                        quantity: -item.quantity,
                        'sales.totalSold': item.quantity,
                        'sales.revenue': item.quantity * orderItems.find(oi => oi.product.toString() === item.product).price
                    }
                }
            );
        }

        // Clear user's cart
        await Cart.findOneAndDelete({ user: userId });

        const populatedOrder = await Order.findById(order._id)
            .populate('items.product', 'name images slug');

        return apiResponse(res, STATUS_CODES.CREATED, 'Order created successfully', populatedOrder);
    } catch (error) {
        console.error('Create order error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to create order');
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note, tracking } = req.body;
        const userId = req.user.id;

        const order = await Order.findById(id);
        if (!order) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Order not found');
        }

        // Update order status
        order.status = status;
        
        if (tracking) {
            order.tracking = tracking;
        }

        // Add to timeline
        order.timeline.push({
            status,
            note: note || `Order status updated to ${status}`,
            updatedBy: userId
        });

        // Update fulfillment status based on order status
        if (status === 'shipped') {
            order.fulfillmentStatus = 'fulfilled';
        } else if (status === 'delivered') {
            order.fulfillmentStatus = 'fulfilled';
        }

        await order.save();

        return apiResponse(res, STATUS_CODES.OK, 'Order status updated successfully', order);
    } catch (error) {
        console.error('Update order status error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to update order status');
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentDetails } = req.body;
        const userId = req.user.id;

        const order = await Order.findById(id);
        if (!order) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Order not found');
        }

        order.paymentStatus = paymentStatus;
        
        if (paymentDetails) {
            order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
        }

        // Add to timeline
        order.timeline.push({
            status: order.status,
            note: `Payment status updated to ${paymentStatus}`,
            updatedBy: userId
        });

        // Auto-confirm order if payment is successful
        if (paymentStatus === 'paid' && order.status === 'pending') {
            order.status = 'confirmed';
            order.timeline.push({
                status: 'confirmed',
                note: 'Order confirmed after successful payment',
                updatedBy: userId
            });
        }

        await order.save();

        return apiResponse(res, STATUS_CODES.OK, 'Payment status updated successfully', order);
    } catch (error) {
        console.error('Update payment status error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to update payment status');
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await Order.findById(id);
        if (!order) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Order not found');
        }

        // Check permissions
        if (!['admin', 'manager'].includes(userRole) && order.customer.toString() !== userId) {
            return apiResponse(res, STATUS_CODES.FORBIDDEN, 'Not authorized to cancel this order');
        }

        // Check if order can be cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Order cannot be cancelled');
        }

        // Restore inventory
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { 
                    $inc: { 
                        quantity: item.quantity,
                        'sales.totalSold': -item.quantity,
                        'sales.revenue': -(item.quantity * item.price)
                    }
                }
            );
        }

        order.status = 'cancelled';
        order.timeline.push({
            status: 'cancelled',
            note: reason || 'Order cancelled',
            updatedBy: userId
        });

        await order.save();

        return apiResponse(res, STATUS_CODES.OK, 'Order cancelled successfully', order);
    } catch (error) {
        console.error('Cancel order error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to cancel order');
    }
};

// Get order analytics
const getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const analytics = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    }
                }
            }
        ]);

        const result = analytics[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            completedOrders: 0
        };

        return apiResponse(res, STATUS_CODES.OK, 'Order analytics retrieved successfully', result);
    } catch (error) {
        console.error('Get order analytics error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve order analytics');
    }
};

module.exports = {
    getOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderAnalytics
};