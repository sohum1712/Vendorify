import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import VendorLogin from './pages/vendor/VendorLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import VendorSignup from './pages/vendor/VendorSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InfoPage from './pages/InfoPage';
import ForgotPassword from './pages/ForgotPassword';

import CustomerLayout from './pages/customer/CustomerLayout';
import VendorDetails from './pages/customer/VendorDetails';
import CartPage from './pages/customer/CartPage';
import CustomerOrders from './pages/customer/CustomerOrders';
import MapPage from './pages/customer/MapPage';
import CustomerProfile from './pages/customer/CustomerProfile';

import VendorLayout from './pages/vendor/VendorLayout';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProfile from './pages/vendor/VendorProfile';

import AdminLayout from './pages/admin/AdminLayout';
import AdminVendors from './pages/admin/AdminVendors';

import ConditionalChatbot from './components/chat/ConditionalChatbot';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login/customer" element={<CustomerLogin />} />
            <Route path="/login/vendor" element={<VendorLogin />} />
            <Route path="/signup/customer" element={<CustomerSignup />} />
            <Route path="/signup/vendor" element={<VendorSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/about" element={<InfoPage page="about" />} />
            <Route path="/security" element={<InfoPage page="security" />} />
            <Route path="/integrations" element={<InfoPage page="integrations" />} />
            <Route path="/careers" element={<InfoPage page="careers" />} />
            <Route path="/blog" element={<InfoPage page="blog" />} />
            <Route path="/docs" element={<InfoPage page="docs" />} />
            <Route path="/help" element={<InfoPage page="help" />} />
            <Route path="/terms" element={<InfoPage page="terms" />} />
            <Route path="/privacy" element={<InfoPage page="privacy" />} />
            <Route path="/customers" element={<InfoPage page="customers" />} />
            
              {/* Customer Routes (Open) */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="vendor/:vendorId" element={<VendorDetails />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="map" element={<MapPage />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              {/* Vendor Routes (Open) */}
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="profile" element={<VendorProfile />} />
              </Route>

              {/* Admin Routes (Open) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="vendors" element={<AdminVendors />} />
              </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <ConditionalChatbot />
        </div>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
