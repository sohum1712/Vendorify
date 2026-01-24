import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import { CONFIG, SOCKET_EVENTS } from '../constants/config';
import apiClient from '../utils/api';
import { authToasts } from '../utils/toast';
import { io } from 'socket.io-client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Fetch current user from token
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('vendorify_token');
    const sessionId = sessionStorage.getItem('vendorify_session_id');
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - clearing auth data');
        setUser(null);
        setLoading(false);
        localStorage.removeItem('vendorify_token');
        localStorage.removeItem('vendorify_user');
        sessionStorage.removeItem('vendorify_session_id');
      }
    }, 10000); // 10 second timeout
    
    // Check if this is a new browser session
    if (!sessionId) {
      // New session - clear any existing auth data
      if (process.env.NODE_ENV === 'development') {
        console.log('New browser session detected, clearing auth data');
      }
      localStorage.removeItem('vendorify_token');
      localStorage.removeItem('vendorify_user');
      localStorage.removeItem('vendorify_refresh_token');
      setUser(null);
      setLoading(false);
      clearTimeout(timeoutId);
      return;
    }
    
    if (!token) {
      setUser(null);
      setLoading(false);
      clearTimeout(timeoutId);
      return;
    }

    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('vendorify_user', JSON.stringify(response.user));
      } else {
        // Invalid response, clear auth data
        if (process.env.NODE_ENV === 'development') {
          console.log('Invalid user response, clearing auth data');
        }
        setUser(null);
        apiClient.clearAuth();
      }
    } catch (error) {
      console.error('Fetch current user error:', error);
      // Token is invalid or expired, clear auth data
      if (process.env.NODE_ENV === 'development') {
        console.log('Token validation failed, clearing auth data');
      }
      apiClient.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [loading]);

  useEffect(() => {
    // Generate session ID for new browser sessions
    if (!sessionStorage.getItem('vendorify_session_id')) {
      sessionStorage.setItem('vendorify_session_id', Date.now().toString());
    }
    
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'vendorify_token' && !e.newValue && user) {
        // Token was removed, clear user state but don't show logout message
        // (it was already shown in the tab that initiated logout)
        setUser(null);
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [socket, user]);

  // Socket Connection Management
  useEffect(() => {
    if (user && user.id) {
      const newSocket = io(CONFIG.API.SOCKET_URL);

      newSocket.on(SOCKET_EVENTS.CONNECTION, () => {
        if (user.role === ROLES.VENDOR) {
          // Join vendor room - will be handled by VendorDashboard with actual vendor profile ID
        } else if (user.role === ROLES.CUSTOMER) {
          newSocket.emit(SOCKET_EVENTS.JOIN_CUSTOMER_ROOM, user.id);
        }
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user]);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Set session ID to maintain session
        sessionStorage.setItem('vendorify_session_id', Date.now().toString());
        
        // Return user data, let the component handle navigation
        return { success: true, user: response.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Set session ID to maintain session
        sessionStorage.setItem('vendorify_session_id', Date.now().toString());
        
        // Navigate based on role - don't navigate here, let the component handle it
        return { success: true, user: response.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state immediately
      setUser(null);
      // Clear localStorage to ensure no stale data
      localStorage.removeItem('vendorify_token');
      localStorage.removeItem('vendorify_user');
      // Also clear any other potential auth-related data
      localStorage.removeItem('vendorify_refresh_token');
      // Clear session storage
      sessionStorage.removeItem('vendorify_session_id');
      // Disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      // Navigate to home page
      navigate('/');
    }
  };

  // Force logout - clears everything without API call
  const forceLogout = () => {
    setUser(null);
    localStorage.clear(); // Clear all localStorage data
    sessionStorage.clear(); // Clear all sessionStorage data
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    navigate('/');
  };

  // Update user function
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('vendorify_user', JSON.stringify(updatedUser));
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(user && user.id && !loading);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        forceLogout,
        updateUser,
        hasRole,
        isAuthenticated,
        socket
      }}
    >
      {children}
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
