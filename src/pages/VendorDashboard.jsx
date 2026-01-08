import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Store, Package, Clock, TrendingUp, User, Star, Plus, Edit, MapPin, MessageCircle, Camera, ShieldCheck, ArrowUpRight, Utensils, Settings, Bell, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../context/AppDataContext';
import VendorVoiceAssistant from '../components/vendor/VendorVoiceAssistant';
import AIProductListing from '../components/vendor/AIProductListing';
import Navbar from '../components/common/Navbar';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getOrdersForVendor, getVendorById } = useAppData();
  const [isOnline, setIsOnline] = useState(true);
  const [showAIListing, setShowAIListing] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Pani Puri (6pcs)', price: 30, available: true },
    { id: 2, name: 'Dahi Puri', price: 50, available: true },
    { id: 3, name: 'Masala Puri', price: 40, available: false },
  ]);

  const vendorId = 1;
  const vendor = getVendorById(vendorId);
  const orders = getOrdersForVendor(vendorId);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const handleAddProduct = useCallback((newProduct) => {
    setMenuItems(prev => [...prev, newProduct]);
  }, []);

  const stats = [
    { id: 1, name: 'Today\'s Earnings', value: '₹1,240', change: '+12%', icon: DollarSign, color: 'bg-[#CDF546] text-gray-900', delay: 0 },
    { id: 2, name: 'Active Orders', value: orders.filter(o => o.status === 'NEW').length, change: '+2', icon: Package, color: 'bg-[#1A6950] text-white', delay: 0.1 },
    { id: 3, name: 'Total Revenue', value: `₹${totalEarnings}`, change: '+8%', icon: TrendingUp, color: 'bg-white text-[#1A6950]', delay: 0.2 },
    { id: 4, name: 'Avg Rating', value: '4.8', change: '+0.2', icon: Star, color: 'bg-gray-900 text-white', delay: 0.3 },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9DC] pb-24 font-sans selection:bg-[#CDF546]">
      <Navbar role="vendor" />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative"
            >
              <div className="w-24 h-24 bg-[#1A6950] rounded-[32px] flex items-center justify-center shadow-2xl relative z-10">
                <Store size={40} className="text-[#CDF546]" />
              </div>
              <div className="absolute inset-0 bg-[#CDF546] rounded-[32px] blur-2xl opacity-40 animate-pulse" />
            </motion.div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tighter">Raju's Pani Puri</h1>
                <ShieldCheck className="text-[#1A6950]" size={28} />
              </div>
              <p className="text-gray-400 font-bold text-[12px] uppercase tracking-[0.3em] flex items-center gap-2">
                <MapPin size={14} className="text-[#1A6950]" />
                MG Road, Bengaluru • Verified Shop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[28px] border border-white/50 shadow-sm">
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase tracking-widest transition-all ${
                isOnline ? 'bg-white text-[#1A6950] shadow-md' : 'text-gray-400'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#1A6950]' : 'bg-gray-300'}`} />
              {isOnline ? 'Accepting' : 'Paused'}
            </button>
            <button className="p-4 text-gray-400 hover:text-gray-900 transition-colors">
              <Bell size={24} />
            </button>
            <button onClick={logout} className="p-4 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Premium Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className={`relative rounded-[48px] p-10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group cursor-pointer border border-gray-100 ${stat.color}`}
            >
              <div className="relative z-10">
                <p className={`font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-70`}>{stat.name}</p>
                <h3 className="text-4xl font-heading font-black mb-6">{stat.value}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-black/10">
                    {stat.change}
                  </span>
                  <stat.icon size={24} className="opacity-40 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" />
                </div>
              </div>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full translate-x-12 -translate-y-12" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Menu & Orders Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[56px] p-10 md:p-14 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight">Shop Menu</h2>
                  <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mt-1">Manage items & availability</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => setShowAIListing(true)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#1A6950] text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1A6950]/20 hover:scale-105 transition-all"
                  >
                    <Camera size={18} />
                    AI Add
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#CDF546] text-gray-900 px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#CDF546]/20 hover:scale-105 transition-all">
                    <Plus size={18} />
                    Manual
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {menuItems.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="group flex items-center justify-between p-6 bg-gray-50 rounded-[32px] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Utensils className="text-[#1A6950]" size={28} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 uppercase tracking-tight text-lg">{item.name}</p>
                          <p className="text-[#1A6950] font-black text-xl">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-400'}`} />
                        <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-gray-900 hover:shadow-md transition-all">
                          <Settings size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Orders Bento */}
            <div className="bg-gray-900 rounded-[56px] p-10 md:p-14 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#CDF546] rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <h2 className="text-3xl font-heading font-black uppercase tracking-tight">Active Orders</h2>
                <button 
                  onClick={() => navigate('/vendor/orders')}
                  className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-[#CDF546] hover:text-gray-900 transition-all"
                >
                  <ArrowUpRight size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 hover:border-[#CDF546]/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Customer</p>
                        <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-[#CDF546] transition-colors">{order.customerName || 'Guest'}</h4>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'NEW' ? 'bg-[#CDF546] text-gray-900' : 'bg-white/10 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-2xl font-black">₹{order.total}</span>
                      <div className="flex gap-2">
                        <button className="bg-white/10 p-4 rounded-2xl hover:bg-white hover:text-gray-900 transition-all">
                          <MessageCircle size={20} />
                        </button>
                        <button className="bg-[#CDF546] text-gray-900 p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                          <Package size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: AI & Voice */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#1A6950] rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#CDF546] rounded-[28px] flex items-center justify-center mb-8 shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                  <MessageCircle size={36} className="text-gray-900" />
                </div>
                <h3 className="text-3xl font-heading font-black uppercase mb-4 leading-none">
                  Voice <br /> Control
                </h3>
                <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed">
                  Say "Turn off orders" or "What's my total?" to interact with Vendorify AI.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-1/2 h-full bg-[#CDF546]"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CDF546]">Listening</span>
                </div>
              </div>
            </motion.div>

            <div className="bg-white rounded-[56px] p-12 shadow-sm border border-gray-100">
              <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-8 tracking-tight">Daily Progress</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <span>Goal Reached</span>
                    <span className="text-[#1A6950]">85%</span>
                  </div>
                  <div className="h-4 bg-gray-50 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-[#1A6950] rounded-full w-[85%]" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] group hover:bg-[#CDF546] transition-all duration-500 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Star className="text-yellow-500" size={20} />
                    </div>
                    <span className="font-black uppercase tracking-tight text-gray-900 text-sm">Rating Goal</span>
                  </div>
                  <ArrowUpRight size={20} className="text-gray-300 group-hover:text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendorVoiceAssistant />
      
      {showAIListing && (
        <AIProductListing
          onClose={() => setShowAIListing(false)}
          onProductAdded={handleAddProduct}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
