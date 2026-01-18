import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('vendorify_token');
    if (!token) {
      setUser({
        id: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        role: ROLES.CUSTOMER
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('vendorify_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('vendorify_token');
        localStorage.removeItem('vendorify_user');
        setUser({
          id: 'guest',
          name: 'Guest User',
          email: 'guest@example.com',
          role: ROLES.CUSTOMER
        });
      }
    } catch (err) {
      console.error('Fetch me error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('vendorify_token', data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(data.user));
      setUser(data.user);
      
      const redirectPath =
        data.user.role === ROLES.ADMIN ? '/admin' :
          data.user.role === ROLES.VENDOR ? '/vendor' :
            '/customer';

      navigate(redirectPath);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Support both (email, password) and (roleObject) for backward compatibility if needed
      let body;
      if (typeof email === 'object') {
         // Mock login if object passed (not recommended but for safety)
         const role = email.role || ROLES.CUSTOMER;
         const mockUser = { id: 'mock', name: 'Mock', email: 'mock@test.com', role };
         setUser(mockUser);
         localStorage.setItem('vendorify_user', JSON.stringify(mockUser));
         navigate(role === ROLES.VENDOR ? '/vendor' : '/customer');
         return { success: true };
      } else {
        body = JSON.stringify({ email, password });
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('vendorify_token', data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(data.user));
      setUser(data.user);

      const redirectPath =
        data.user.role === ROLES.ADMIN ? '/admin' :
          data.user.role === ROLES.VENDOR ? '/vendor' :
            '/customer';

      navigate(redirectPath);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      role: ROLES.CUSTOMER
    });
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
        hasRole,
        isAuthenticated: user && user.id !== 'guest'
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
