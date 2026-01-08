import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_VENDORS } from '../constants/roles';

const STORAGE_KEYS = {
  vendors: 'vendorify_vendors',
  orders: 'vendorify_orders',
  cart: 'vendorify_cart',
};

const AppDataContext = createContext(null);

const seedVendors = () => {
  const seeded = (INITIAL_VENDORS || []).map((v) => ({
    ...v,
    verified: true,
    status: v.status || 'Open',
  }));
  return seeded;
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const uid = () => `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const AppDataProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedVendors = readJson(STORAGE_KEYS.vendors, null);
    const storedOrders = readJson(STORAGE_KEYS.orders, []);
    const storedCart = readJson(STORAGE_KEYS.cart, []);

    const initialVendors = storedVendors && storedVendors.length ? storedVendors : seedVendors();

    setVendors(initialVendors);
    setOrders(storedOrders);
    setCart(storedCart);

    writeJson(STORAGE_KEYS.vendors, initialVendors);
  }, []);

  useEffect(() => {
    writeJson(STORAGE_KEYS.vendors, vendors);
  }, [vendors]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.cart, cart);
  }, [cart]);

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
    getVendorById,
    addToCart,
    updateCartQty,
    clearCart,
    placeOrder,
    getOrdersForCustomer,
    getOrdersForVendor,
    updateOrderStatus,
    setVendorVerified,
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
