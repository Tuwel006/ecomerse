import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="top-bar-left">
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="top-bar-right">
              {user ? (
                <div className="user-dropdown">
                  <button 
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    Welcome, {user.name}
                  </button>
                  {showUserMenu && (
                    <div className="dropdown-menu">
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="main-header-content">
            <Link to="/" className="logo">
              <h1>ShopHub</h1>
            </Link>

            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>

            <div className="header-actions">
              <button className="cart-btn">
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{itemCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">All Products</Link>
            <Link to="/products?category=electronics" className="nav-link">Electronics</Link>
            <Link to="/products?category=clothing" className="nav-link">Clothing</Link>
            <Link to="/products?category=home" className="nav-link">Home & Garden</Link>
            <Link to="/products?category=sports" className="nav-link">Sports</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;