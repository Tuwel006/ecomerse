const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shophub.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'user@shophub.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Test user created:', user.email);

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        category: 'electronics',
        stock: 50,
        featured: true,
        image: 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=Headphones'
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 199.99,
        category: 'electronics',
        stock: 30,
        featured: true,
        image: 'https://via.placeholder.com/300x300/10b981/ffffff?text=Watch'
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt in various colors',
        price: 24.99,
        category: 'clothing',
        stock: 100,
        featured: false,
        image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=T-Shirt'
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes for all terrains',
        price: 79.99,
        category: 'sports',
        stock: 25,
        featured: true,
        image: 'https://via.placeholder.com/300x300/ef4444/ffffff?text=Shoes'
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('Admin Login: admin@shophub.com / admin123');
    console.log('User Login: user@shophub.com / user123');
    console.log('===============================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();