import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm safe-area-inset">
        <div className="container-wide mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">D</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-black hidden xs:block" style={{ margin: 0 }}>
                DSM Kart
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-ui text-base text-secondary hover:text-primary transition-colors touch-target flex items-center justify-center">
                Home
              </Link>
              <Link to="/viewer/posts" className="font-ui text-base text-secondary hover:text-primary transition-colors touch-target flex items-center justify-center">
                Articles
              </Link>
              <Link to="/about" className="font-ui text-base text-secondary hover:text-primary transition-colors touch-target flex items-center justify-center">
                About
              </Link>
              <Link to="/contact" className="font-ui text-base text-secondary hover:text-primary transition-colors touch-target flex items-center justify-center">
                Contact
              </Link>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="font-ui text-sm text-muted hidden lg:block">Welcome, {user?.name}</span>
                  <Link
                    to="/author/dashboard"
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200 touch-target flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <svg 
                className={`w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed inset-x-0 top-16 bg-white shadow-lg z-50 md:hidden transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="px-4 py-6 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link 
            to="/" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 touch-target" 
            onClick={() => setMobileMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link 
            to="/viewer/posts" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 touch-target" 
            onClick={() => setMobileMenuOpen(false)}
          >
            📚 Articles
          </Link>
          <Link 
            to="/about" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 touch-target" 
            onClick={() => setMobileMenuOpen(false)}
          >
            ℹ️ About
          </Link>
          <Link 
            to="/contact" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 touch-target" 
            onClick={() => setMobileMenuOpen(false)}
          >
            📞 Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-1">
              <div className="px-4 py-2 text-sm text-gray-500">
                Welcome, {user?.name}
              </div>
              <Link 
                to="/author/dashboard" 
                className="block px-4 py-3 text-base font-medium text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 touch-target" 
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 touch-target"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link 
                to="/login" 
                className="block px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 touch-target text-center" 
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
