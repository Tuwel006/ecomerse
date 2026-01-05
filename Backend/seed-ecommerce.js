require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-platform');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      },
      {
        name: 'Store Manager',
        email: 'manager@ecommerce.com',
        password: hashedPassword,
        role: 'manager',
        status: 'approved'
      },
      {
        name: 'John Customer',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'customer',
        status: 'approved',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890'
      }
    ]);

    console.log('Created users');

    // Create Categories
    const categories = await Category.create([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        createdBy: users[0]._id
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        createdBy: users[0]._id
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        createdBy: users[0]._id
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        createdBy: users[0]._id
      }
    ]);

    console.log('Created categories');

    // Create Products
    const products = await Product.create([
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
        shortDescription: 'Premium wireless headphones with noise cancellation',
        price: 199.99,
        comparePrice: 249.99,
        cost: 120.00,
        sku: 'WBH-001',
        quantity: 50,
        category: categories[0]._id,
        brand: 'AudioTech',
        tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Wireless Headphones', isPrimary: true }
        ],
        status: 'active',
        featured: true,
        rating: { average: 4.5, count: 128 },
        createdBy: users[0]._id,
        seo: {
          title: 'Premium Wireless Bluetooth Headphones - AudioTech',
          description: 'Experience superior sound quality with our premium wireless headphones',
          keywords: ['wireless headphones', 'bluetooth', 'noise cancellation']
        }
      },
      {
        name: 'Smart Fitness Watch',
        slug: 'smart-fitness-watch',
        description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity.',
        shortDescription: 'Advanced fitness tracking with GPS and heart rate monitor',
        price: 299.99,
        comparePrice: 399.99,
        cost: 180.00,
        sku: 'SFW-002',
        quantity: 30,
        category: categories[0]._id,
        brand: 'FitTech',
        tags: ['smartwatch', 'fitness', 'gps', 'health'],
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch', isPrimary: true }
        ],
        status: 'active',
        featured: true,
        rating: { average: 4.7, count: 89 },
        createdBy: users[0]._id
      },
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-t-shirt',
        description: 'Soft, comfortable 100% organic cotton t-shirt available in multiple colors and sizes.',
        shortDescription: '100% organic cotton t-shirt in multiple colors',
        price: 29.99,
        comparePrice: 39.99,
        cost: 15.00,
        sku: 'PCT-003',
        quantity: 100,
        category: categories[1]._id,
        brand: 'EcoWear',
        tags: ['t-shirt', 'cotton', 'organic', 'casual'],
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Cotton T-Shirt', isPrimary: true }
        ],
        variants: [
          { name: 'Size', options: ['S', 'M', 'L', 'XL'], price: 29.99 },
          { name: 'Color', options: ['White', 'Black', 'Navy', 'Gray'], price: 29.99 }
        ],
        status: 'active',
        featured: false,
        rating: { average: 4.3, count: 156 },
        createdBy: users[0]._id
      },
      {
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Professional ergonomic office chair with lumbar support and adjustable height.',
        shortDescription: 'Ergonomic office chair with lumbar support',
        price: 449.99,
        comparePrice: 599.99,
        cost: 280.00,
        sku: 'EOC-004',
        quantity: 25,
        category: categories[2]._id,
        brand: 'OfficeComfort',
        tags: ['office', 'chair', 'ergonomic', 'furniture'],
        images: [
          { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', alt: 'Office Chair', isPrimary: true }
        ],
        status: 'active',
        featured: true,
        rating: { average: 4.6, count: 73 },
        createdBy: users[0]._id
      },
      {
        name: 'Yoga Mat Pro',
        slug: 'yoga-mat-pro',
        description: 'Professional-grade yoga mat with superior grip and cushioning for all yoga practices.',
        shortDescription: 'Professional yoga mat with superior grip',
        price: 79.99,
        comparePrice: 99.99,
        cost: 35.00,
        sku: 'YMP-005',
        quantity: 75,
        category: categories[3]._id,
        brand: 'ZenFit',
        tags: ['yoga', 'mat', 'fitness', 'exercise'],
        images: [
          { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', alt: 'Yoga Mat', isPrimary: true }
        ],
        status: 'active',
        featured: false,
        rating: { average: 4.4, count: 92 },
        createdBy: users[0]._id
      },
      {
        name: 'Wireless Phone Charger',
        slug: 'wireless-phone-charger',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        shortDescription: 'Fast wireless charging for Qi-enabled devices',
        price: 39.99,
        comparePrice: 59.99,
        cost: 20.00,
        sku: 'WPC-006',
        quantity: 80,
        category: categories[0]._id,
        brand: 'ChargeTech',
        tags: ['wireless', 'charger', 'phone', 'qi'],
        images: [
          { url: 'https://images.unsplash.com/photo-1609592806787-3d9c4d5b4e4e?w=500', alt: 'Wireless Charger', isPrimary: true }
        ],
        status: 'active',
        featured: false,
        rating: { average: 4.2, count: 64 },
        createdBy: users[0]._id
      }
    ]);

    console.log('Created products');

    // Create Sample Orders
    const orders = await Order.create([
      {
        orderNumber: `ORD-${Date.now()}-0001`,
        customer: users[2]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            sku: products[0].sku
          }
        ],
        subtotal: 199.99,
        tax: 16.00,
        shipping: 0,
        total: 215.99,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        status: 'delivered',
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '+1234567890'
        },
        timeline: [
          { status: 'pending', note: 'Order created', timestamp: new Date() },
          { status: 'confirmed', note: 'Order confirmed', timestamp: new Date() },
          { status: 'delivered', note: 'Order delivered', timestamp: new Date() }
        ]
      }
    ]);

    console.log('Created sample orders');

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`🛒 Orders: ${orders.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@ecommerce.com / password123');
    console.log('Manager: manager@ecommerce.com / password123');
    console.log('Customer: customer@example.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();