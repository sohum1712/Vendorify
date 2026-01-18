import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Pages
import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import VendorLogin from './pages/vendor/VendorLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InfoPage from './pages/InfoPage';

// Customer Flow Pages
import CustomerLayout from './pages/customer/CustomerLayout';
import VendorDetails from './pages/customer/VendorDetails';
import CartPage from './pages/customer/CartPage';
import CustomerOrders from './pages/customer/CustomerOrders';
import MapPage from './pages/customer/MapPage';
import CustomerProfile from './pages/customer/CustomerProfile';

// Vendor Flow Pages
import VendorLayout from './pages/vendor/VendorLayout';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProfile from './pages/vendor/VendorProfile';

// Admin Flow Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminVendors from './pages/admin/AdminVendors';

// Chat
import ConditionalChatbot from './components/chat/ConditionalChatbot';

// Components
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Constants
import { ROLES } from './constants/roles';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Login Routes */}
            <Route path="/login/customer" element={<CustomerLogin />} />
              <Route path="/login/vendor" element={<VendorLogin />} />
              
              {/* Info Routes */}
              <Route path="/about" element={<InfoPage />} />
              <Route path="/security" element={<InfoPage />} />
              <Route path="/integrations" element={<InfoPage />} />
              <Route path="/careers" element={<InfoPage />} />
              <Route path="/blog" element={<InfoPage />} />
              <Route path="/docs" element={<InfoPage />} />
              <Route path="/help" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/privacy" element={<InfoPage />} />
              
              <Route element={
              <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />
            }>
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="vendor/:vendorId" element={<VendorDetails />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="map" element={<MapPage />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>
            </Route>

            <Route element={
              <ProtectedRoute allowedRoles={[ROLES.VENDOR]} />
            }>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="profile" element={<VendorProfile />} />
              </Route>
            </Route>

            <Route element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />
            }>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="vendors" element={<AdminVendors />} />
              </Route>
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
