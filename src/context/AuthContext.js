import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('vendorify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const role = userData.role || ROLES.CUSTOMER;

    const userWithRole = {
      ...userData,
      role,
      ...(role === ROLES.VENDOR && !userData.vendorId ? { vendorId: 1 } : {}),
    };
    
    setUser(userWithRole);
    localStorage.setItem('vendorify_user', JSON.stringify(userWithRole));
    
    // Redirect based on role
    const redirectPath = 
      userWithRole.role === ROLES.ADMIN ? '/admin' :
      userWithRole.role === ROLES.VENDOR ? '/vendor' :
      '/customer';
    
    navigate(redirectPath);
  };

  const logout = () => {
    setUser(null);
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
