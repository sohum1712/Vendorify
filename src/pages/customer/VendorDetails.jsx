import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Circle, Triangle, Square, Star, MapPin, ShieldCheck, Heart, Clock, ArrowRight, Utensils, Coffee, ShoppingBag, Carrot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';
import Navbar from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

const VendorDetails = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { getVendorById, addToCart, cartSummary, cart, clearCart } = useAppData();

  const vendor = getVendorById(vendorId);

  const iconMap = {
    Circle,
    Triangle,
    Square,
    Store: ShoppingBag,
    Utensils,
    Carrot,
    Coffee,
    ShoppingBag,
  };

  const hasDifferentVendorInCart = useMemo(() => {
    if (!cart.length) return false;
    return String(cart[0].vendorId) !== String(vendorId);
  }, [cart, vendorId]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#FDF9DC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="text-gray-300" size={40} />
        </div>
        <h3 className="text-2xl font-heading font-black text-gray-900 uppercase">Vendor not found</h3>
        <button 
          onClick={() => navigate('/customer')}
          className="mt-6 bg-[#1A6950] text-white px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAdd = (item) => {
    if (!vendor.verified) return;
    if (hasDifferentVendorInCart) {
      const ok = window.confirm('Your cart has items from another vendor. Clear cart and add this item?');
      if (!ok) return;
      clearCart();
    }
    addToCart({ vendorId: vendor.id, item });
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] font-sans selection:bg-[#CDF546]">
      <Navbar role="customer" />
      
      {/* Immersive Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={vendor.image} 
          className="w-full h-full object-cover"
          alt={vendor.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF9DC] via-black/40 to-transparent" />
        
        <div className="absolute top-32 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <button 
              onClick={() => navigate('/customer')}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-[#CDF546] hover:text-gray-900 transition-all">
                <Heart size={24} />
              </button>
              <button 
                onClick={() => navigate('/customer/cart')}
                className="relative w-14 h-14 rounded-2xl bg-[#CDF546] flex items-center justify-center text-gray-900 shadow-xl shadow-[#CDF546]/20"
              >
                <ShoppingCart size={24} />
                {cartSummary.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1A6950] text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    {cartSummary.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#CDF546] text-gray-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Verified Vendor
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {vendor.rating} Rating
                  </div>
                </div>
                <h1 className="text-6xl md:text-8xl font-heading font-black text-gray-900 uppercase tracking-tighter leading-[0.8]">
                  {vendor.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 font-bold text-[12px] uppercase tracking-[0.3em]">
                  <MapPin size={16} className="text-[#1A6950]" />
                  {vendor.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {!vendor.verified && (
          <div className="mb-12 bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center gap-6">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h4 className="text-xl font-heading font-black text-gray-900 uppercase">Verification Pending</h4>
              <p className="text-gray-500 font-medium">This vendor is currently being verified. You can browse the menu but orders are disabled.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight">Full Menu</h2>
              <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Available Now</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {(vendor.menu || []).map((item, idx) => {
                  const IconComponent = iconMap[item.icon] || Utensils;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id}
                      className="group bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#CDF546] transition-all duration-500">
                          <IconComponent size={28} className="text-[#1A6950]" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6">{item.name}</h4>
                        <button
                          disabled={!vendor.verified}
                          onClick={() => handleAdd(item)}
                          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                            vendor.verified 
                              ? 'bg-[#1A6950] text-white hover:bg-black shadow-lg shadow-[#1A6950]/10' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {vendor.verified ? 'Add to Plate' : 'Unavailable'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-gray-900 rounded-[56px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDF546] rounded-full blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-2xl font-heading font-black uppercase mb-8 relative z-10">Quick Info</h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Clock className="text-[#CDF546]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Delivery Time</p>
                      <p className="font-black uppercase tracking-tight">15-20 Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="text-[#CDF546]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Min Order</p>
                      <p className="font-black uppercase tracking-tight">₹50</p>
                    </div>
                  </div>
                </div>
              </div>

              {cartSummary.itemCount > 0 && String(cartSummary.vendorId) === String(vendor.id) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#CDF546] rounded-[48px] p-10 text-gray-900 shadow-2xl shadow-[#CDF546]/20"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-heading font-black uppercase tracking-tight">Current Cart</h3>
                    <span className="bg-white/50 px-3 py-1 rounded-full text-[10px] font-black">{cartSummary.itemCount} Items</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Subtotal</span>
                    <span className="text-4xl font-black">₹{cartSummary.total}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/customer/cart')}
                    className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all"
                  >
                    Checkout Now
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorDetails;
