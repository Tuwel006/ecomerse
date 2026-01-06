import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productsAPI } from '../services/api';

const Home = React.memo(() => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsRes = await productsAPI.getAll({ limit: 4, featured: true });

      if (productsRes?.success && productsRes.data) {
        const products = Array.isArray(productsRes.data) 
          ? productsRes.data 
          : Array.isArray(productsRes.data.products) 
          ? productsRes.data.products 
          : [];
        
        setFeaturedProducts(products);
      } else {
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load products');
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categories = useMemo(() => [
    { name: 'Electronics', path: '/products?category=electronics', desc: 'Latest gadgets and tech' },
    { name: 'Clothing', path: '/products?category=clothing', desc: 'Fashion for everyone' },
    { name: 'Home & Garden', path: '/products?category=home', desc: 'Everything for your home' },
    { name: 'Sports', path: '/products?category=sports', desc: 'Gear up for adventure' }
  ], []);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... - DSM Kart</title>
        </Helmet>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - DSM Kart</title>
        </Helmet>
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchData} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>DSM Kart - Premium E-commerce Store | Best Deals Online</title>
        <meta name="description" content="Discover amazing products at unbeatable prices. Shop electronics, clothing, home & garden, sports equipment and more at DSM Kart." />
        <meta name="keywords" content="ecommerce, online shopping, electronics, clothing, home garden, sports" />
        <meta property="og:title" content="DSM Kart - Premium E-commerce Store" />
        <meta property="og:description" content="Discover amazing products at unbeatable prices" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="card">
            <h1>Welcome to DSM Kart</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="btn btn-sm btn-secondary">
              View All
            </Link>
          </div>
          
          {!Array.isArray(featuredProducts) || featuredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No featured products available</p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-4">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <h2>Shop by Category</h2>
          </div>
          
          <div className="grid grid-4">
            {categories.map(category => (
              <Link key={category.name} to={category.path} className="card category-card">
                <h3>{category.name}</h3>
                <p>{category.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
});

const ProductCard = React.memo(({ product }) => {
  const [imgSrc, setImgSrc] = useState(product?.image || '/api/placeholder/200/200');
  const [imgError, setImgError] = useState(false);

  const handleImageError = useCallback(() => {
    if (!imgError) {
      setImgError(true);
      setImgSrc('/api/placeholder/200/200');
    }
  }, [imgError]);

  if (!product?._id) return null;

  return (
    <div className="card product-card">
      <div className="product-image">
        <img 
          src={imgSrc}
          alt={product.name || 'Product'}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <h3>{product.name || 'Unnamed Product'}</h3>
        <p className="product-price">${product.price || '0.00'}</p>
        <button className="btn btn-sm btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
Home.displayName = 'Home';

export default Home;