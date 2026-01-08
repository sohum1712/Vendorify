import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Lock, Mail, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

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
    if (useMobile && identifier.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    if (!useMobile && !identifier.includes('@')) {
      setError('Please enter a valid email address');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Login</h1>
            <p className="text-sm text-gray-600 mt-1">Order from your favorite local vendors</p>
          </div>

          {/* Toggle between mobile/email */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setUseMobile(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                useMobile ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setUseMobile(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !useMobile ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {useMobile ? 'Mobile Number' : 'Email Address'}
              </label>
              <div className="relative">
                {useMobile ? (
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                ) : (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                )}
                <input
                  type={useMobile ? 'tel' : 'email'}
                  placeholder={useMobile ? 'Enter mobile number' : 'Enter email address'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={useMobile ? form.mobile : form.email}
                  onChange={(e) => setForm({ ...form, [useMobile ? 'mobile' : 'email']: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading} className="flex items-center justify-center gap-2">
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup/customer" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center">
            <Link to="/login/vendor" className="text-sm text-indigo-600 hover:underline">
              Are you a vendor? Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLogin;
