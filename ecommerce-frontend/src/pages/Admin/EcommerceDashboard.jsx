import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EcommerceDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 45230,
    totalOrders: 1234,
    totalCustomers: 5678,
    conversionRate: 3.2,
    averageOrderValue: 89.50,
    topProducts: [],
    recentOrders: [],
    salesData: [],
    categoryData: []
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockSalesData = [
      { date: '2024-01-01', revenue: 4000, orders: 45, customers: 120 },
      { date: '2024-01-02', revenue: 3000, orders: 35, customers: 98 },
      { date: '2024-01-03', revenue: 5000, orders: 55, customers: 145 },
      { date: '2024-01-04', revenue: 4500, orders: 48, customers: 132 },
      { date: '2024-01-05', revenue: 6000, orders: 65, customers: 178 },
      { date: '2024-01-06', revenue: 5500, orders: 58, customers: 165 },
      { date: '2024-01-07', revenue: 7000, orders: 75, customers: 198 }
    ];

    const mockCategoryData = [
      { name: 'Electronics', value: 35, color: '#3b82f6' },
      { name: 'Clothing', value: 25, color: '#10b981' },
      { name: 'Home & Garden', value: 20, color: '#f59e0b' },
      { name: 'Sports', value: 12, color: '#ef4444' },
      { name: 'Books', value: 8, color: '#8b5cf6' }
    ];

    const mockTopProducts = [
      { id: 1, name: 'Wireless Headphones', sales: 234, revenue: 23400, image: '/api/placeholder/60/60' },
      { id: 2, name: 'Smart Watch', sales: 189, revenue: 37800, image: '/api/placeholder/60/60' },
      { id: 3, name: 'Laptop Stand', sales: 156, revenue: 7800, image: '/api/placeholder/60/60' },
      { id: 4, name: 'USB-C Cable', sales: 145, revenue: 2900, image: '/api/placeholder/60/60' },
      { id: 5, name: 'Phone Case', sales: 134, revenue: 4020, image: '/api/placeholder/60/60' }
    ];

    const mockRecentOrders = [
      { id: 'ORD-001', customer: 'John Doe', amount: 129.99, status: 'completed', date: '2024-01-07' },
      { id: 'ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'processing', date: '2024-01-07' },
      { id: 'ORD-003', customer: 'Mike Johnson', amount: 199.99, status: 'shipped', date: '2024-01-06' },
      { id: 'ORD-004', customer: 'Sarah Wilson', amount: 45.00, status: 'pending', date: '2024-01-06' },
      { id: 'ORD-005', customer: 'Tom Brown', amount: 299.99, status: 'completed', date: '2024-01-05' }
    ];

    setAnalytics(prev => ({
      ...prev,
      salesData: mockSalesData,
      categoryData: mockCategoryData,
      topProducts: mockTopProducts,
      recentOrders: mockRecentOrders
    }));
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              E-commerce Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your store performance and analytics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(analytics.totalRevenue)}
            change={12.5}
            trend="up"
            icon={CurrencyDollarIcon}
          />
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            change={8.2}
            trend="up"
            icon={ShoppingBagIcon}
          />
          <StatCard
            title="Total Customers"
            value={analytics.totalCustomers.toLocaleString()}
            change={15.3}
            trend="up"
            icon={UsersIcon}
          />
          <StatCard
            title="Conversion Rate"
            value={`${analytics.conversionRate}%`}
            change={-2.1}
            trend="down"
            icon={ChartBarIcon}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ShoppingCartIcon className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700">View Orders</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <UsersIcon className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EcommerceDashboard;