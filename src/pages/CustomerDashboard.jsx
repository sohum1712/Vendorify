import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Clock, User, Store, Utensils, Carrot, Coffee, ShoppingBag, Bell, Star, ShieldCheck, Heart, ArrowRight, Filter, X, MapPin, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants/roles';
import { useAppData } from '../context/AppDataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { vendors, userLocation, getOrdersForCustomer } = useAppData();

  const orders = getOrdersForCustomer();
  const notifications = [
    { id: 1, text: 'Your order is on the way!', time: '5 min ago', unread: true },
    { id: 2, text: 'New vendor nearby: Fresh Juice Corner', time: '1 hour ago', unread: true },
    { id: 3, text: 'Rate your last order from ManuBhai', time: '2 hours ago', unread: false },
  ];

  const getLocationText = () => {
    if (userLocation?.address) {
      return userLocation.address;
    }
    if (userLocation?.lat && userLocation?.lng) {
      return `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
    }
    return 'Detecting location...';
  };

  const iconMap = {
    Store,
    Utensils,
    Carrot,
    Coffee,
    ShoppingBag,
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDF9DC] pb-24 font-sans selection:bg-[#CDF546] selection:text-gray-900">
      <Navbar role="customer" />

        {/* Search & Header Section */}
        <div className="pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-[#1A6950] font-black text-[12px] uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin size={14} />
                  {getLocationText()}
                </p>
                <h1 className="text-4xl md:text-6xl font-heading font-black text-gray-900 uppercase leading-[0.9] tracking-tighter">
                  Discover <br />
                  <span className="text-white bg-[#1A6950] px-4 py-1 rounded-[20px] inline-block mt-2">Vendors</span>
                </h1>
              </div>

              <div className="relative group w-full md:max-w-md">
                <div className="absolute inset-0 bg-[#CDF546] rounded-[32px] blur-2xl opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative bg-white border border-gray-100 rounded-[32px] p-2 flex items-center gap-2 shadow-xl">
                  <div className="flex-1 flex items-center pl-6 gap-3">
                    <Search className="text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search 'Masala Dosa'..."
                      className="w-full bg-transparent border-none py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:ring-0 outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search vendors"
                    />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="bg-gray-900 text-white p-4 rounded-3xl hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-[#CDF546]"
                      aria-label="Filter options"
                      aria-expanded={showFilterDropdown}
                    >
                      <Filter size={20} />
                    </button>
                    {showFilterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</p>
                        </div>
                        {[
                          { id: 'distance', label: 'Nearest First' },
                          { id: 'rating', label: 'Highest Rated' },
                          { id: 'name', label: 'Name A-Z' }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => { setSortBy(option.id); setShowFilterDropdown(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${sortBy === option.id ? 'bg-[#CDF546] text-gray-900' : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          {/* Categories Grid - Elevated */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map(category => {
              const IconComponent = iconMap[category.icon];
              const isActive = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-6 rounded-[32px] border transition-all duration-500 overflow-hidden ${isActive
                      ? 'bg-[#1A6950] border-[#1A6950] text-white shadow-2xl shadow-[#1A6950]/20'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-[#CDF546]'
                    }`}
                >
                  <div className={`relative z-10 flex flex-col gap-4 ${isActive ? 'items-start' : 'items-center text-center'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isActive ? 'bg-[#CDF546] text-gray-900 rotate-12' : 'bg-gray-50'
                      }`}>
                      {IconComponent && <IconComponent size={24} />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{category.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

        {/* Main Content: Bento Grid Vendors */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-heading font-black text-gray-900 uppercase tracking-tight">Handpicked Vendors</h2>
            <div className="flex gap-2">
              <button 
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1A6950] hover:border-[#1A6950] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#CDF546]"
                aria-label="Previous vendors"
              >
                <ArrowRight size={18} className="rotate-180" />
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-[#1A6950] flex items-center justify-center text-white cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CDF546]"
                aria-label="Next vendors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {filteredVendors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[48px] p-12 md:p-20 text-center shadow-sm border border-gray-100"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-heading font-black text-gray-900 uppercase mb-4">No Vendors Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No vendors match "${searchQuery}". Try a different search term or browse all categories.`
                  : 'No vendors available in this category. Try selecting a different category.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="bg-[#CDF546] text-gray-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#b8dd3e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A6950]"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVendors.map((vendor, idx) => {
                const isHero = idx === 0;
                const isWide = idx === 1 || idx === 5;
                const colSpan = isHero ? 'md:col-span-8' : isWide ? 'md:col-span-6' : 'md:col-span-4';
                const rowSpan = isHero ? 'md:row-span-2' : 'md:row-span-1';

                return (
                  <motion.div
                    layout
                    key={vendor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                    className={`group relative rounded-[48px] overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-2xl active:scale-[0.98] transition-all duration-700 ${colSpan} ${rowSpan}`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          {vendor.verified && (
                            <div className="bg-[#CDF546] text-gray-900 p-2 rounded-2xl shadow-xl">
                              <ShieldCheck size={20} />
                            </div>
                          )}
                          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                            {vendor.distance}
                          </div>
                        </div>
                        <button 
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDF546] hover:text-gray-900 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                          aria-label={`Add ${vendor.name} to favorites`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart size={20} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[11px] font-black">{vendor.rating}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            {vendor.category === 'food' ? 'Street Food' : vendor.category}
                          </span>
                        </div>

                        <h3 className={`font-heading font-black uppercase tracking-tight leading-[0.8] transition-colors group-hover:text-[#CDF546] ${isHero ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
                          {vendor.name}
                        </h3>

                        <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 max-w-[200px] truncate">
                            {typeof vendor.address === 'string' ? vendor.address : 'Roaming nearby'}
                          </p>
                          <div className="bg-white text-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          )}
        </div>

        {/* Mobile Bottom Navigation - Premium Glassmorphism */}
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-gray-900/90 backdrop-blur-2xl rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-50 border border-white/10">
          <button 
            onClick={() => { setActiveTab('home'); setShowOrderHistory(false); setShowNotifications(false); }} 
            className={`relative p-3 rounded-2xl transition-all focus:outline-none ${activeTab === 'home' && !showOrderHistory && !showNotifications ? 'text-[#CDF546]' : 'text-white/40'}`}
            aria-label="Home"
          >
            <Home size={24} />
            {activeTab === 'home' && !showOrderHistory && !showNotifications && <motion.div layoutId="activeTab" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#CDF546] rounded-full" />}
          </button>
          <button 
            onClick={() => { setShowOrderHistory(!showOrderHistory); setShowNotifications(false); }} 
            className={`relative p-3 rounded-2xl transition-all focus:outline-none ${showOrderHistory ? 'text-[#CDF546]' : 'text-white/40'}`}
            aria-label="Order History"
          >
            <Clock size={24} />
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CDF546] text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>
          <div className="relative -mt-12">
            <div className="absolute inset-0 bg-[#CDF546] rounded-full blur-xl opacity-40 animate-pulse" />
            <button 
              className="relative w-16 h-16 bg-[#1A6950] rounded-full flex items-center justify-center text-[#CDF546] shadow-2xl border-4 border-[#FDF9DC] focus:outline-none focus:ring-2 focus:ring-[#CDF546]"
              aria-label="Search"
              onClick={() => document.querySelector('input[type="text"]')?.focus()}
            >
              <Search size={28} />
            </button>
          </div>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowOrderHistory(false); }}
            className={`relative p-3 rounded-2xl transition-all focus:outline-none ${showNotifications ? 'text-[#CDF546]' : 'text-white/40'}`}
            aria-label="Notifications"
          >
            <Bell size={24} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('/customer/profile')} 
            className="p-3 rounded-2xl text-white/40 focus:outline-none focus:text-[#CDF546]"
            aria-label="Profile"
          >
            <User size={24} />
          </button>
        </div>

        {/* Order History Modal */}
        <AnimatePresence>
          {showOrderHistory && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="md:hidden fixed bottom-28 left-6 right-6 bg-white rounded-[32px] shadow-2xl border border-gray-100 max-h-[60vh] overflow-hidden z-40"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-lg uppercase tracking-tight">Order History</h3>
                <button onClick={() => setShowOrderHistory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
                {orders.length > 0 ? orders.map(order => (
                  <div key={order.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-400">#{order.id}</span>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'NEW' ? 'bg-[#CDF546] text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900">{order.items.map(i => i.name).join(', ')}</p>
                    <p className="text-lg font-black text-[#1A6950] mt-1">₹{order.total}</p>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold">No orders yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="md:hidden fixed bottom-28 left-6 right-6 bg-white rounded-[32px] shadow-2xl border border-gray-100 max-h-[60vh] overflow-hidden z-40"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-lg uppercase tracking-tight">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-gray-50 ${n.unread ? 'bg-[#CDF546]/10' : ''}`}>
                    <p className="font-bold text-gray-900 text-sm">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    );
};

export default CustomerDashboard;
