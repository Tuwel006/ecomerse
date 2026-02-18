const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { apiResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return apiResponse(res, 401, 'Not authorized, no token');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return apiResponse(res, 401, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      return apiResponse(res, 401, 'Not authorized, token failed');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return apiResponse(res, 500, 'Server error');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return apiResponse(res, 403, 'Admin access required');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.user = await User.findById(decoded.id);
      } catch (error) {
        // Continue without user
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, adminOnly, optionalAuth };