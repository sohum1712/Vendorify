import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Store, Package, Clock, TrendingUp, User, Star, Plus, Edit, MapPin, MessageCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { useAppData } from '../context/AppDataContext';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getOrdersForVendor, getVendorById } = useAppData();
  const [isOnline, setIsOnline] = useState(true);

  const vendorId = 1; // Static for demo; in real app, get from auth
  const vendor = getVendorById(vendorId);
  const orders = getOrdersForVendor(vendorId);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const handleShareOnWhatsApp = (order) => {
    const customerName = order.customerName || 'Customer';
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');
    
    const message = `🛵 *Order Update from ${vendor?.name || 'Vendor'}*\n\n` +
      `👤 Customer: ${customerName}\n` +
      `📦 Items:\n${itemsList}\n` +
      `💰 Total: ₹${order.total}\n` +
      `📊 Status: ${order.status}\n` +
      `🕐 Time: ${new Date(order.createdAt).toLocaleString()}\n\n` +
      `Thank you for your order! 🙏`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const stats = [
    { id: 1, name: 'Today\'s Earnings', value: '₹1,240', change: '+12%', changeType: 'positive', icon: TrendingUp },
    { id: 2, name: 'Active Orders', value: orders.filter(o => o.status === 'NEW').length, change: '+2', changeType: 'positive', icon: Package },
    { id: 3, name: 'Total Revenue', value: `₹${totalEarnings}`, change: '+8%', changeType: 'positive', icon: TrendingUp },
    { id: 4, name: 'Rating', value: '4.6', change: '+0.2', changeType: 'positive', icon: Star },
  ];

  // Mock menu items for product management
  const menuItems = [
    { id: 1, name: 'Pani Puri (6pcs)', price: 30, available: true },
    { id: 2, name: 'Dahi Puri', price: 50, available: true },
    { id: 3, name: 'Masala Puri', price: 40, available: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-6 pb-12 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
              <Store size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg">Raju's Pani Puri</h1>
              <p className="text-indigo-200 text-xs">Verified Vendor • Basic Plan (3%)</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <p className="text-indigo-200 text-xs mb-1">{stat.name}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <stat.icon size={18} className="text-green-400" />
              </div>
              {stat.change && (
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change} {stat.changeType === 'positive' ? '↑' : '↓'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 -mt-8 space-y-6">
        {/* Status Toggle */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Shop Status</h3>
              <p className="text-xs text-gray-500">Are you currently visible to customers?</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  isOnline ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isOnline ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Product Management */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Product Management</h3>
            <button className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              <Plus size={14} />
              Add Item
            </button>
          </div>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </span>
                  <button className="text-indigo-600 hover:bg-indigo-50 p-1 rounded">
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Info */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Profile Info</h3>
            <button className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              <Edit size={14} />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-800">Location</p>
                <p className="text-xs text-gray-600">MG Road, Bengaluru</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Store size={16} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-800">Shop Name</p>
                <p className="text-xs text-gray-600">Raju's Pani Puri</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star size={16} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-800">Rating</p>
                <p className="text-xs text-gray-600">4.6 (127 reviews)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
            <button
              type="button"
              onClick={() => navigate('/vendor/orders')}
              className="text-xs text-indigo-600 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} hoverEffect>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{order.customerName || 'Customer'}</p>
                    <p className="text-sm text-gray-600">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'NEW' 
                        ? 'bg-orange-100 text-orange-600' 
                        : order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleShareOnWhatsApp(order)}
                      className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-bold text-gray-800">₹{order.total}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-40 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
        <button className="flex flex-col items-center text-indigo-600">
          <Store size={20} className="fill-indigo-100" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/vendor/orders')}
          className="flex flex-col items-center text-gray-400"
        >
          <Package size={20} />
          <span className="text-[10px] font-medium">Orders</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <Clock size={20} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
