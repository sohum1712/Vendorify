import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Clock, User, Store, Utensils, Carrot, Coffee, ShoppingBag, Heart, Bell } from 'lucide-react';
import { CATEGORIES } from '../constants/roles';
import { useAppData } from '../context/AppDataContext';
import { Card, CardContent } from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

  // Filter vendors based on search and category
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Mock data for favorites and notifications
  const favorites = vendors.slice(0, 2);
  const notifications = [
    { id: 1, text: 'Your order from Raju\'s Pani Puri is ready!', time: '2 min ago', type: 'order' },
    { id: 2, text: 'New vendor added near you', time: '1 hour ago', type: 'vendor' },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop relative">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <div className="flex items-center font-bold text-gray-800 text-sm">
              <MapPin size={14} className="text-indigo-600 mr-1" />
              MG Road, Bengaluru
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search 'Pani Puri' or 'Tea'..."
            className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            {/* Categories */}
            <div>
              <h2 className="font-bold text-gray-800 mb-3">Categories</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(category => {
                  const IconComponent = iconMap[category.icon];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center min-w-[70px] space-y-2 ${
                        selectedCategory === category.id ? 'opacity-100' : 'opacity-60'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all ${
                          selectedCategory === category.id
                            ? 'bg-indigo-600 text-white scale-110'
                            : 'bg-white text-gray-700 border border-gray-100'
                        }`}
                      >
                        {IconComponent && <IconComponent size={20} />}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vendors List */}
            <div>
              <h2 className="font-bold text-gray-800 mb-3">Nearby Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.map(vendor => (
                  <Card
                    key={vendor.id}
                    hoverEffect
                    className="cursor-pointer"
                    onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                  >
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 truncate">{vendor.name}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                            vendor.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {vendor.verified ? 'Verified' : 'Not verified'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 truncate">
                          {vendor.category === 'food' ? 'Street Food' : vendor.category}
                        </p>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                          {vendor.distance}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Order History</h2>
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <Card key={order.id} hoverEffect>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold text-gray-800">₹{order.total}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Favorite Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map(vendor => (
                <Card
                  key={vendor.id}
                  hoverEffect
                  className="cursor-pointer"
                  onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.category}</p>
                    </div>
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Notifications</h2>
            <div className="space-y-3">
              {notifications.map(notif => (
                <Card key={notif.id} hoverEffect>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.type === 'order' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {notif.type === 'order' ? <Clock size={16} className="text-green-600" /> : <Store size={16} className="text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-40 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Home size={20} className={activeTab === 'home' ? 'fill-indigo-100' : ''} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => navigate('/customer/profile')} className="flex flex-col items-center text-gray-400">
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
        <button className="w-12 h-12 bg-indigo-600 rounded-full -mt-6 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Search size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Clock size={20} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex flex-col items-center relative ${activeTab === 'notifications' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Bell size={20} />
          <span className="text-[10px] font-medium">Alerts</span>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
