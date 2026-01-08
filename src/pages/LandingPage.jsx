import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import { ShoppingBag, Store } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    if (role === ROLES.CUSTOMER) {
      navigate('/login/customer');
    } else if (role === ROLES.VENDOR) {
      navigate('/login/vendor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal to-deep-green flex flex-col items-center justify-center p-6 text-white">
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-3">
        <ShoppingBag size={40} className="text-teal" />
      </div>
      <h1 className="text-5xl font-extrabold mb-2 tracking-tighter font-helvetica uppercase">Vendorify</h1>
      <p className="text-lime text-center mb-12 max-w-xs font-archivo">
        Connecting you to local street vendors. Real-time discovery, simple ordering.
      </p>
      
      <div className="w-full max-w-sm space-y-4">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => handleContinue(ROLES.CUSTOMER)}
          icon={ShoppingBag}
        >
          Continue as Customer
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          className="bg-white/10 hover:bg-white/20"
          onClick={() => handleContinue(ROLES.VENDOR)}
          icon={Store}
        >
          Continue as Vendor
        </Button>
      </div>
      
      <div className="mt-12 text-xs text-indigo-300">
      </div>
    </div>
  );
};

export default LandingPage;
