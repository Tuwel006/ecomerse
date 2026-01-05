import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';
import './styles/performance.css';
import './styles/admin.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* Public Routes with Header/Footer */}
                <Route path="/" element={
                  <>
                    <Header />
                    <main className="main-content">
                      <Home />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/products" element={
                  <>
                    <Header />
                    <main className="main-content">
                      <Products />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/login" element={
                  <>
                    <Header />
                    <main className="main-content">
                      <Login />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/register" element={
                  <>
                    <Header />
                    <main className="main-content">
                      <Register />
                    </main>
                    <Footer />
                  </>
                } />
                
                {/* User Protected Routes with Header/Footer */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Header />
                    <main className="main-content">
                      <Profile />
                    </main>
                    <Footer />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Header />
                    <main className="main-content">
                      <Orders />
                    </main>
                    <Footer />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes without Header/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } />
              </Routes>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;