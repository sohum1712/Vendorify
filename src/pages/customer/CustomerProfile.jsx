import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  ShoppingBag,
  Heart,
  Edit,
  Camera,
  TrendingUp,
  Package,
  Award,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import ScrollToTop from '../../components/common/ScrollToTop';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { getOrdersForCustomer } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock customer data (in real app, this would come from context)
  const customerDetails = {
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'MG Road, Bengaluru',
    joinDate: '2024-01-15',
    memberSince: 'January 2024',
    preferences: {
      cuisine: ['Indian', 'Street Food', 'Chinese'],
      dietary: ['Vegetarian'],
      notifications: 'enabled'
    },
    stats: {
      totalOrders: 47,
      totalSpent: 3850,
      favoriteVendors: 8,
      averageOrderValue: 82
    }
  };

  const orders = getOrdersForCustomer(1); // Mock customer ID
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { 
      icon: Package, 
      label: 'Total Orders', 
      value: customerDetails.stats.totalOrders, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      icon: TrendingUp, 
      label: 'Total Spent', 
      value: `₹${customerDetails.stats.totalSpent}`, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      icon: Heart, 
      label: 'Favorite Vendors', 
      value: customerDetails.stats.favoriteVendors, 
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    { 
      icon: ShoppingBag, 
      label: 'Avg Order Value', 
      value: `₹${customerDetails.stats.averageOrderValue}`, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const handleEditProfile = () => {
    setIsEditing(true);
    // In real app, this would open edit modal
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In real app, this would save to backend
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={isEditing ? handleSaveProfile : handleEditProfile}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
            >
              {isEditing ? (
                <>
                  <Settings size={16} />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit size={16} />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-purple-600 p-2 rounded-full shadow-lg">
                <Camera size={16} />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{customerDetails.name}</h1>
              <p className="text-white/80 mb-4">Member since {customerDetails.memberSince}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{customerDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Joined {customerDetails.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'orders', 'favorites', 'preferences'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">About Me</h3>
                  <p className="text-gray-600 mb-4">
                    Food enthusiast who loves exploring local street food and supporting small vendors. 
                    Always looking for authentic flavors and great service!
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Favorite Cuisines</h4>
                      <div className="flex flex-wrap gap-2">
                        {customerDetails.preferences.cuisine.map((cuisine, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Dietary Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {customerDetails.preferences.dietary.map((diet, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {diet}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Placed order at Raju\'s Pani Puri', time: '2 hours ago', icon: ShoppingBag },
                      { action: 'Added new favorite vendor', time: '1 day ago', icon: Heart },
                      { action: 'Reviewed Street Food Corner', time: '3 days ago', icon: Star },
                      { action: 'Updated profile preferences', time: '1 week ago', icon: Settings }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <activity.icon className="text-purple-600" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Order History</h3>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{order.vendorName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₹{order.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-600'
                              : order.status === 'PREPARING'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Favorite Vendors</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Raju\'s Pani Puri', category: 'Street Food', rating: 4.6, orders: 12 },
                    { name: 'Street Food Corner', category: 'Chinese', rating: 4.3, orders: 8 },
                    { name: 'Chai Point', category: 'Beverages', rating: 4.8, orders: 15 },
                    { name: 'South Indian Cafe', category: 'South Indian', rating: 4.5, orders: 6 }
                  ].map((vendor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{vendor.name}</h4>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-gray-600">{vendor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{vendor.orders} orders</span>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">
                          View Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Order Updates</p>
                          <p className="text-sm text-gray-500">Get notified about your order status</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={customerDetails.preferences.notifications === 'enabled'}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Promotional Offers</p>
                          <p className="text-sm text-gray-500">Receive deals from favorite vendors</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Mail className="text-purple-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">Email</p>
                          <p className="text-gray-600">{customerDetails.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Phone className="text-purple-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">Phone</p>
                          <p className="text-gray-600">{customerDetails.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="text-purple-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">Delivery Address</p>
                          <p className="text-gray-600">{customerDetails.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default CustomerProfile;
