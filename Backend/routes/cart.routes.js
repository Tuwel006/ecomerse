const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart,
    getCartSummary
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

// Optional auth middleware (works for both authenticated and guest users)
router.use(optionalAuth);

// Cart routes
router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/merge', mergeCart);

module.exports = router;