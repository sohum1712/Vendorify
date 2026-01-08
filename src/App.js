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

// Customer Flow Pages
import CustomerLayout from './pages/customer/CustomerLayout';
import VendorDetails from './pages/customer/VendorDetails';
import CartPage from './pages/customer/CartPage';
import CustomerOrders from './pages/customer/CustomerOrders';
import MapPage from './pages/customer/MapPage';

// Vendor Flow Pages
import VendorLayout from './pages/vendor/VendorLayout';
import VendorOrders from './pages/vendor/VendorOrders';

// Admin Flow Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminVendors from './pages/admin/AdminVendors';

// Chat
import ChatbotWidget from './components/chat/ChatbotWidget';

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
            
            <Route element={
              <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />
            }>
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="vendor/:vendorId" element={<VendorDetails />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="map" element={<MapPage />} />
              </Route>
            </Route>

            <Route element={
              <ProtectedRoute allowedRoles={[ROLES.VENDOR]} />
            }>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="orders" element={<VendorOrders />} />
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

          <ChatbotWidget />
        </div>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
