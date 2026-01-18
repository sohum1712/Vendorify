import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ROLES } from '../constants/roles';
import { useAuth } from './AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const AppDataContext = createContext(null);

// Helper to get token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('vendorify_user'));
  return user?.token;
};

const uid = () => `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const AppDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vendorify_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [userLocation, setUserLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);

  useEffect(() => {
    localStorage.setItem('vendorify_cart', JSON.stringify(cart));
  }, [cart]);

  const updateVendorLocation = useCallback((vendorId, location) => {
    setVendors((prev) =>
      prev.map((v) =>
        String(v.id) === String(vendorId)
          ? { ...v, location }
          : v
      )
    );
  }, []);

  const handleLocationUpdate = useCallback((location) => {
    setUserLocation(location);

    // If user is a vendor, update their location in the global vendor list
    if (user?.role === ROLES.VENDOR && user?.vendorId) {
      updateVendorLocation(user.vendorId, location);
    }
  }, [user, updateVendorLocation]);

  const { error: geoError } = useGeolocation(handleLocationUpdate, 120000);

  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        // Fetch Products
        const prodRes = await fetch(`${SOCKET_URL}/api/vendors/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        // Fetch Vendor Profile
        const profileRes = await fetch(`${SOCKET_URL}/api/vendors/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setVendorDetails(profileData);
        }

      } catch (err) {
        // Error fetching data - silently fail
      }
    };

    if (user?.role === ROLES.VENDOR) {
      fetchData();
    }
  }, [user]);

  // Socket Listeners
  useEffect(() => {
    if (!socket) return;

    if (user?.role === ROLES.VENDOR) {
      socket.emit('join_vendor_room', user.vendorId || 1);
    }

      socket.on('vendor_location_update', (data) => {
        updateVendorLocation(data.vendorId, { lat: data.lat, lng: data.lng });
      });

    return () => {
      socket.off('vendor_location_update');
    };
  }, [socket, user, updateVendorLocation]);

  const getVendorById = (vendorId) => vendors.find((v) => String(v.id) === String(vendorId));

  const addToCart = ({ vendorId, item }) => {
    setCart((prev) => {
      const existing = prev.find((ci) => String(ci.vendorId) === String(vendorId) && String(ci.item.id) === String(item.id));
      if (existing) {
        return prev.map((ci) =>
          String(ci.vendorId) === String(vendorId) && String(ci.item.id) === String(item.id)
            ? { ...ci, qty: ci.qty + 1 }
            : ci
        );
      }
      return [...prev, { vendorId, item, qty: 1 }];
    });
  };

  const updateCartQty = ({ vendorId, itemId, qty }) => {
    setCart((prev) => {
      const next = prev
        .map((ci) =>
          String(ci.vendorId) === String(vendorId) && String(ci.item.id) === String(itemId)
            ? { ...ci, qty }
            : ci
        )
        .filter((ci) => ci.qty > 0);
      return next;
    });
  };

  const clearCart = () => setCart([]);

  const cartSummary = useMemo(() => {
    const total = cart.reduce((sum, ci) => sum + ci.item.price * ci.qty, 0);
    const itemCount = cart.reduce((sum, ci) => sum + ci.qty, 0);
    const vendorId = cart.length ? cart[0].vendorId : null;

    return { total, itemCount, vendorId };
  }, [cart]);

  const placeOrder = ({ customerName = 'Customer', address = 'MG Road, Bengaluru' } = {}) => {
    if (!cart.length) return null;

    const vendorId = cart[0].vendorId;
    const items = cart
      .filter((ci) => String(ci.vendorId) === String(vendorId))
      .map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        qty: ci.qty,
      }));

    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

    const order = {
      id: uid(),
      vendorId,
      customerName,
      address,
      items,
      total,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [order, ...prev]);
    clearCart();

    return order;
  };

  const getOrdersForCustomer = () => orders;

  const getOrdersForVendor = (vendorId) => orders.filter((o) => String(o.vendorId) === String(vendorId));

  const updateOrderStatus = ({ orderId, status }) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const setVendorVerified = ({ vendorId, verified }) => {
    setVendors((prev) => prev.map((v) => (String(v.id) === String(vendorId) ? { ...v, verified } : v)));
  };

  const value = {
    vendors,
    orders,
    cart,
    cartSummary,
    userLocation,
    geoError,
    getVendorById,
    addToCart,
    updateCartQty,
    clearCart,
    placeOrder,
    getOrdersForCustomer,
    getOrdersForVendor,
    updateOrderStatus,
    setVendorVerified,
    updateVendorLocation,
  };

  // --- Extended Vendor Dashboard Logic ---

  // Product CRUD
  const addProduct = async (product) => {
    try {
      const token = getToken();
      const res = await fetch(`${SOCKET_URL}/api/vendors/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
      } catch (err) {
        // Error adding product
      }
  };

  const updateProduct = (id, updates) => {
    // TODO: Implement API
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id) => {
    try {
      const token = getToken();
      await fetch(`${SOCKET_URL}/api/vendors/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id)); // MongoDB uses _id
      } catch (err) {
        // Error deleting product
      }
  };

  const updateVendorDetails = async (updates) => {
    try {
      const token = getToken();
      const res = await fetch(`${SOCKET_URL}/api/vendors/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setVendorDetails(updated);
    } catch (err) {
      console.error("Update Profile Error:", err);
    }
  };

  // Merge into context value
  const extendedValue = {
    ...value,
    products,
    vendorDetails,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVendorDetails
  };

  return <AppDataContext.Provider value={extendedValue}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
};
