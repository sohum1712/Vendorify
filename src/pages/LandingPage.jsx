import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import Hero from '../components/Hero';
import Navbar from '../components/common/Navbar';
import CategoriesCarousel from '../components/CategoriesCarousel';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    if (role === ROLES.CUSTOMER) {
      navigate('/login/customer');
    } else if (role === ROLES.VENDOR) {
      navigate('/login/vendor');
    }
  };

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
    </div>
  );
};

export default LandingPage;
