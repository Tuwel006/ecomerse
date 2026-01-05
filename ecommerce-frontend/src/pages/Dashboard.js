import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 5 });
      if (response.success) {
        setRecentProducts(response.data || []);
        setStats({
          totalProducts: response.data?.length || 0,
          totalOrders: 25,
          totalRevenue: 1250
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3">
        <div className="card stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Recent Products */}
      <section className="section">
        <div className="section-header">
          <h2>Recent Products</h2>
          <button className="btn btn-sm btn-primary">
            Add Product
          </button>
        </div>
        
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section">
        <h2>Quick Actions</h2>
        <div className="grid grid-4">
          <button className="card action-card">
            <h3>Add Product</h3>
            <p>Create a new product</p>
          </button>
          <button className="card action-card">
            <h3>View Orders</h3>
            <p>Manage customer orders</p>
          </button>
          <button className="card action-card">
            <h3>Analytics</h3>
            <p>View sales analytics</p>
          </button>
          <button className="card action-card">
            <h3>Settings</h3>
            <p>Configure your store</p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;