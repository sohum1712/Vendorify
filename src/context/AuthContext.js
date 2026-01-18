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

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
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

      setUser(data);
      localStorage.setItem('vendorify_user', JSON.stringify(data));

      // Redirect based on role
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

    const login = async (arg1, arg2) => {
      try {
        let credentials = {};
        if (typeof arg1 === 'object') {
          credentials = arg1;
        } else {
          credentials = { email: arg1, password: arg2 };
        }

        const response = await fetch('http://localhost:5000/api/auth/login', {
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

        setUser(data);
        localStorage.setItem('vendorify_user', JSON.stringify(data));

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
