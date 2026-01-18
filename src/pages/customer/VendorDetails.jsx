import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Circle, Triangle, Square, Star, MapPin, ShieldCheck, Heart, Clock, ArrowRight, Utensils, Coffee, ShoppingBag, Carrot, MessageCircle, Share2, Navigation, ChevronRight, Send, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';
import Navbar from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

const VendorDetails = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { 
    getVendorById, 
    addToCart, 
    cartSummary, 
    cart, 
    clearCart,
    generateWhatsAppOrderLink,
    generateWhatsAppShareLink,
    addReview,
    getVendorReviews
  } = useAppData();

  const vendor = getVendorById(vendorId);
  const [activeTab, setActiveTab] = useState('menu');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

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

  const reviews = getVendorReviews(vendorId);

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

  const handleWhatsAppOrder = () => {
    if (cart.length === 0 || String(cartSummary.vendorId) !== String(vendor.id)) return;
    const link = generateWhatsAppOrderLink(vendor.phone, cart, cartSummary.total, vendor.name);
    window.open(link, '_blank');
  };

  const handleShareVendor = () => {
    const link = generateWhatsAppShareLink(vendor);
    window.open(link, '_blank');
  };

  const handleSubmitReview = () => {
    if (!customerName.trim() || !reviewText.trim()) return;
    addReview({
      vendorId: vendor.id,
      customerName: customerName.trim(),
      rating: reviewRating,
      text: reviewText.trim()
    });
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewText('');
    setCustomerName('');
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] font-sans selection:bg-[#CDF546]">
      <Navbar role="customer" />
      
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
              <button 
                onClick={handleShareVendor}
                className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-green-500 hover:border-green-500 transition-all"
                title="Share on WhatsApp"
              >
                <Share2 size={24} />
              </button>
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
                <div className="flex items-center gap-3 flex-wrap">
                  {vendor.verified && (
                    <div className="bg-[#CDF546] text-gray-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Verified Vendor
                    </div>
                  )}
                  <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {vendor.rating} ({vendor.totalReviews} reviews)
                  </div>
                  {vendor.schedule?.isRoaming && (
                    <div className="bg-blue-500/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Navigation size={14} />
                      Roaming Vendor
                    </div>
                  )}
                </div>
                <h1 className="text-6xl md:text-8xl font-heading font-black text-gray-900 uppercase tracking-tighter leading-[0.8]">
                  {vendor.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 font-bold text-[12px] uppercase tracking-[0.3em]">
                  <MapPin size={16} className="text-[#1A6950]" />
                  {vendor.schedule?.currentStop || vendor.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {vendor.schedule?.isRoaming && vendor.schedule?.nextStops?.length > 0 && (
          <div className="mb-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[32px] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Navigation size={20} />
              <h3 className="font-black uppercase tracking-widest text-sm">Live Schedule - Next Stops</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {vendor.schedule.nextStops.map((stop, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3">
                  <Clock size={16} />
                  <span className="font-bold text-sm">{stop.time}</span>
                  <ChevronRight size={16} />
                  <span className="font-black">{stop.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!vendor.verified && (
          <div className="mb-10 bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center gap-6">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h4 className="text-xl font-heading font-black text-gray-900 uppercase">Verification Pending</h4>
              <p className="text-gray-500 font-medium">This vendor is currently being verified. You can browse the menu but orders are disabled.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {['menu', 'reviews', 'gallery'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#1A6950] text-white shadow-xl shadow-[#1A6950]/20'
                  : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : tab === 'gallery' ? `Gallery (${vendor.gallery?.length || 0})` : tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {activeTab === 'menu' && (
              <>
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
              </>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight">Customer Reviews</h2>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[#CDF546] text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Star size={16} />
                    Write Review
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-12 text-center border border-gray-100">
                    <Star size={48} className="mx-auto mb-4 text-gray-200" />
                    <h3 className="text-xl font-black text-gray-900 uppercase mb-2">No Reviews Yet</h3>
                    <p className="text-gray-400">Be the first to review this vendor!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[32px] p-6 border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-black text-gray-900">{review.customerName}</h4>
                            <p className="text-xs text-gray-400">{review.date}</p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={16}
                                className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight mb-8">Shop Gallery</h2>
                
                {(!vendor.gallery || vendor.gallery.length === 0) ? (
                  <div className="bg-white rounded-[40px] p-12 text-center border border-gray-100">
                    <Image size={48} className="mx-auto mb-4 text-gray-200" />
                    <h3 className="text-xl font-black text-gray-900 uppercase mb-2">No Photos Yet</h3>
                    <p className="text-gray-400">This vendor hasn't added any photos yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.gallery.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setSelectedImage(idx); setShowGallery(true); }}
                        className="aspect-square rounded-[24px] overflow-hidden cursor-pointer"
                      >
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Operating Hours</p>
                      <p className="font-black uppercase tracking-tight">{vendor.schedule?.operatingHours || '10 AM - 9 PM'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="text-[#CDF546]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Location</p>
                      <p className="font-black uppercase tracking-tight">{vendor.schedule?.currentStop || vendor.address}</p>
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

                <button
                  onClick={handleShareVendor}
                  className="mt-8 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
                >
                  <Share2 size={18} />
                  Share on WhatsApp
                </button>
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
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleWhatsAppOrder}
                      className="w-full bg-green-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-700 transition-all text-sm"
                    >
                      <MessageCircle size={20} />
                      Order via WhatsApp
                    </button>
                    <button 
                      onClick={() => navigate('/customer/cart')}
                      className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all text-sm"
                    >
                      Checkout
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Write a Review</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-900">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#CDF546] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-2 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={32}
                          className={star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#CDF546] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!customerName.trim() || !reviewText.trim()}
                  className="w-full bg-[#1A6950] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGallery && vendor.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGallery(false)}
          >
            <button 
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 text-white hover:text-[#CDF546]"
            >
              <X size={32} />
            </button>
            <img 
              src={vendor.gallery[selectedImage]} 
              alt="Gallery" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {vendor.gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                  className={`w-3 h-3 rounded-full transition-all ${idx === selectedImage ? 'bg-[#CDF546] w-8' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default VendorDetails;
