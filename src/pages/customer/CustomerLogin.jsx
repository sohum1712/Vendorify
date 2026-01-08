import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ mobile: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMobile, setUseMobile] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = useMobile ? form.mobile : form.email;
    if (!identifier || !form.password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ [useMobile ? 'mobile' : 'email']: identifier, password: form.password, role: 'customer' });
      navigate('/customer');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9DC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#CDF546] rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A6950] rounded-full blur-[150px] opacity-10 translate-x-1/4 translate-y-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-10 md:p-14 shadow-2xl border border-white/50">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#CDF546] rounded-[28px] flex items-center justify-center shadow-lg rotate-3 group-hover:rotate-0 transition-all duration-500">
                <ShoppingBag size={36} className="text-gray-900" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-400 font-bold text-[12px] uppercase tracking-[0.2em]">Order from your favorite vendors</p>
          </div>

          {/* Role Toggle Simulation or View Switch */}
          <div className="flex bg-gray-100/50 p-2 rounded-[24px] mb-8">
            <button
              onClick={() => setUseMobile(true)}
              className={`flex-1 py-4 px-6 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${
                useMobile ? 'bg-white text-[#1A6950] shadow-sm' : 'text-gray-400'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setUseMobile(false)}
              className={`flex-1 py-4 px-6 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${
                !useMobile ? 'bg-white text-[#1A6950] shadow-sm' : 'text-gray-400'
              }`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">
                {useMobile ? 'Mobile Number' : 'Email Address'}
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6950] transition-colors">
                  {useMobile ? <Phone size={20} /> : <Mail size={20} />}
                </div>
                <input
                  type={useMobile ? 'tel' : 'email'}
                  placeholder={useMobile ? 'Enter mobile' : 'Enter email'}
                  className="w-full bg-gray-50/50 border-2 border-transparent pl-16 pr-6 py-5 rounded-[24px] text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-[#CDF546] focus:ring-0 transition-all outline-none"
                  value={useMobile ? form.mobile : form.email}
                  onChange={(e) => setForm({ ...form, [useMobile ? 'mobile' : 'email']: e.target.value })}
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
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A6950] hover:bg-[#145a44] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#1A6950]/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (
                <>
                  Sign In
                  <ArrowRight size={20} className="text-[#CDF546]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Don't have an account?{' '}
              <Link to="/signup/customer" className="text-[#1A6950] hover:underline">Sign up</Link>
            </p>
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-[#CDF546]" />
              <Link to="/login/vendor" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1A6950] transition-colors">
                Are you a vendor? Login here
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin;
