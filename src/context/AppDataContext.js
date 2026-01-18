import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ROLES } from '../constants/roles';
import { useGeolocation } from '../hooks/useGeolocation';

const SOCKET_URL = 'http://localhost:5000';

const AppDataContext = createContext(null);

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('vendorify_user'));
  return user?.token;
};

const uid = () => `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const INITIAL_VENDORS = [
  {
    id: 1,
    name: "Raju's Pani Puri",
    category: 'food',
    address: 'MG Road, Bengaluru',
    rating: 4.8,
    totalReviews: 127,
    distance: '0.3 km',
    verified: true,
    status: 'Open',
    phone: '919876543210',
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800',
      'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800'
    ],
    schedule: {
      isRoaming: true,
      currentStop: 'MG Road Corner',
      nextStops: [
        { location: 'Brigade Road', time: '12:00 PM' },
        { location: 'Church Street', time: '2:00 PM' },
        { location: 'Commercial Street', time: '5:00 PM' }
      ],
      operatingHours: '10:00 AM - 9:00 PM'
    },
    menu: [
      { id: 101, name: 'Pani Puri (6 pcs)', price: 30, icon: 'Circle', available: true },
      { id: 102, name: 'Sev Puri', price: 40, icon: 'Triangle', available: true },
      { id: 103, name: 'Dahi Puri', price: 50, icon: 'Square', available: true },
      { id: 104, name: 'Bhel Puri', price: 35, icon: 'Circle', available: true },
    ],
    reviews: [
      { id: 1, customerName: 'Priya S.', rating: 5, text: 'Best pani puri in the area! Super fresh and spicy.', date: '2026-01-15' },
      { id: 2, customerName: 'Rahul M.', rating: 4, text: 'Good taste, reasonable price. Hygiene could be better.', date: '2026-01-10' },
    ],
    deals: [
      { id: 1, title: 'Happy Hour', description: '20% off from 3-5 PM', validUntil: '2026-01-31' }
    ]
  },
  {
    id: 2,
    name: "ManuBhai's Tea",
    category: 'beverages',
    address: 'Koramangala, Bengaluru',
    rating: 4.9,
    totalReviews: 89,
    distance: '0.5 km',
    verified: true,
    status: 'Open',
    phone: '919876543211',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800'
    ],
    schedule: {
      isRoaming: false,
      currentStop: 'Koramangala 5th Block',
      nextStops: [],
      operatingHours: '6:00 AM - 10:00 PM'
    },
    menu: [
      { id: 201, name: 'Masala Chai', price: 15, icon: 'Coffee', available: true },
      { id: 202, name: 'Cutting Chai', price: 10, icon: 'Coffee', available: true },
      { id: 203, name: 'Ginger Tea', price: 20, icon: 'Coffee', available: true },
      { id: 204, name: 'Bun Maska', price: 25, icon: 'Utensils', available: true },
    ],
    reviews: [
      { id: 1, customerName: 'Anjali K.', rating: 5, text: 'The masala chai here is absolutely divine!', date: '2026-01-12' },
    ],
    deals: []
  },
  {
    id: 3,
    name: "Fresh Fruit Cart",
    category: 'fruits',
    address: 'Indiranagar, Bengaluru',
    rating: 4.6,
    totalReviews: 56,
    distance: '0.8 km',
    verified: true,
    status: 'Open',
    phone: '919876543212',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
    gallery: [],
    schedule: {
      isRoaming: true,
      currentStop: 'Indiranagar Metro',
      nextStops: [
        { location: 'CMH Road', time: '11:00 AM' },
        { location: '100 Feet Road', time: '3:00 PM' }
      ],
      operatingHours: '8:00 AM - 8:00 PM'
    },
    menu: [
      { id: 301, name: 'Mixed Fruit Bowl', price: 60, icon: 'Carrot', available: true },
      { id: 302, name: 'Watermelon Slice', price: 20, icon: 'Carrot', available: true },
      { id: 303, name: 'Papaya Cup', price: 40, icon: 'Carrot', available: true },
    ],
    reviews: [],
    deals: [
      { id: 1, title: 'Morning Fresh', description: 'Buy 2 Get 1 Free before 10 AM', validUntil: '2026-02-28' }
    ]
  },
  {
    id: 4,
    name: "Dosa Corner",
    category: 'food',
    address: 'HSR Layout, Bengaluru',
    rating: 4.7,
    totalReviews: 203,
    distance: '1.2 km',
    verified: false,
    status: 'Open',
    phone: '919876543213',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
    gallery: [],
    schedule: {
      isRoaming: false,
      currentStop: 'HSR Sector 1',
      nextStops: [],
      operatingHours: '7:00 AM - 11:00 PM'
    },
    menu: [
      { id: 401, name: 'Masala Dosa', price: 50, icon: 'Utensils', available: true },
      { id: 402, name: 'Plain Dosa', price: 40, icon: 'Utensils', available: true },
      { id: 403, name: 'Rava Dosa', price: 55, icon: 'Utensils', available: true },
      { id: 404, name: 'Set Dosa', price: 45, icon: 'Utensils', available: true },
    ],
    reviews: [],
    deals: []
  },
  {
    id: 5,
    name: "Juice Junction",
    category: 'beverages',
    address: 'Jayanagar, Bengaluru',
    rating: 4.5,
    totalReviews: 78,
    distance: '1.5 km',
    verified: true,
    status: 'Closed',
    phone: '919876543214',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800',
    gallery: [],
    schedule: {
      isRoaming: false,
      currentStop: 'Jayanagar 4th Block',
      nextStops: [],
      operatingHours: '9:00 AM - 9:00 PM'
    },
    menu: [
      { id: 501, name: 'Fresh Orange', price: 40, icon: 'Coffee', available: true },
      { id: 502, name: 'Watermelon Juice', price: 35, icon: 'Coffee', available: true },
      { id: 503, name: 'Mixed Fruit', price: 50, icon: 'Coffee', available: true },
    ],
    reviews: [],
    deals: []
  }
];

export const AppDataProvider = ({ children }) => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vendorify_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [userLocation, setUserLocation] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, name: 'Pani Puri (6 pcs)', price: 30, available: true, image: null },
    { id: 2, name: 'Sev Puri', price: 40, available: true, image: null },
    { id: 3, name: 'Dahi Puri', price: 50, available: true, image: null },
  ]);
  const [vendorDetails, setVendorDetails] = useState({
    shopName: "Raju's Pani Puri",
    address: 'MG Road, Bengaluru',
    phone: '919876543210',
    rating: 4.8,
    totalReviews: 127,
    image: null,
    isRoaming: true,
    currentStop: 'MG Road Corner',
    nextStops: [
      { location: 'Brigade Road', time: '12:00 PM' },
      { location: 'Church Street', time: '2:00 PM' },
      { location: 'Commercial Street', time: '5:00 PM' }
    ]
  });
  const [reviews, setReviews] = useState([]);

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
  }, []);

  const { error: geoError } = useGeolocation(handleLocationUpdate, 120000);

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

  // WhatsApp Integration
  const generateWhatsAppOrderLink = (vendorPhone, cartItems, total, vendorName) => {
    const itemsList = cartItems.map(ci => `• ${ci.qty}x ${ci.item.name} - ₹${ci.item.price * ci.qty}`).join('\n');
    const message = `🛒 *New Order Request*\n\n*Vendor:* ${vendorName}\n\n*Items:*\n${itemsList}\n\n*Total:* ₹${total}\n\n📍 Please confirm availability and delivery time.`;
    return `https://wa.me/${vendorPhone}?text=${encodeURIComponent(message)}`;
  };

  const generateWhatsAppShareLink = (vendor) => {
    const message = `🏪 Check out *${vendor.name}* on Vendorify!\n\n⭐ Rating: ${vendor.rating}/5\n📍 ${vendor.address}\n🕐 ${vendor.schedule?.operatingHours || 'Check timings'}\n\n${vendor.verified ? '✅ Verified Vendor' : ''}\n\nOrder now on Vendorify!`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Reviews System
  const addReview = ({ vendorId, customerName, rating, text }) => {
    const newReview = {
      id: Date.now(),
      customerName,
      rating,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    setVendors(prev => prev.map(v => {
      if (String(v.id) === String(vendorId)) {
        const updatedReviews = [...(v.reviews || []), newReview];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...v,
          reviews: updatedReviews,
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: updatedReviews.length
        };
      }
      return v;
    }));

    return newReview;
  };

  const getVendorReviews = (vendorId) => {
    const vendor = getVendorById(vendorId);
    return vendor?.reviews || [];
  };

  // Vendor Schedule/Roaming
  const updateVendorSchedule = (vendorId, scheduleUpdate) => {
    setVendors(prev => prev.map(v => 
      String(v.id) === String(vendorId) 
        ? { ...v, schedule: { ...v.schedule, ...scheduleUpdate } }
        : v
    ));
    
    if (String(vendorId) === '1') {
      setVendorDetails(prev => ({ ...prev, ...scheduleUpdate }));
    }
  };

  const updateCurrentLocation = (vendorId, currentStop) => {
    updateVendorSchedule(vendorId, { currentStop });
  };

  // Vendor Gallery
  const addToGallery = (vendorId, imageUrl) => {
    setVendors(prev => prev.map(v => 
      String(v.id) === String(vendorId)
        ? { ...v, gallery: [...(v.gallery || []), imageUrl] }
        : v
    ));
  };

  // Community Deals
  const getCommunityDeals = () => {
    return vendors
      .filter(v => v.deals && v.deals.length > 0 && v.verified)
      .flatMap(v => v.deals.map(d => ({ ...d, vendorId: v.id, vendorName: v.name })));
  };

  // Analytics for Vendor
  const getVendorAnalytics = (vendorId) => {
    const vendorOrders = getOrdersForVendor(vendorId);
    const completedOrders = vendorOrders.filter(o => o.status === 'COMPLETED');
    
    const hourlyData = Array(24).fill(0);
    const itemSales = {};

    vendorOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyData[hour]++;
      
      order.items.forEach(item => {
        itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
      });
    });

    const topItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    return {
      totalOrders: vendorOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue: completedOrders.reduce((sum, o) => sum + o.total, 0),
      hourlyData,
      topItems,
      avgOrderValue: completedOrders.length > 0 
        ? Math.round(completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length)
        : 0
    };
  };

  // Product CRUD
  const addProduct = async (product) => {
    const newProduct = { ...product, id: Date.now(), available: true };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateVendorDetails = async (updates) => {
    setVendorDetails(prev => ({ ...prev, ...updates }));
  };

  const value = {
    vendors,
    orders,
    cart,
    cartSummary,
    userLocation,
    geoError,
    products,
    vendorDetails,
    reviews,
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
    addProduct,
    updateProduct,
    deleteProduct,
    updateVendorDetails,
    generateWhatsAppOrderLink,
    generateWhatsAppShareLink,
    addReview,
    getVendorReviews,
    updateVendorSchedule,
    updateCurrentLocation,
    addToGallery,
    getCommunityDeals,
    getVendorAnalytics
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
};
