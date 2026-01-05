# 🚀 E-commerce Platform Setup Guide

## Quick Start

### 1. Prerequisites
- **Node.js** (v16+): Download from [nodejs.org](https://nodejs.org/)
- **MongoDB Compass**: Download from [mongodb.com/compass](https://www.mongodb.com/try/download/compass)
- **Git** (optional): For version control

### 2. MongoDB Setup
1. **Install MongoDB Community Server**
   - Download from [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community)
   - Install with default settings
   - MongoDB will run on `mongodb://localhost:27017`

2. **Install MongoDB Compass** (GUI Tool)
   - Download and install MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Create database: `ecommerce-platform`

### 3. Backend Setup
```bash
cd Backend
npm install
npm run seed-ecommerce
npm run dev
```

### 4. Frontend Setup
```bash
cd ecommerce-frontend
npm install
npm start
```

### 5. Quick Start (Windows)
Double-click `start-servers.bat` to run both servers automatically.

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.com | password123 |
| Manager | manager@ecommerce.com | password123 |
| Customer | customer@example.com | password123 |

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017/ecommerce-platform

## 📊 Sample Data Included

- ✅ 3 Users (Admin, Manager, Customer)
- ✅ 4 Product Categories
- ✅ 6 Sample Products
- ✅ 1 Sample Order
- ✅ Professional product images from Unsplash

## 🛠 Features Available

### Customer Features
- Browse products with filtering and search
- Add to cart (works for guests too)
- User registration and login
- Order placement and tracking
- Product reviews and ratings

### Admin Features
- Product management (CRUD)
- Order management and tracking
- User management
- Analytics dashboard with charts
- Category management
- Inventory tracking

### Technical Features
- Responsive design (mobile-friendly)
- Professional UI with smooth animations
- Real-time cart updates
- Session-based guest cart
- JWT authentication
- Role-based access control
- MongoDB with Mongoose ODM

## 🎨 Design Features

- **Professional Color Scheme**: Navy blue, charcoal gray, sophisticated neutrals
- **Modern Typography**: Inter for UI, Playfair Display for headings
- **Smooth Animations**: Framer Motion for professional interactions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Clean UI**: Card-based design with subtle shadows and hover effects

## 📱 Mobile Responsive

The platform is fully responsive and works great on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android)

## 🔧 Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify connection string in `.env` file

### Port Conflicts
- Backend runs on port 8000
- Frontend runs on port 3000
- Change ports in respective config files if needed

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Next Steps

1. **Customize Branding**: Update colors, fonts, and logos
2. **Add Payment**: Integrate Stripe for real payments
3. **Add More Products**: Use admin dashboard to add your products
4. **Configure Email**: Set up email notifications
5. **Deploy**: Deploy to production (Heroku, AWS, etc.)

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check MongoDB connection
4. Ensure all dependencies are installed

---

**🎉 Your professional e-commerce platform is ready to use!**