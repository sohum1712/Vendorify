import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Star, ArrowRight, Home, Layers, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';
import Navbar from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import InteractiveVendorMap from '../../components/map/InteractiveVendorMap';

const MapPage = () => {
  const navigate = useNavigate();
  const { 
    vendors, 
    userLocation, 
    locationDetails, 
    loading, 
    fetchVendors,
    vendorLocations 
  } = useAppData();
  
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [radiusKm] = useState(5);

  const handleVendorSelect = (vendor) => {
    setSelectedVendorId(vendor._id);
    navigate(`/customer/vendor/${vendor._id}`);
  };

  // Filter vendors that have location data
  const mapVendors = (vendors || []).filter(vendor => 
    vendor.location && vendor.location.coordinates
  );

  const getLocationText = () => {
    if (locationDetails?.place && locationDetails?.district) {
      return `${locationDetails.place}, ${locationDetails.district}`;
    }
    if (userLocation?.displayName) {
      return userLocation.displayName;
    }
    if (userLocation?.lat && userLocation?.lng) {
      return `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
    }
    return 'Location not available';
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] font-sans selection:bg-[#CDF546]">
      <Navbar role="customer" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/customer')}
              className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tight">Interactive Map</h1>
              <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-1">
                {userLocation ? `${mapVendors.length} vendors within ${radiusKm}km` : 'Enable location to see nearby vendors'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl px-4 py-2 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-600">{getLocationText()}</span>
              </div>
            </div>
            
            <button
              onClick={fetchVendors}
              className="w-12 h-12 rounded-2xl bg-[#1A6950] text-white flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-8">
            <div className="relative bg-white rounded-[56px] p-4 border border-gray-100 shadow-2xl overflow-hidden">
              {userLocation ? (
                <InteractiveVendorMap
                  height="h-[600px]"
                  radiusKm={radiusKm}
                  onVendorSelect={handleVendorSelect}
                  selectedVendorId={selectedVendorId}
                  showControls={true}
                  className="w-full rounded-[40px] overflow-hidden"
                />
              ) : (
                <div className="h-[600px] rounded-[40px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">Location Required</h3>
                    <p className="text-gray-500">Please enable location access to view the interactive map</p>
                  </div>
                </div>
              )}

              {/* Custom Controls Overlay */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/customer')}
                  className="w-12 h-12 bg-[#1A6950] rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Home size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Nearby List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 rounded-[56px] p-10 text-white relative overflow-hidden shadow-2xl h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDF546] rounded-full blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2" />

              <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="text-2xl font-heading font-black uppercase tracking-tight">Nearby Vendors</h3>
                <span className="bg-[#CDF546] text-gray-900 px-3 py-1 rounded-full text-[10px] font-black">
                  {mapVendors.filter(v => v.isOnline).length} Live
                </span>
              </div>

              <div className="space-y-4 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-[#CDF546] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white/60 text-sm">Loading vendors...</p>
                  </div>
                ) : mapVendors.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin size={40} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No vendors found nearby</p>
                    <p className="text-white/40 text-xs mt-2">Try expanding your search radius</p>
                  </div>
                ) : (
                  mapVendors.map((vendor) => (
                    <motion.div
                      key={vendor._id}
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/customer/vendor/${vendor._id}`)}
                      className="group bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-[#CDF546]/50 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 relative">
                            <img 
                              src={vendor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.shopName)}&background=random&size=100`} 
                              className="w-full h-full object-cover" 
                              alt={vendor.shopName} 
                            />
                            {vendor.isOnline && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-black uppercase tracking-tight text-sm group-hover:text-[#CDF546] transition-colors">
                              {vendor.shopName}
                            </h4>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              {vendor.category || 'Food'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-black">{vendor.rating || '4.5'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[#CDF546]">
                          <MapPin size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {vendor.distance ? `${vendor.distance}km` : 'Nearby'}
                          </span>
                        </div>
                        <ArrowRight size={16} className="text-white/20 group-hover:text-[#CDF546] transition-all" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MapPage;
