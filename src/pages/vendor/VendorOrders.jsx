import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Package, MessageCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';
import Navbar from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

const VendorOrders = () => {
  const navigate = useNavigate();
  const { getOrdersForVendor, updateOrderStatus } = useAppData();

  const vendorId = 1;
  const orders = getOrdersForVendor(vendorId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-[#CDF546] text-gray-900 shadow-[0_0_20px_rgba(205,245,70,0.3)]';
      case 'ACCEPTED': return 'bg-[#1A6950] text-white';
      case 'COMPLETED': return 'bg-gray-100 text-gray-400';
      case 'REJECTED': return 'bg-red-50 text-red-400';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] font-sans selection:bg-[#CDF546]">
      <Navbar role="vendor" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => navigate('/vendor')}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tight">Order Management</h1>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-1">Track and process your sales</p>
          </div>
        </div>

        {!orders.length ? (
          <div className="bg-white rounded-[48px] p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-gray-200" size={40} />
            </div>
            <h3 className="text-2xl font-heading font-black text-gray-900 uppercase">No orders yet</h3>
            <p className="text-gray-400 font-medium mt-2">When customers place orders, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {orders.map((o, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={o.id}
                  className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer Name</p>
                      <h4 className="text-2xl font-black uppercase tracking-tight text-gray-900 group-hover:text-[#1A6950] transition-colors">
                        {o.customerName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-1">
                        <Clock size={12} />
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Order Summary</p>
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                        <span className="font-black text-gray-900 uppercase tracking-tight text-xs">{it.name} <span className="text-[#1A6950]">× {it.qty}</span></span>
                        <span className="font-bold text-gray-900">₹{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                      <span className="text-3xl font-black text-gray-900">₹{o.total}</span>
                    </div>

                    <div className="flex gap-2">
                      {o.status === 'NEW' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus({ orderId: o.id, status: 'ACCEPTED' })}
                            className="bg-[#1A6950] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1A6950]/20 hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <CheckCircle2 size={16} />
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus({ orderId: o.id, status: 'REJECTED' })}
                            className="bg-red-50 text-red-400 p-4 rounded-[20px] hover:bg-red-500 hover:text-white transition-all"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}

                      {o.status === 'ACCEPTED' && (
                        <button
                          onClick={() => updateOrderStatus({ orderId: o.id, status: 'COMPLETED' })}
                          className="bg-[#CDF546] text-gray-900 px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#CDF546]/20 hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <Package size={16} />
                          Complete
                        </button>
                      )}

                      <button className="bg-white border border-gray-100 p-4 rounded-[20px] text-gray-400 hover:text-gray-900 transition-all">
                        <MessageCircle size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VendorOrders;
