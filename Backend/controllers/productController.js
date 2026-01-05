const Product = require('../models/Product');
const { apiResponse } = require('../utils/response');

// Get all products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      featured
    } = req.query;

    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort('-createdAt');

    const total = await Product.countDocuments(filter);

    return apiResponse(res, 200, 'Products retrieved successfully', {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return apiResponse(res, 500, 'Failed to retrieve products');
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return apiResponse(res, 404, 'Product not found');
    }

    return apiResponse(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    console.error('Get product error:', error);
    return apiResponse(res, 500, 'Failed to retrieve product');
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      status: 'active', 
      featured: true 
    })
    .limit(parseInt(limit))
    .sort('-createdAt');

    return apiResponse(res, 200, 'Featured products retrieved successfully', products);
  } catch (error) {
    console.error('Get featured products error:', error);
    return apiResponse(res, 500, 'Failed to retrieve featured products');
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user?.id
    };

    const product = new Product(productData);
    await product.save();

    return apiResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    console.error('Create product error:', error);
    return apiResponse(res, 500, 'Failed to create product');
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return apiResponse(res, 404, 'Product not found');
    }

    return apiResponse(res, 200, 'Product updated successfully', product);
  } catch (error) {
    console.error('Update product error:', error);
    return apiResponse(res, 500, 'Failed to update product');
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return apiResponse(res, 404, 'Product not found');
    }

    return apiResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    return apiResponse(res, 500, 'Failed to delete product');
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};