import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Store, Package, Clock, TrendingUp, User, Star, Plus, Edit, MapPin, MessageCircle, Camera, ShieldCheck, ArrowUpRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
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
    { id: 1, name: 'Today\'s Earnings', value: '₹1,240', change: '+12%', icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { id: 2, name: 'Active Orders', value: orders.filter(o => o.status === 'NEW').length, change: '+2', icon: Package, color: 'bg-orange-50 text-orange-600' },
    { id: 3, name: 'Total Revenue', value: `₹${totalEarnings}`, change: '+8%', icon: TrendingUp, color: 'bg-[#1A6950]/10 text-[#1A6950]' },
    { id: 4, name: 'Rating', value: '4.6', change: '+0.2', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9DC] pb-24">
      <Navbar role="vendor" />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* Vendor Header Card */}
        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#CDF546] rounded-[32px] flex items-center justify-center shadow-lg relative">
              <Store size={40} className="text-gray-900" />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-md ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight">Raju's Pani Puri</h1>
                <ShieldCheck className="text-[#1A6950]" size={24} />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Verified Vendor • MG Road, Bengaluru</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
                isOnline ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {isOnline ? 'Accepting Orders' : 'Offline'}
            </button>
            <button 
              onClick={logout}
              className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500"
            >
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">{stat.name}</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-heading font-black text-gray-900">{stat.value}</h3>
                <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Management */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-black text-gray-900 uppercase tracking-tight">Menu Items</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAIListing(true)}
                    className="flex items-center gap-2 bg-[#1A6950] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#145a44] transition-all"
                  >
                    <Camera size={16} />
                    AI Listing
                  </button>
                  <button className="flex items-center gap-2 bg-[#CDF546] text-gray-900 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#b8dd3e] transition-all">
                    <Plus size={16} />
                    Add Manual
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-6 bg-gray-50 rounded-[32px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Utensils className="text-[#1A6950]" size={24} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 uppercase tracking-tight text-lg">{item.name}</p>
                        <p className="text-[#1A6950] font-black">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Sold Out'}
                      </span>
                      <button className="p-3 bg-white text-gray-400 rounded-xl hover:text-[#1A6950] hover:shadow-sm transition-all">
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-black text-gray-900 uppercase tracking-tight">Active Orders</h2>
                <button 
                  onClick={() => navigate('/vendor/orders')}
                  className="text-[12px] font-black text-[#1A6950] uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  View All <ArrowUpRight size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-[40px] p-8 border border-transparent hover:border-[#CDF546] transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Customer</p>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{order.customerName || 'Customer'}</h4>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'NEW' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-medium">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-2xl font-black text-gray-900">₹{order.total}</span>
                      <button className="bg-white p-4 rounded-2xl text-[#1A6950] shadow-sm hover:bg-[#1A6950] hover:text-white transition-all">
                        <MessageCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & AI Panel */}
          <div className="space-y-8">
            <div className="bg-[#1A6950] rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-[#CDF546]/20 transition-all duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-black uppercase mb-4 leading-tight">
                  Voice <br /> Assistant
                </h3>
                <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                  Manage your shop using just your voice. Say "Add Samosa" or "Check Earnings".
                </p>
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-[#CDF546] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(205,245,70,0.4)] animate-pulse">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[48px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-6">Quick Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Star className="text-yellow-500" size={20} />
                    <span className="text-sm font-black uppercase tracking-tight text-gray-900">Auto-Accept</span>
                  </div>
                  <div className="w-12 h-6 bg-[#CDF546] rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-gray-900 rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-50">
        <button className="p-3 rounded-2xl bg-[#CDF546] text-gray-900">
          <Store size={24} />
        </button>
        <button onClick={() => navigate('/vendor/orders')} className="p-3 rounded-2xl text-white">
          <Package size={24} />
        </button>
        <div className="w-16 h-16 bg-[#1A6950] rounded-full -mt-12 flex items-center justify-center text-[#CDF546] shadow-xl border-4 border-[#FDF9DC]">
          <Plus size={28} />
        </div>
        <button className="p-3 rounded-2xl text-white">
          <TrendingUp size={24} />
        </button>
        <button onClick={() => navigate('/vendor/profile')} className="p-3 rounded-2xl text-white">
          <User size={24} />
        </button>
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
