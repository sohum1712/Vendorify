import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Circle, Triangle, Square } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';

const VendorDetails = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { getVendorById, addToCart, cartSummary, cart, clearCart } = useAppData();

  const vendor = getVendorById(vendorId);

  const iconMap = {
    Circle,
    Triangle,
    Square,
  };

  const hasDifferentVendorInCart = useMemo(() => {
    if (!cart.length) return false;
    return String(cart[0].vendorId) !== String(vendorId);
  }, [cart, vendorId]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto p-4">
        <Button variant="ghost" onClick={() => navigate('/customer')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-6 text-sm text-gray-600">Vendor not found.</div>
      </div>
    );
  }

  const handleAdd = (item) => {
    if (!vendor.verified) {
      return;
    }
    if (hasDifferentVendorInCart) {
      const ok = window.confirm('Your cart has items from another vendor. Clear cart and add this item?');
      if (!ok) return;
      clearCart();
    }
    addToCart({ vendorId: vendor.id, item });
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop pb-24">
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/customer')} className="flex items-center text-sm text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
          <button onClick={() => navigate('/customer/cart')} className="relative">
            <ShoppingCart className="text-deep-green" size={20} />
            {cartSummary.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal text-white text-[10px] rounded-full px-1.5 py-0.5">
                {cartSummary.itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-helvetica uppercase tracking-tighter">{vendor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-deep-green/70">{vendor.address}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${vendor.verified ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-700'}`}>
                  {vendor.verified ? 'Verified' : 'Not Verified'}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-lime/20 text-deep-green">{vendor.status || 'Open'}</span>
              </div>
            </CardContent>
          </Card>

          {!vendor.verified && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
              This vendor is currently <span className="font-semibold">not verified</span>. You can view the menu, but ordering is disabled.
            </div>
          )}

          <div>
            <h2 className="font-bold text-deep-green mb-3 uppercase tracking-wider text-sm font-archivo">Menu</h2>
            <div className="space-y-3">
              {(vendor.menu || []).map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <Card key={item.id} hoverEffect>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <div className="w-10 h-10 rounded-xl bg-lime/30 flex items-center justify-center text-teal">
                            <IconComponent size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-deep-green">{item.name}</div>
                          <div className="text-sm text-teal font-medium">₹{item.price}</div>
                        </div>
                      </div>
                      <Button size="sm" disabled={!vendor.verified} onClick={() => handleAdd(item)}>
                        Add
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {cartSummary.itemCount > 0 && String(cartSummary.vendorId) === String(vendor.id) && (
          <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop bg-white border-t border-teal/10 p-4">
            <Button fullWidth size="lg" onClick={() => navigate('/customer/cart')}>
              Go to Cart • ₹{cartSummary.total}
            </Button>
          </div>
        )}
    </div>
  );
};

export default VendorDetails;
