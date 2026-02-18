import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  HeartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '../../store/ecommerceStore';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../services/api';

const ProductCard = ({ product, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
          {(() => {
            const imageUrl = getImageUrl(product.image || (product.images && product.images[0]?.url));
            return (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.target.src !== 'https://placehold.co/400x400?text=Image+Not+Found') {
                    e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found';
                  }
                }}
              />
            );
          })()}

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{product.discountPercentage}%
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Quick Actions */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center gap-2 transition-all duration-300"
            animate={{
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)'
            }}
          >
            <motion.button
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ delay: 0.1 }}
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            <motion.button
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ delay: 0.2 }}
            >
              <EyeIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category */}
          <p className="text-sm text-gray-500 mb-1 font-medium">
            {product.category?.name}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {renderStars(product.rating.average)}
              </div>
              <span className="text-sm text-gray-500 ml-1">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.isAvailable ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.isAvailable || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCartIcon className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;