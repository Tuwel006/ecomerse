const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({})
    ]);
    console.log('✅ Database cleaned');

    console.log('👥 Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);
    const managerPassword = await bcrypt.hash('manager123', 12);

    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        status: 'approved',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        address: '123 Admin Street, Admin City'
      },
      {
        name: 'Test Customer',
        email: 'customer@example.com',
        password: userPassword,
        role: 'customer',
        status: 'approved',
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+1234567891',
        address: '456 Customer Ave, Customer City'
      },
      {
        name: 'Store Manager',
        email: 'manager@example.com',
        password: managerPassword,
        role: 'manager',
        status: 'approved',
        firstName: 'Store',
        lastName: 'Manager',
        phone: '+1234567892',
        address: '789 Manager Blvd, Manager City'
      }
    ]);
    console.log('✅ Users created:', users.length);

    console.log('📂 Creating categories...');
    const categories = await Category.create([
      {
        name: 'Electronics',
        description: 'Latest electronic devices and gadgets',
        icon: '📱',
        color: '#3b82f6',
        order: 1
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel for all occasions',
        icon: '👕',
        color: '#10b981',
        order: 2
      },
      {
        name: 'Sports & Fitness',
        description: 'Sports equipment and fitness gear',
        icon: '⚽',
        color: '#f59e0b',
        order: 3
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        icon: '🏠',
        color: '#ef4444',
        order: 4
      },
      {
        name: 'Books',
        description: 'Books, magazines, and educational materials',
        icon: '📚',
        color: '#8b5cf6',
        order: 5
      }
    ]);
    console.log('✅ Categories created:', categories.length);

    console.log('🛍️ Creating products...');
    const products = await Product.create([
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
        shortDescription: 'Premium smartphone with cutting-edge technology',
        price: 999.99,
        comparePrice: 1099.99,
        category: categories[0]._id,
        brand: 'Apple',
        sku: 'IPH15PRO001',
        quantity: 50,
        stock: 50,
        featured: true,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
          alt: 'iPhone 15 Pro',
          isPrimary: true
        }],
        tags: ['smartphone', 'apple', 'premium'],
        rating: { average: 4.8, count: 156 },
        createdBy: users[0]._id
      },
      {
        name: 'MacBook Air M2',
        description: 'Supercharged by M2 chip, featuring a stunning 13.6-inch Liquid Retina display',
        shortDescription: 'Ultra-thin laptop with M2 performance',
        price: 1199.99,
        comparePrice: 1299.99,
        category: categories[0]._id,
        brand: 'Apple',
        sku: 'MBA13M2001',
        quantity: 25,
        stock: 25,
        featured: true,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
          alt: 'MacBook Air M2',
          isPrimary: true
        }],
        tags: ['laptop', 'apple', 'ultrabook'],
        rating: { average: 4.7, count: 89 },
        createdBy: users[0]._id
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality',
        shortDescription: 'Premium noise-canceling headphones',
        price: 399.99,
        category: categories[0]._id,
        brand: 'Sony',
        sku: 'SNYWH1000XM5',
        quantity: 75,
        stock: 75,
        featured: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          alt: 'Sony WH-1000XM5 Headphones',
          isPrimary: true
        }],
        tags: ['headphones', 'sony', 'noise-canceling'],
        rating: { average: 4.6, count: 234 },
        createdBy: users[0]._id
      },
      {
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, comfortable 100% organic cotton t-shirt in various colors',
        shortDescription: 'Comfortable organic cotton tee',
        price: 29.99,
        category: categories[1]._id,
        brand: 'EcoWear',
        sku: 'ECW001TSHIRT',
        quantity: 200,
        stock: 200,
        featured: false,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          alt: 'Premium Cotton T-Shirt',
          isPrimary: true
        }],
        tags: ['t-shirt', 'cotton', 'organic'],
        rating: { average: 4.3, count: 67 },
        createdBy: users[0]._id
      },
      {
        name: 'Denim Jacket',
        description: 'Classic denim jacket with modern fit and premium quality',
        shortDescription: 'Stylish classic denim jacket',
        price: 89.99,
        category: categories[1]._id,
        brand: 'UrbanStyle',
        sku: 'URB001DENIM',
        quantity: 60,
        stock: 60,
        featured: true,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
          alt: 'Denim Jacket',
          isPrimary: true
        }],
        tags: ['jacket', 'denim', 'casual'],
        rating: { average: 4.5, count: 43 },
        createdBy: users[0]._id
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning for all-day comfort',
        shortDescription: 'Premium running shoes with Air Max technology',
        price: 149.99,
        category: categories[2]._id,
        brand: 'Nike',
        sku: 'NIKE270001',
        quantity: 80,
        stock: 80,
        featured: true,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          alt: 'Nike Air Max 270',
          isPrimary: true
        }],
        tags: ['shoes', 'nike', 'running'],
        rating: { average: 4.7, count: 198 },
        createdBy: users[0]._id
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with extra cushioning for comfortable practice',
        shortDescription: 'Premium non-slip yoga mat',
        price: 49.99,
        category: categories[2]._id,
        brand: 'ZenFit',
        sku: 'ZEN001YOGA',
        quantity: 100,
        stock: 100,
        featured: false,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
          alt: 'Yoga Mat Premium',
          isPrimary: true
        }],
        tags: ['yoga', 'fitness', 'mat'],
        rating: { average: 4.4, count: 76 },
        createdBy: users[0]._id
      },
      {
        name: 'Smart Home Speaker',
        description: 'Voice-controlled smart speaker with premium sound quality',
        shortDescription: 'AI-powered smart speaker',
        price: 199.99,
        category: categories[3]._id,
        brand: 'SmartHome',
        sku: 'SH001SPEAKER',
        quantity: 45,
        stock: 45,
        featured: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          alt: 'Smart Home Speaker',
          isPrimary: true
        }],
        tags: ['smart-home', 'speaker', 'voice-control'],
        rating: { average: 4.2, count: 112 },
        createdBy: users[0]._id
      },
      {
        name: 'JavaScript: The Complete Guide',
        description: 'Comprehensive guide to modern JavaScript programming',
        shortDescription: 'Complete JavaScript programming guide',
        price: 39.99,
        category: categories[4]._id,
        brand: 'TechBooks',
        sku: 'TB001JSGUIDE',
        quantity: 150,
        stock: 150,
        featured: false,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        images: [{
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
          alt: 'JavaScript Programming Book',
          isPrimary: true
        }],
        tags: ['book', 'programming', 'javascript'],
        rating: { average: 4.8, count: 89 },
        createdBy: users[0]._id
      }
    ]);
    console.log('✅ Products created:', products.length);

    console.log('\n🎉 === SEED DATA COMPLETE === 🎉');
    console.log('📊 Database Statistics:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📂 Categories: ${categories.length}`);
    console.log(`   🛍️ Products: ${products.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Customer: customer@example.com / user123');
    console.log('   Manager: manager@example.com / manager123');
    console.log('\n✅ Ready to use!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();