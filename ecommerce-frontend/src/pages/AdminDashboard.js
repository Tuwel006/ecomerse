import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../components/AdminLayout';
import { productsAPI, ordersAPI } from '../services/api';

const AdminDashboard = React.memo(() => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      const [productsRes, ordersRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        ordersAPI.getAll({ limit: 100 })
      ]);

      let productCount = 0;
      let orderCount = 0;
      let revenue = 0;

      if (productsRes?.success && productsRes.data) {
        const products = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.products || [];
        productCount = products.length;
      }

      if (ordersRes?.success && ordersRes.data) {
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || [];
        orderCount = orders.length;
        revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      }

      setStats({
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: revenue,
        totalUsers: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <AdminLayout currentPage="dashboard">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ShopHub</title>
      </Helmet>
      
      <AdminLayout currentPage="dashboard">
        <div className="admin-content">
          <div className="page-header">
            <h2>Dashboard Overview</h2>
            <p>Monitor your store performance</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>${stats.totalRevenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <a href="/admin/products" className="action-card">
                <div className="action-icon">📦</div>
                <h4>Manage Products</h4>
                <p>Add, edit, or remove products</p>
              </a>
              
              <a href="/admin/orders" className="action-card">
                <div className="action-icon">🛒</div>
                <h4>View Orders</h4>
                <p>Process customer orders</p>
              </a>
              
              <a href="/admin/users" className="action-card">
                <div className="action-icon">👥</div>
                <h4>Manage Users</h4>
                <p>View and manage customers</p>
              </a>
              
              <a href="/admin/analytics" className="action-card">
                <div className="action-icon">📈</div>
                <h4>View Analytics</h4>
                <p>Sales reports and insights</p>
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;