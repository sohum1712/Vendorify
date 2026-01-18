import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('vendorify_user');
    const storedToken = localStorage.getItem('vendorify_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const getAuthHeaders = () => {
    const storedToken = token || localStorage.getItem('vendorify_token');
    return storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const userInfo = {
        _id: data._id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: data.role,
      };

      setUser(userInfo);
      setToken(data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(userInfo));
      localStorage.setItem('vendorify_token', data.token);

      const redirectPath =
        data.role === ROLES.ADMIN ? '/admin' :
          data.role === ROLES.VENDOR ? '/vendor' :
            '/customer';

      navigate(redirectPath);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      console.log("Login credentials:", credentials);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userInfo = {
        _id: data._id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: data.role,
      };

      setUser(userInfo);
      setToken(data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(userInfo));
      localStorage.setItem('vendorify_token', data.token);

      console.log("Login Success. User Role:", data.role);
      const redirectPath =
        data.role === ROLES.ADMIN ? '/admin' :
          data.role === ROLES.VENDOR ? '/vendor' :
            '/customer';

      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vendorify_user');
    localStorage.removeItem('vendorify_token');
    navigate('/');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('vendorify_user', JSON.stringify(updatedUser));
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        updateUser,
        hasRole,
        isAuthenticated: !!user && !!token,
        getAuthHeaders,
        authFetch,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
