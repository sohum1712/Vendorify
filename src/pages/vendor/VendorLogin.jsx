import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Phone, Store, ShieldCheck, Shield, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const VendorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ mobile: '', password: '', aadhaar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mobile || !form.password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ mobile: form.mobile, password: form.password, role: 'vendor' });
      navigate('/vendor');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDF546] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A6950] rounded-full blur-[150px] opacity-10 -translate-x-1/4 translate-y-1/4" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-10 md:p-14 shadow-2xl border border-white/50">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#1A6950] rounded-[28px] flex items-center justify-center shadow-lg -rotate-3 group-hover:rotate-0 transition-all duration-500">
                <Store size={36} className="text-[#CDF546]" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tight mb-2">Vendor Portal</h1>
            <p className="text-gray-400 font-bold text-[12px] uppercase tracking-[0.2em]">Manage your shop & reach customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Mobile Number</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-5 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Password</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-5 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAadhaar(!showAadhaar)}
                className="flex items-center gap-2 text-[11px] font-black text-[#1A6950] uppercase tracking-widest hover:underline ml-4"
              >
                <Shield size={14} />
                {showAadhaar ? 'Hide' : 'Add'} Aadhaar Verification
              </button>
              
              {showAadhaar && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-2"
                >
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 12-digit Aadhaar"
                      maxLength={12}
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-5 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.aadhaar}
                      onChange={(e) => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} className="text-[#CDF546]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              New to Vendorify?{' '}
              <Link to="/signup/vendor" className="text-[#1A6950] hover:underline">Register Shop</Link>
            </p>
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
              <ShoppingBag size={16} className="text-[#1A6950]" />
              <Link to="/login/customer" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1A6950] transition-colors">
                Are you a customer? Login here
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorLogin;
