import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const AdminLogin = React.memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      
      console.log('Admin login attempt:', formData);
      const result = await login(formData);
      console.log('Admin login result:', result);
      
      if (result && result.success && result.data?.user) {
        const { user } = result.data;
        
        // Check if user is admin
        if (user.role === 'admin') {
          console.log('Admin login successful, navigating to dashboard');
          navigate('/admin');
        } else {
          console.log('User is not admin:', user.role);
          setErrors({ general: 'Admin access required. You do not have admin privileges.' });
        }
      } else {
        console.log('Admin login failed:', result);
        setErrors({ general: result?.message || 'Invalid admin credentials' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ general: 'Admin login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, login, navigate]);

  return (
    <>
      <Helmet>
        <title>Admin Login - DSM Kart</title>
        <meta name="description" content="Admin login for DSM Kart management dashboard." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        <div className="auth-container">
          <div className="card auth-card">
            <h1>Admin Login</h1>
            <p className="admin-subtitle">Access the management dashboard</p>
            
            {errors.general && (
              <div className="error-banner">{errors.general}</div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Admin Password"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && <div className="error">{errors.password}</div>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying Admin Access...' : 'Login as Admin'}
              </button>
            </form>

            <div className="auth-links">
              <Link to="/login">← Back to User Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

AdminLogin.displayName = 'AdminLogin';

export default AdminLogin;