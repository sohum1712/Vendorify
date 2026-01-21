import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Clock, User, Store, Utensils, Carrot, Coffee, ShoppingBag, Bell, Star, ShieldCheck, Heart, ArrowRight, Filter, X, MapPin, Package, Tag, Navigation, Sparkles, RefreshCw, Loader2, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants/roles';
import { useAppData } from '../context/AppDataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [roamingVendors, setRoamingVendors] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  
  const { 
    vendors, 
    deals, 
    orders, 
    userLocation, 
    loading, 
    error,
    geoError,
    searchVendors, 
    fetchRoamingVendors, 
    fetchNearbyVendors,
    refetchLocation,
    fetchVendors
  } = useAppData();
  
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
    if (geoError) {
      return 'Location unavailable';
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

  useEffect(() => {
    let result = vendors;
    
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }
    
    if (sortBy === 'distance' && userLocation) {
      result = [...result].sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => (a.shopName || '').localeCompare(b.shopName || ''));
    }
    
    setFilteredVendors(result);
  }, [vendors, selectedCategory, sortBy, userLocation]);

  useEffect(() => {
    const loadRoaming = async () => {
      const roaming = await fetchRoamingVendors();
      setRoamingVendors(roaming);
    };
    loadRoaming();
  }, [fetchRoamingVendors]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    setSearching(true);
    try {
      const results = await searchVendors(query, selectedCategory);
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  }, [searchVendors, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const displayVendors = searchResults || filteredVendors;

  if (loading && vendors.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDF9DC] pb-24 font-sans selection:bg-[#CDF546] selection:text-gray-900">
      <Navbar role="customer" />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-[#1A6950] font-black text-[12px] uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin size={14} />
                  {getLocationText()}
                </p>
                {userLocation && (
                  <button 
                    onClick={refetchLocation}
                    className="p-1 hover:bg-[#CDF546] rounded-full transition-colors"
                    title="Refresh location"
                  >
                    <RefreshCw size={12} className="text-[#1A6950]" />
                  </button>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-gray-900 uppercase leading-[0.9] tracking-tighter">
                Discover <br />
                <span className="text-white bg-[#1A6950] px-4 py-1 rounded-[20px] inline-block mt-2">Vendors</span>
              </h1>
              {error && (
                <p className="text-red-500 text-xs font-bold mt-2">
                  {error} - Showing cached data
                </p>
              )}
            </div>

            <div className="relative group w-full md:max-w-md">
              <div className="absolute inset-0 bg-[#CDF546] rounded-[32px] blur-2xl opacity-20 group-focus-within:opacity-40 transition-opacity" />
              <div className="relative bg-white border border-gray-100 rounded-[32px] p-2 flex items-center gap-2 shadow-xl">
                <div className="flex-1 flex items-center pl-6 gap-3">
                  {searching ? (
                    <Loader2 className="text-[#1A6950] animate-spin" size={20} />
                  ) : (
                    <Search className="text-gray-400" size={20} />
                  )}
                  <input
                    type="text"
                    placeholder="Search 'Masala Dosa'..."
                    className="w-full bg-transparent border-none py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:ring-0 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="bg-gray-900 text-white p-4 rounded-3xl hover:bg-black transition-all"
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
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {userLocation && (
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-gradient-to-r from-[#1A6950] to-emerald-700 rounded-[32px] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Map size={24} />
              </div>
              <div>
                <p className="font-black uppercase tracking-tight">Your Location</p>
                <p className="text-white/70 text-sm">{userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-400 w-2 h-2 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
      )}

      {deals.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF546] rounded-2xl flex items-center justify-center">
                <Sparkles size={20} className="text-gray-900" />
              </div>
              <h2 className="text-xl font-heading font-black text-gray-900 uppercase tracking-tight">Today's Deals</h2>
            </div>
            <button 
              onClick={() => setShowDeals(!showDeals)}
              className="text-[#1A6950] font-black text-xs uppercase tracking-widest"
            >
              {showDeals ? 'Hide' : 'View All'}
            </button>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showDeals ? '' : 'max-h-[200px] overflow-hidden'}`}>
            {deals.map((deal, idx) => (
              <motion.div
                key={deal._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/customer/vendor/${deal.vendorId}`)}
                className="bg-gradient-to-br from-[#1A6950] to-emerald-700 rounded-[24px] p-6 text-white cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <Tag size={24} className="text-[#CDF546]" />
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {deal.vendorName}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase mb-2">{deal.title}</h3>
                <p className="text-white/70 text-sm">{deal.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {roamingVendors.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Navigation size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-heading font-black text-gray-900 uppercase tracking-tight">Roaming Near You</h2>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">Live</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
            {roamingVendors.map((vendor) => (
              <motion.div
                key={vendor._id}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/customer/vendor/${vendor._id}`)}
                className="flex-shrink-0 w-72 bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={vendor.image || 'https://via.placeholder.com/100'} alt={vendor.shopName} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-black text-gray-900 uppercase text-sm">{vendor.shopName}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-gray-500">{vendor.rating || 0}</span>
                      {vendor.isOnline && (
                        <span className="ml-2 bg-green-500 w-2 h-2 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Current Location</p>
                  <p className="font-bold text-gray-900 text-sm">{vendor.schedule?.currentStop || 'Unknown'}</p>
                  {vendor.schedule?.nextStops?.[0] && (
                    <p className="text-xs text-gray-500 mt-1">
                      Next: {vendor.schedule.nextStops[0].location} @ {vendor.schedule.nextStops[0].time}
                    </p>
                  )}
                  {vendor.distance && (
                    <p className="text-xs text-blue-600 font-bold mt-2">{vendor.distance} km away</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h2 className="text-2xl font-heading font-black text-gray-900 uppercase tracking-tight">
              {searchResults ? `Search Results (${searchResults.length})` : 'Handpicked Vendors'}
            </h2>
            {searchResults && (
              <button 
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                className="text-[#1A6950] text-xs font-bold uppercase tracking-widest mt-1"
              >
                Clear search
              </button>
            )}
          </div>
          <button 
            onClick={fetchVendors}
            className="flex items-center gap-2 text-[#1A6950] font-black text-xs uppercase tracking-widest hover:bg-[#CDF546] px-4 py-2 rounded-full transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {displayVendors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] p-12 md:p-20 text-center shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-heading font-black text-gray-900 uppercase mb-4">
              {loading ? 'Loading Vendors...' : 'No Vendors Found'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {loading 
                ? 'Please wait while we fetch vendors near you.'
                : searchQuery 
                  ? `No vendors match "${searchQuery}". Try a different search term.`
                  : 'No vendors available in this category. Try selecting a different category.'}
            </p>
            {!loading && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSearchResults(null); }}
                className="bg-[#CDF546] text-gray-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <AnimatePresence mode="popLayout">
              {displayVendors.map((vendor, idx) => {
                const isHero = idx === 0;
                const isWide = idx === 1 || idx === 5;
                const colSpan = isHero ? 'md:col-span-8' : isWide ? 'md:col-span-6' : 'md:col-span-4';
                const rowSpan = isHero ? 'md:row-span-2' : 'md:row-span-1';

                return (
                  <motion.div
                    layout
                    key={vendor._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => navigate(`/customer/vendor/${vendor._id}`)}
                    className={`group relative rounded-[48px] overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-2xl active:scale-[0.98] transition-all duration-700 ${colSpan} ${rowSpan}`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={vendor.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                        alt={vendor.shopName}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 flex-wrap">
                          {vendor.isVerified && (
                            <div className="bg-[#CDF546] text-gray-900 p-2 rounded-2xl shadow-xl">
                              <ShieldCheck size={20} />
                            </div>
                          )}
                          {vendor.schedule?.isRoaming && (
                            <div className="bg-blue-500 text-white p-2 rounded-2xl shadow-xl">
                              <Navigation size={20} />
                            </div>
                          )}
                          {vendor.isOnline && (
                            <div className="bg-green-500 text-white p-2 rounded-2xl shadow-xl flex items-center gap-1">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-[10px] font-black uppercase">Live</span>
                            </div>
                          )}
                          {vendor.distance && (
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                              {vendor.distance} km
                            </div>
                          )}
                        </div>
                        <button 
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDF546] hover:text-gray-900 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart size={20} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[11px] font-black">{vendor.rating || 0}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            {vendor.category}
                          </span>
                        </div>

                        <h3 className={`font-heading font-black uppercase tracking-tight leading-[0.8] transition-colors group-hover:text-[#CDF546] ${isHero ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
                          {vendor.shopName}
                        </h3>

                        <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 max-w-[200px] truncate">
                            {vendor.schedule?.currentStop || vendor.address}
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

      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-gray-900/90 backdrop-blur-2xl rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-50 border border-white/10">
        <button 
          onClick={() => { setActiveTab('home'); setShowOrderHistory(false); setShowNotifications(false); }} 
          className={`relative p-3 rounded-2xl transition-all ${activeTab === 'home' && !showOrderHistory && !showNotifications ? 'text-[#CDF546]' : 'text-white/40'}`}
        >
          <Home size={24} />
        </button>
        <button 
          onClick={() => { setShowOrderHistory(!showOrderHistory); setShowNotifications(false); }} 
          className={`relative p-3 rounded-2xl transition-all ${showOrderHistory ? 'text-[#CDF546]' : 'text-white/40'}`}
        >
          <Clock size={24} />
          {orders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CDF546] text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">
              {orders.length}
            </span>
          )}
        </button>
        <div className="relative -mt-12">
          <button 
            className="relative w-16 h-16 bg-[#1A6950] rounded-full flex items-center justify-center text-[#CDF546] shadow-2xl border-4 border-[#FDF9DC]"
            onClick={() => document.querySelector('input[type="text"]')?.focus()}
          >
            <Search size={28} />
          </button>
        </div>
        <button 
          onClick={() => { setShowNotifications(!showNotifications); setShowOrderHistory(false); }}
          className={`relative p-3 rounded-2xl transition-all ${showNotifications ? 'text-[#CDF546]' : 'text-white/40'}`}
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
          className="p-3 rounded-2xl text-white/40"
        >
          <User size={24} />
        </button>
      </div>

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
                <div key={order._id} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-400">#{order._id?.slice(-8)}</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900">{order.items?.map(i => i.name).join(', ')}</p>
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
