import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'guest',
    name: 'Guest User',
    email: 'guest@example.com',
    role: ROLES.CUSTOMER
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('vendorify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (userData) => {
    const newUser = { ...userData, id: Date.now().toString() };
    setUser(newUser);
    localStorage.setItem('vendorify_user', JSON.stringify(newUser));
    
    const redirectPath =
      newUser.role === ROLES.ADMIN ? '/admin' :
        newUser.role === ROLES.VENDOR ? '/vendor' :
          '/customer';

    navigate(redirectPath);
    return { success: true };
  };

  const login = async (arg1, arg2) => {
    let role = ROLES.CUSTOMER;
    if (typeof arg1 === 'object') {
      role = arg1.role || ROLES.CUSTOMER;
    }
    
    const mockUser = {
      id: 'mock-id',
      name: 'Mock User',
      email: 'mock@example.com',
      role: role
    };

    setUser(mockUser);
    localStorage.setItem('vendorify_user', JSON.stringify(mockUser));

    const redirectPath =
      role === ROLES.ADMIN ? '/admin' :
        role === ROLES.VENDOR ? '/vendor' :
          '/customer';

    navigate(redirectPath);
    return { success: true };
  };

  const logout = () => {
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      role: ROLES.CUSTOMER
    });
    localStorage.removeItem('vendorify_user');
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
        isAuthenticated: !!user
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
