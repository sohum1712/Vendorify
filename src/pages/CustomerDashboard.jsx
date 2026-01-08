import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Clock, User, Store, Utensils, Carrot, Coffee, ShoppingBag, Heart, Bell, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants/roles';
import { useAppData } from '../context/AppDataContext';
import { Card, CardContent } from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const { vendors, orders } = useAppData();

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

  const favorites = vendors.slice(0, 2);
  const notifications = [
    { id: 1, text: 'Your order from Raju\'s Pani Puri is ready!', time: '2 min ago', type: 'order' },
    { id: 2, text: 'New vendor added near you', time: '1 hour ago', type: 'vendor' },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDF9DC] pb-24">
      <Navbar role="customer" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* Search & Location Bar */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 bg-[#CDF546] rounded-2xl flex items-center justify-center">
              <MapPin className="text-gray-900" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Location</p>
              <p className="font-bold text-gray-900">MG Road, Bengaluru</p>
            </div>
          </div>
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search 'Pani Puri' or 'Fresh Vegetables'..."
              className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#1A6950] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Categories */}
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-heading font-black text-gray-900 uppercase tracking-tight">Categories</h2>
                <button className="text-[12px] font-bold text-[#1A6950] uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {CATEGORIES.map(category => {
                  const IconComponent = iconMap[category.icon];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="group flex flex-col items-center min-w-[100px] gap-3"
                    >
                      <div
                        className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-[#1A6950] text-white shadow-lg rotate-6'
                            : 'bg-white text-gray-400 border border-gray-100 group-hover:border-[#CDF546] group-hover:scale-105'
                        }`}
                      >
                        {IconComponent && <IconComponent size={32} />}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        selectedCategory === category.id ? 'text-[#1A6950]' : 'text-gray-400'
                      }`}>
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bento Grid Vendors */}
            <div>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900 uppercase tracking-tight">
                  Vendors <span className="text-[#1A6950]">Near You</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[240px]">
                {filteredVendors.map((vendor, idx) => {
                  // Create a Bento pattern: first item is large, others small, some wide
                  const isLarge = idx === 0;
                  const isWide = idx === 1 || idx === 5;
                  
                  return (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                      className={`group relative rounded-[40px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-white border border-gray-100 
                        ${isLarge ? 'md:col-span-2 md:row-span-2' : ''} 
                        ${isWide ? 'md:col-span-2' : ''}`}
                    >
                      {/* Image Overlay */}
                      <div className="absolute inset-0">
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            {vendor.verified && (
                              <span className="bg-[#CDF546] text-gray-900 p-1.5 rounded-xl shadow-lg">
                                <ShieldCheck size={16} />
                              </span>
                            )}
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              {vendor.distance}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-bold">4.8</span>
                          </div>
                        </div>

                        <h3 className={`font-black uppercase tracking-tight leading-none mb-1 group-hover:text-[#CDF546] transition-colors
                          ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                          {vendor.name}
                        </h3>
                        
                        <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                          {vendor.category === 'food' ? 'Street Food' : vendor.category} • {vendor.location}
                        </p>

                        <motion.div 
                          className="mt-4 h-0 overflow-hidden group-hover:h-auto transition-all"
                          initial={false}
                        >
                          <button className="w-full bg-[#CDF546] text-gray-900 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg">
                            Order Now
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented with similar Bento-style elements */}
      </div>

      {/* Bottom Nav Simulation for Mobile consistency */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-gray-900 rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-50">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-2xl ${activeTab === 'home' ? 'bg-[#CDF546] text-gray-900' : 'text-white'}`}>
          <Home size={24} />
        </button>
        <button className="p-3 rounded-2xl text-white">
          <Clock size={24} />
        </button>
        <div className="w-16 h-16 bg-[#1A6950] rounded-full -mt-12 flex items-center justify-center text-[#CDF546] shadow-xl border-4 border-[#FDF9DC]">
          <Search size={28} />
        </div>
        <button className="p-3 rounded-2xl text-white">
          <Bell size={24} />
        </button>
        <button onClick={() => navigate('/customer/profile')} className="p-3 rounded-2xl text-white">
          <User size={24} />
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
