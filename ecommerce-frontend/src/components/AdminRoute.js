import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AdminRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: No user, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute: User is not admin, role:', user.role);
    return (
      <div className="container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>You do not have admin privileges to access this page.</p>
          <p>Current role: {user.role}</p>
          <a href="/admin/login" className="btn btn-primary">
            Login as Admin
          </a>
        </div>
      </div>
    );
  }

  console.log('AdminRoute: Admin access granted');
  return children;
};

export default AdminRoute;