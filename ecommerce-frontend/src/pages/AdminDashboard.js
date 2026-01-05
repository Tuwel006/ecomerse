import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI } from '../services/api';

const AdminDashboard = React.memo(() => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({
    products: null,
    orders: null
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setApiErrors({ products: null, orders: null });

      console.log('Fetching admin dashboard data...');

      // Fetch products
      const productsRes = await productsAPI.getAll({ limit: 10 });
      console.log('Products API response:', productsRes);
      
      if (productsRes && productsRes.success && productsRes.data) {
        const productList = Array.isArray(productsRes.data) 
          ? productsRes.data 
          : Array.isArray(productsRes.data.products) 
          ? productsRes.data.products 
          : [];
        
        setProducts(productList);
        setStats(prev => ({ ...prev, totalProducts: productList.length }));
      } else {
        setApiErrors(prev => ({ ...prev, products: 'Failed to load products' }));
        setProducts([]);
      }

      // Fetch orders
      const ordersRes = await ordersAPI.getAll({ limit: 5 });
      console.log('Orders API response:', ordersRes);
      
      if (ordersRes && ordersRes.success && ordersRes.data) {
        const orderList = Array.isArray(ordersRes.data) 
          ? ordersRes.data 
          : Array.isArray(ordersRes.data.orders) 
          ? ordersRes.data.orders 
          : [];
        
        setRecentOrders(orderList);
        setStats(prev => ({ 
          ...prev, 
          totalOrders: orderList.length,
          totalRevenue: orderList.reduce((sum, order) => sum + (order.total || 0), 0)
        }));
      } else {
        setApiErrors(prev => ({ ...prev, orders: 'Failed to load orders' }));
        setRecentOrders([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const handleDeleteProduct = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const result = await productsAPI.delete(id);
      if (result && result.success) {
        setProducts(products.filter(p => p._id !== id));
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      } else {
        alert('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Error deleting product. Please try again.');
    }
  }, [products]);

  const retryFetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Admin Dashboard - ShopHub</title>
        </Helmet>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ShopHub</title>
        <meta name="description" content="ShopHub admin dashboard for managing products, orders, and users." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your e-commerce store</p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={retryFetch} className="btn btn-primary">
              Retry Loading
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-4">
          <div className="card stat-card">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            {apiErrors.products && (
              <p className="stat-error">{apiErrors.products}</p>
            )}
          </div>
          <div className="card stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            {apiErrors.orders && (
              <p className="stat-error">{apiErrors.orders}</p>
            )}
          </div>
          <div className="card stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <p className="stat-note">Feature coming soon</p>
          </div>
        </div>

        {/* Products Management */}
        <section className="section">
          <div className="section-header">
            <h2>Products Management</h2>
            <button className="btn btn-primary">Add New Product</button>
          </div>
          
          {apiErrors.products ? (
            <div className="error-message">
              <p>{apiErrors.products}</p>
              <button onClick={retryFetch} className="btn btn-secondary">
                Retry Loading Products
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Start by adding your first product</p>
              <button className="btn btn-primary">Add Product</button>
            </div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <img 
                            src={product.image || '/api/placeholder/50/50'} 
                            alt={product.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/50/50';
                            }}
                          />
                        </td>
                        <td>{product.name || 'Unnamed Product'}</td>
                        <td>${product.price || '0.00'}</td>
                        <td>{product.category || 'Uncategorized'}</td>
                        <td>{product.stock || 0}</td>
                        <td>
                          <span className={`status-badge status-${product.status || 'active'}`}>
                            {product.status || 'active'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-secondary">Edit</button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Recent Orders */}
        <section className="section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="btn btn-secondary">View All Orders</button>
          </div>
          
          {apiErrors.orders ? (
            <div className="error-message">
              <p>{apiErrors.orders}</p>
              <button onClick={retryFetch} className="btn btn-secondary">
                Retry Loading Orders
              </button>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id?.slice(-6) || 'N/A'}</td>
                        <td>{order.customer?.name || order.customerName || 'Unknown'}</td>
                        <td>${order.total || '0.00'}</td>
                        <td>
                          <span className={`status-badge status-${order.status || 'pending'}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <button className="btn btn-sm btn-secondary">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="section">
          <h2>Quick Actions</h2>
          <div className="grid grid-4">
            <button className="card action-card">
              <h3>Add Product</h3>
              <p>Create a new product listing</p>
            </button>
            <button className="card action-card">
              <h3>Manage Orders</h3>
              <p>Process and track orders</p>
            </button>
            <button className="card action-card">
              <h3>View Analytics</h3>
              <p>Sales reports and insights</p>
            </button>
            <button className="card action-card">
              <h3>User Management</h3>
              <p>Manage customer accounts</p>
            </button>
          </div>
        </section>
      </div>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;