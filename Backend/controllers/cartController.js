const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { apiResponse } = require('../utils/apiResponse');
const { STATUS_CODES } = require('../config/constants');

// Get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        const filter = userId ? { user: userId } : { sessionId };

        let cart = await Cart.findOne(filter).populate('items.product', 'name price images slug isAvailable quantity trackQuantity');

        if (!cart) {
            cart = new Cart(userId ? { user: userId } : { sessionId });
            await cart.save();
        }

        // Filter out unavailable products and update prices
        const validItems = [];
        let updated = false;

        for (const item of cart.items) {
            if (item.product && item.product.isAvailable) {
                // Update price if it has changed
                if (item.price !== item.product.price) {
                    item.price = item.product.price;
                    updated = true;
                }
                validItems.push(item);
            } else {
                updated = true; // Product removed or unavailable
            }
        }

        if (updated) {
            cart.items = validItems;
            await cart.save();
        }

        return apiResponse(res, STATUS_CODES.OK, 'Cart retrieved successfully', cart);
    } catch (error) {
        console.error('Get cart error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve cart');
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, variant } = req.body;
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Product not found');
        }

        if (!product.isAvailable) {
            return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Product is not available');
        }

        if (product.trackQuantity && product.quantity < quantity) {
            return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Insufficient stock');
        }

        // Find or create cart
        const filter = userId ? { user: userId } : { sessionId };
        let cart = await Cart.findOne(filter);

        if (!cart) {
            cart = new Cart({
                ...filter,
                items: []
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant === variant
        );

        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            if (product.trackQuantity && product.quantity < newQuantity) {
                return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Insufficient stock for requested quantity');
            }

            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].price = product.price; // Update price
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                variant,
                price: product.price
            });
        }

        await cart.save();

        // Populate and return updated cart
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price images slug isAvailable quantity trackQuantity');

        return apiResponse(res, STATUS_CODES.OK, 'Item added to cart successfully', populatedCart);
    } catch (error) {
        console.error('Add to cart error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to add item to cart');
    }
};

// Update cart item
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        if (quantity < 1) {
            return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Quantity must be at least 1');
        }

        const filter = userId ? { user: userId } : { sessionId };
        const cart = await Cart.findOne(filter);

        if (!cart) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Item not found in cart');
        }

        // Validate stock
        const product = await Product.findById(cart.items[itemIndex].product);
        if (product.trackQuantity && product.quantity < quantity) {
            return apiResponse(res, STATUS_CODES.BAD_REQUEST, 'Insufficient stock');
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price; // Update price

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price images slug isAvailable quantity trackQuantity');

        return apiResponse(res, STATUS_CODES.OK, 'Cart item updated successfully', populatedCart);
    } catch (error) {
        console.error('Update cart item error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to update cart item');
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        const filter = userId ? { user: userId } : { sessionId };
        const cart = await Cart.findOne(filter);

        if (!cart) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Cart not found');
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price images slug isAvailable quantity trackQuantity');

        return apiResponse(res, STATUS_CODES.OK, 'Item removed from cart successfully', populatedCart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to remove item from cart');
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        const filter = userId ? { user: userId } : { sessionId };
        const cart = await Cart.findOne(filter);

        if (!cart) {
            return apiResponse(res, STATUS_CODES.NOT_FOUND, 'Cart not found');
        }

        cart.items = [];
        await cart.save();

        return apiResponse(res, STATUS_CODES.OK, 'Cart cleared successfully', cart);
    } catch (error) {
        console.error('Clear cart error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to clear cart');
    }
};

// Merge guest cart with user cart (after login)
const mergeCart = async (req, res) => {
    try {
        const { guestSessionId } = req.body;
        const userId = req.user.id;

        // Find guest cart
        const guestCart = await Cart.findOne({ sessionId: guestSessionId });
        if (!guestCart || guestCart.items.length === 0) {
            return apiResponse(res, STATUS_CODES.OK, 'No guest cart to merge');
        }

        // Find or create user cart
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [] });
        }

        // Merge items
        for (const guestItem of guestCart.items) {
            const existingItemIndex = userCart.items.findIndex(
                item => item.product.toString() === guestItem.product.toString() && 
                       item.variant === guestItem.variant
            );

            if (existingItemIndex > -1) {
                // Combine quantities
                userCart.items[existingItemIndex].quantity += guestItem.quantity;
            } else {
                // Add new item
                userCart.items.push(guestItem);
            }
        }

        await userCart.save();

        // Delete guest cart
        await Cart.findByIdAndDelete(guestCart._id);

        const populatedCart = await Cart.findById(userCart._id)
            .populate('items.product', 'name price images slug isAvailable quantity trackQuantity');

        return apiResponse(res, STATUS_CODES.OK, 'Carts merged successfully', populatedCart);
    } catch (error) {
        console.error('Merge cart error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to merge carts');
    }
};

// Get cart summary
const getCartSummary = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID || req.headers['x-session-id'];

        const filter = userId ? { user: userId } : { sessionId };
        const cart = await Cart.findOne(filter);

        const summary = {
            itemCount: cart ? cart.itemCount : 0,
            subtotal: cart ? cart.subtotal : 0
        };

        return apiResponse(res, STATUS_CODES.OK, 'Cart summary retrieved successfully', summary);
    } catch (error) {
        console.error('Get cart summary error:', error);
        return apiResponse(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to retrieve cart summary');
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart,
    getCartSummary
};