import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white safe-area-inset" style={{ backgroundColor: 'var(--color-charcoal)', marginTop: 'var(--space-3xl)' }}>
      <div className="container-wide mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: 'white' }}>DSM Kart</h3>
            <p className="text-gray-400 font-ui text-sm leading-relaxed">
              Your trusted ecommerce platform for quality products and exceptional shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-ui font-semibold mb-3 sm:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/viewer/posts" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-ui font-semibold mb-3 sm:mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/viewer/posts?category=technology" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/viewer/posts?category=business" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/viewer/posts?category=lifestyle" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/viewer/posts?category=travel" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target inline-block">
                  Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-ui font-semibold mb-3 sm:mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-400 font-ui text-sm mb-4">
              Subscribe to our newsletter for the latest articles.
            </p>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-gray-600 bg-gray-800 text-white rounded-t sm:rounded-l sm:rounded-t-md focus:outline-none focus:border-primary focus-ring mb-2 sm:mb-0"
              />
              <button className="btn-primary px-4 py-2 text-sm rounded-b sm:rounded-r sm:rounded-b-md touch-target" style={{ borderRadius: '0 0 4px 4px' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 font-ui text-sm text-center sm:text-left">
            © {currentYear} DSM Kart. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target text-center">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white font-ui text-sm transition-colors touch-target text-center">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
