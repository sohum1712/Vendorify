import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { 
  ArrowLeft, 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  Clock, 
  TrendingUp,
  Edit,
  Camera,
  Shield,
  Package,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import ScrollToTop from '../../components/common/ScrollToTop';

const VendorProfile = () => {
  const navigate = useNavigate();
  const { getVendorById, getOrdersForVendor } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const vendorId = 1; // Static for demo
  const vendor = getVendorById(vendorId);
  const orders = getOrdersForVendor(vendorId);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.total, 0);

  // Mock vendor data (in real app, this would come from context)
  const vendorDetails = {
    ...vendor,
    email: 'raju@vendorify.com',
    phone: '+91 98765 43210',
    description: 'Serving authentic street food since 2015. Specializing in Pani Puri, Chaat, and traditional Indian snacks.',
    businessHours: '10:00 AM - 10:00 PM',
    established: '2015',
    specialties: ['Pani Puri', 'Dahi Puri', 'Masala Puri', 'Samosa'],
    certifications: ['FSSAI Certified', 'Hygiene Verified'],
    totalOrders: orders.length,
    averageRating: 4.6,
    totalReviews: 127,
    location: vendor?.address || 'MG Road, Bengaluru' // Use address instead of lat/lng object
  };

  const stats = [
    { 
      icon: Package, 
      label: 'Total Orders', 
      value: vendorDetails.totalOrders, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      icon: TrendingUp, 
      label: 'Total Earnings', 
      value: `₹${totalEarnings}`, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      icon: Star, 
      label: 'Average Rating', 
      value: vendorDetails.averageRating.toFixed(1), 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      icon: MessageCircle, 
      label: 'Reviews', 
      value: vendorDetails.totalReviews, 
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

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vendor not found</p>
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/vendor/dashboard')}
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
                  <Shield size={16} />
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
                <Store size={48} className="text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-lg">
                <Camera size={16} />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{vendorDetails.name}</h1>
              <p className="text-white/80 mb-4">{vendorDetails.description}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{vendorDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{vendorDetails.businessHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>Since {vendorDetails.established}</span>
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
          {['overview', 'contact', 'business', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
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
                  <h3 className="font-bold text-gray-800 mb-4">About Business</h3>
                  <p className="text-gray-600 mb-4">{vendorDetails.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendorDetails.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendorDetails.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            <Shield size={14} />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">{vendorDetails.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">98%</p>
                      <p className="text-sm text-gray-600">On-Time Delivery</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{vendorDetails.averageRating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{vendorDetails.totalReviews}</p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-indigo-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{vendorDetails.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-indigo-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600">{vendorDetails.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="text-indigo-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">{vendorDetails.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Business Details</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800">Business Name</p>
                      <p className="text-gray-600">{vendorDetails.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Established</p>
                      <p className="text-gray-600">{vendorDetails.established}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Business Hours</p>
                      <p className="text-gray-600">{vendorDetails.businessHours}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Category</p>
                      <p className="text-gray-600 capitalize">{vendorDetails.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Description</p>
                    <p className="text-gray-600">{vendorDetails.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[
                    { name: 'Rahul Kumar', rating: 5, comment: 'Excellent Pani Puri! Fresh and tasty.', date: '2 days ago' },
                    { name: 'Priya Sharma', rating: 4, comment: 'Good quality and quick service.', date: '1 week ago' },
                    { name: 'Amit Patel', rating: 5, comment: 'Best street food in the area!', date: '2 weeks ago' }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{review.name}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
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

export default VendorProfile;
