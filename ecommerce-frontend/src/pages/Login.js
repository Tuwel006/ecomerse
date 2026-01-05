import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const Login = React.memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/profile');
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
      
      console.log('Attempting login with:', formData);
      const result = await login(formData);
      console.log('Login result:', result);
      
      if (result && result.success) {
        // Login successful, AuthContext will handle user state
        console.log('Login successful, navigating...');
        navigate(result.data?.user?.role === 'admin' ? '/admin' : '/profile');
      } else {
        console.log('Login failed:', result);
        setErrors({ general: result?.message || 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, login, navigate]);

  return (
    <>
      <Helmet>
        <title>Login - ShopHub</title>
        <meta name="description" content="Login to your ShopHub account to access your orders, wishlist and account settings." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        <div className="auth-container">
          <div className="card auth-card">
            <h1>Login</h1>
            
            {errors.general && (
              <div className="error-banner">{errors.general}</div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
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
                  placeholder="Password"
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                Don't have an account? 
                <Link to="/register"> Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Login.displayName = 'Login';

export default Login;