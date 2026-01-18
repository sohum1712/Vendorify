import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Phone, User, ShieldCheck, Store, MapPin, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const VendorSignup = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ 
    name: '', 
    shopName: '',
    mobile: '', 
    address: '',
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.shopName) {
        setError('Please fill all fields');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.mobile || !form.address || !form.password) {
      setError('Please fill all required fields');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userData = {
        name: form.name,
        shopName: form.shopName,
        mobile: form.mobile,
        address: form.address,
        password: form.password,
        role: 'vendor'
      };
      
      const result = await register(userData);
      if (!result.success) {
        if (result.message && result.message.includes('Problem with these credentials only')) {
          setError('Problem with these credentials only');
        } else {
          setError(result.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDF546] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A6950] rounded-full blur-[150px] opacity-10 -translate-x-1/4 translate-y-1/4" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-10 md:p-14 shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#1A6950] rounded-[28px] flex items-center justify-center shadow-lg -rotate-3 group-hover:rotate-0 transition-all duration-500 p-4">
                <img
                  src="/logo.svg"
                  alt="Vendorify Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight mb-2">Register Shop</h1>
            <p className="text-gray-400 font-bold text-[12px] uppercase tracking-[0.2em]">Start selling on Vendorify</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${step >= 1 ? 'bg-[#1A6950] text-white' : 'bg-gray-200 text-gray-400'}`}>
              1
            </div>
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-[#1A6950]' : 'bg-gray-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${step >= 2 ? 'bg-[#1A6950] text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Your Name</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Shop Name</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <Store size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter shop name"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.shopName}
                      onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Continue
                  <ArrowRight size={20} className="text-[#CDF546]" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Shop Address</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter shop address"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                      placeholder="Create password"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-4 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm active:scale-95 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gray-900 hover:bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : (
                      <>
                        Register
                        <ArrowRight size={20} className="text-[#CDF546]" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Already registered?{' '}
              <Link to="/login/vendor" className="text-[#1A6950] hover:underline">Sign in</Link>
            </p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <ShoppingBag size={16} className="text-[#1A6950]" />
              <Link to="/signup/customer" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1A6950] transition-colors">
                Want to buy? Register as customer
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSignup;
