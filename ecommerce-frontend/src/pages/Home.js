import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productsAPI, getImageUrl } from '../services/api';

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
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="product-info" style={{ padding: '15px' }}>
        <h3 title={product.name} style={{ margin: '0 0 10px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name || 'Unnamed Product'}
        </h3>
        <p className="product-price" style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.25rem', margin: '0 0 15px 0' }}>
          ${product.price || '0.00'}
        </p>
        <button className="btn btn-primary" style={{ width: '100%' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
Home.displayName = 'Home';

export default Home;