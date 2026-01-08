import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Lock, Shield, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

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
    if (showAadhaar && (!form.aadhaar || form.aadhaar.length < 12)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ 
        mobile: form.mobile, 
        password: form.password, 
        role: 'vendor',
        aadhaar: showAadhaar ? form.aadhaar : undefined
      });
      navigate('/vendor');
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
              <Store size={28} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Login</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your shop and orders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
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

            {/* Aadhaar Verification Section */}
            <div>
              <button
                type="button"
                onClick={() => setShowAadhaar(!showAadhaar)}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-2"
              >
                <Shield size={16} />
                {showAadhaar ? 'Hide' : 'Show'} Aadhaar Verification
              </button>
              
              {showAadhaar && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhaar Number (Optional)</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength={12}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      value={form.aadhaar}
                      onChange={(e) => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, '') })}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Additional verification for enhanced security</p>
                </div>
              )}
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
            New vendor?{' '}
            <Link to="/signup/vendor" className="text-indigo-600 font-medium hover:underline">
              Sign up here
            </Link>
          </div>

          <div className="text-center">
            <Link to="/login/customer" className="text-sm text-indigo-600 hover:underline">
              Are you a customer? Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorLogin;
