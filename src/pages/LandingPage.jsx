import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import Hero from '../components/Hero';
import Navbar from '../components/common/Navbar';
import CategoriesCarousel from '../components/CategoriesCarousel';
import { Footer } from '../components/common/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    if (role === ROLES.CUSTOMER) {
      navigate('/customer');
    } else if (role === ROLES.VENDOR) {
      navigate('/vendor');
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
      <Footer />
    </div>
  );
};

export default LandingPage;
