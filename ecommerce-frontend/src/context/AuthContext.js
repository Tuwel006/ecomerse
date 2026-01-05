import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('Initializing auth - token:', !!token, 'user:', !!user);
        
        if (token && user) {
          const parsedUser = JSON.parse(user);
          dispatch({ type: 'SET_TOKEN', payload: token });
          dispatch({ type: 'SET_USER', payload: parsedUser });
          console.log('Auth initialized with user:', parsedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      console.log('AuthContext: Starting login...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await authAPI.login(credentials);
      console.log('AuthContext: API response:', response);
      
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('AuthContext: Login successful, saving data:', { user, token: !!token });
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        
        toast.success(`Welcome back, ${user.name}!`);
        return { success: true, data: { user, token } };
      } else {
        const errorMsg = response?.message || 'Invalid email or password';
        console.log('AuthContext: Login failed:', errorMsg);
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: errorMsg };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await authAPI.register(userData);
      
      if (response && response.success) {
        toast.success('Registration successful');
        return response;
      } else {
        const errorMsg = response?.message || 'Registration failed';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, message: errorMsg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout
  };

  console.log('AuthContext state:', { user: !!state.user, loading: state.loading, error: state.error });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};