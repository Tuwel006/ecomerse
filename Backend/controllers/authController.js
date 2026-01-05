const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { apiResponse } = require('../utils/response');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d',
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return apiResponse(res, 400, 'Please provide name, email and password');
    }

    if (password.length < 6) {
      return apiResponse(res, 400, 'Password must be at least 6 characters');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return apiResponse(res, 400, 'User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(user._id);

    return apiResponse(res, 201, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return apiResponse(res, 500, 'Registration failed');
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return apiResponse(res, 400, 'Please provide email and password');
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return apiResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return apiResponse(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    return apiResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return apiResponse(res, 500, 'Login failed');
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return apiResponse(res, 404, 'User not found');
    }

    return apiResponse(res, 200, 'User retrieved successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get me error:', error);
    return apiResponse(res, 500, 'Failed to get user');
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    return apiResponse(res, 200, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return apiResponse(res, 500, 'Logout failed');
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};