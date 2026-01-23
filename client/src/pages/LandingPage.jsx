import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import Hero from '../components/Hero';
import Navbar from '../components/common/Navbar';
import CategoriesCarousel from '../components/CategoriesCarousel';
import { Footer } from '../components/common/Footer';

import { useAuth } from '../context/AuthContext';
import { debugAuth, clearAllAuth } from '../utils/authDebug';
import { navigateToDashboard } from '../utils/navigation';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, forceLogout } = useAuth();

  const handleContinue = (role) => {
    // For now, redirect to login page - users will select their role there
    // In the future, we could pre-select the role or have separate flows
    navigate('/login');
  };

  const handleDashboardRedirect = () => {
    navigateToDashboard(navigate, user);
  };

  const handleForceLogout = () => {
    forceLogout();
  };

  const handleTestToken = async () => {
    await debugAuth();
  };

  // Auto-redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (!loading && isAuthenticated && user && user.id) {
      console.log('Auto-redirecting authenticated user to dashboard');
      handleDashboardRedirect();
    }
  }, [isAuthenticated, user, loading]);

  // Debug: Log current auth state
  React.useEffect(() => {
    console.log('LandingPage - Auth State:', {
      isAuthenticated,
      user: user ? { id: user.id, name: user.name, role: user.role } : null,
      loading,
      token: localStorage.getItem('vendorify_token') ? 'exists' : 'none',
      storedUser: localStorage.getItem('vendorify_user') ? 'exists' : 'none'
    });
    
    // Make debug functions available globally
    window.debugAuth = debugAuth;
    window.clearAllAuth = clearAllAuth;
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9DC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CDF546] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated && user && user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9DC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CDF546] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div id="hero">
        <Hero
          onContinueCustomer={() => handleContinue(ROLES.CUSTOMER)}
          onContinueVendor={() => handleContinue(ROLES.VENDOR)}
        />
      </div>
      <CategoriesCarousel />
      <Footer />
    </div>
  );
};

export default LandingPage;
