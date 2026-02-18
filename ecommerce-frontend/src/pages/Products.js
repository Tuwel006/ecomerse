import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { productsAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';

const Products = React.memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanFilters = Object.entries(filters)
        .filter(([, value]) => value !== '' && value != null)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const response = await productsAPI.getAll(cleanFilters);

      if (response?.success && response.data) {
        const productList = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.products)
            ? response.data.products
            : [];

        setProducts(productList);
      } else {
        setProducts([]);
        setError('No products found');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAddToCart = useCallback((product) => {
    if (!product?._id) return;

    try {
      addToCart({
        id: product._id,
        name: product.name || 'Unknown Product',
        price: product.price || 0,
        image: product.image || '/api/placeholder/200/200'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [addToCart]);

  const clearFilters = useCallback(() => {
    setFilters({ category: '', minPrice: '', maxPrice: '', search: '' });
  }, []);

  const pageTitle = useMemo(() => {
    const category = filters.category;
    return category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products - DSM Kart`
      : 'All Products - DSM Kart';
  }, [filters.category]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Products... - DSM Kart</title>
        </Helmet>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Browse our amazing collection of products. Find electronics, clothing, home & garden items, sports equipment and more." />
        <meta name="keywords" content="products, ecommerce, online shopping, electronics, clothing" />
        <link rel="canonical" href="/products" />
      </Helmet>

      <div className="container">
        <div className="page-header">
          <h1>Products</h1>
          <p>Discover our amazing collection</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="card">
            <div className="filter-row">
              <input
                type="text"
                placeholder="Search products..."
                className="input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <select
                className="input"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                className="input"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              <input
                type="number"
                placeholder="Max Price"
                className="input"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!error && (
          !Array.isArray(products) || products.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-4">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
});

const ProductCard = React.memo(({ product, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    if (product) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  if (!product?._id) return null;

  const imageUrl = getImageUrl(product.image || (product.images && product.images[0]?.url));

  return (
    <div className="card product-card">
      <div className="product-image" style={{ background: '#f3f4f6', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={product.name || 'Product'}
          onError={(e) => {
            if (e.target.src !== 'https://placehold.co/400x400?text=Error+Loading+Image') {
              e.target.src = 'https://placehold.co/400x400?text=Error+Loading+Image';
            }
          }}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="product-info" style={{ padding: '15px' }}>
        <h3 title={product.name} style={{ margin: '0 0 10px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name || 'Unnamed Product'}
        </h3>
        {product.description && (
          <p className="product-description" style={{ color: '#666', fontSize: '0.9rem', height: '3em', overflow: 'hidden', marginBottom: '10px' }}>
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </p>
        )}
        <p className="product-price" style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.25rem', margin: '0 0 15px 0' }}>
          ${product.price || '0.00'}
        </p>
        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          disabled={!product._id}
          style={{ width: '100%' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
Products.displayName = 'Products';

export default Products;