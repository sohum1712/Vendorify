import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Socket URL is usually the base URL without /api
const SOCKET_URL = API_URL.replace('/api', '');

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
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

  // Socket Connection Management
  useEffect(() => {
    if (user && user.id !== 'guest') {
      const newSocket = io(SOCKET_URL);

      newSocket.on('connect', () => {
        console.log('Socket Connected:', newSocket.id);
        if (user.role === ROLES.VENDOR) {
          // Determine vendorId (assuming backend might need to know which vendor doc to join)
          // However, our backend join logic expects distinct IDs.
          // The backend listens for 'join_vendor_room' with 'vendorId'. 
          // Currently user object might not have vendorId directly if it's just the User doc.
          // But let's assume for now we join with user.id, awaiting backend alignment or 
          // we fetch vendor profile to get actual vendorId.
          // Verification script showed we need the VENDOR DOC ID.
          // So we should probably fetch that or store it in user object.
          // For now, let's join with user.id as a fallback or if backend handles it.
          // WAIT, earlier verification showed we need profileRes.data._id. 
          // So we need to fetch the vendor profile to join the room correct?
          // Or maybe we can just join room `user_${user.id}`?
          // The backend code: socket.join(`vendor_${vendorId}`);
          // So we definitely need the vendorId.
          // Let's rely on the VendorDashboard to emit the join event with the correct ID 
          // once it fetches the profile. 
          // But providing the socket instance here is the main goal.
        } else if (user.role === ROLES.CUSTOMER) {
          newSocket.emit('join_customer_room', user.id);
        }
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user]);

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
        isAuthenticated: user && user.id !== 'guest',
        socket
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
