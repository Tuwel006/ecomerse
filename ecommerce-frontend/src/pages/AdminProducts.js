import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../components/AdminLayout';
import { productsAPI } from '../services/api';

const AdminProducts = React.memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsAPI.getAll();
      
      if (response?.success && response.data) {
        const productList = Array.isArray(response.data) 
          ? response.data 
          : response.data.products || [];
        setProducts(productList);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const result = await productsAPI.delete(id);
      if (result?.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Products - Admin Dashboard</title>
      </Helmet>
      
      <AdminLayout currentPage="products">
        <div className="admin-content">
          <div className="page-header">
            <h2>Products Management</h2>
            <button className="btn btn-primary">Add New Product</button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProducts} className="btn btn-primary">Retry</button>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
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
                          src={product.image || '/api/placeholder/40/40'} 
                          alt={product.name}
                          className="product-thumb"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.stock || 0}</td>
                      <td>
                        <span className={`status-badge status-${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-secondary">Edit</button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product._id)}
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
          )}
        </div>
      </AdminLayout>
    </>
  );
});

AdminProducts.displayName = 'AdminProducts';

export default AdminProducts;