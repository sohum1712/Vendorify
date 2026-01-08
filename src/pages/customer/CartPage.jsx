import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartSummary, updateCartQty, placeOrder, getVendorById } = useAppData();
  const [placing, setPlacing] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const vendor = useMemo(() => {
    if (!cartSummary.vendorId) return null;
    return getVendorById(cartSummary.vendorId);
  }, [cartSummary.vendorId, getVendorById]);

  const canPlaceOrder = !vendor || vendor.verified;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const order = placeOrder({ customerName: 'Customer', address: 'MG Road, Bengaluru' });
      if (order) {
        setLastOrder(order);
      }
    } finally {
      setPlacing(false);
    }
  };

  const handleShareOnWhatsApp = (order) => {
    const vendorName = vendor?.name || 'Vendor';
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');
    const message = `*New Order*\n\n*Vendor:* ${vendorName}\n*Items:*\n${itemsList}\n\n*Total:* ₹${order.total}\n*Address:* ${order.customerAddress}\n\nStatus: ${order.status}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop pb-24">
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/customer')} className="flex items-center text-sm text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="font-bold text-gray-900">Cart</div>
        <div className="w-10" />
      </div>

      {lastOrder ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <div className="text-xl font-bold text-gray-900">Order Placed!</div>
            <div className="text-sm text-gray-600">
              Your order has been sent to {vendor?.name || 'the vendor'}.
            </div>
            <div className="space-y-2 pt-2">
              <Button
                fullWidth
                onClick={() => handleShareOnWhatsApp(lastOrder)}
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Share on WhatsApp
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/customer/orders')}
              >
                View My Orders
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            {vendor && (
              <div className="text-sm text-gray-700">
                Ordering from: <span className="font-semibold">{vendor.name}</span>
              </div>
            )}

            {vendor && !vendor.verified && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
                This vendor is currently <span className="font-semibold">not verified</span>. You cannot place an order.
              </div>
            )}

            {!cart.length ? (
              <div className="text-sm text-gray-600">Your cart is empty.</div>
            ) : (
              <div className="space-y-3">
                {cart.map((ci) => (
                  <Card key={`${ci.vendorId}-${ci.item.id}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{ci.item.name}</div>
                        <div className="text-sm text-gray-600">₹{ci.item.price} × {ci.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty({ vendorId: ci.vendorId, itemId: ci.item.id, qty: ci.qty - 1 })}
                          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-8 text-center font-medium">{ci.qty}</div>
                        <button
                          onClick={() => updateCartQty({ vendorId: ci.vendorId, itemId: ci.item.id, qty: ci.qty + 1 })}
                          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop bg-white border-t border-gray-100 p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Total</span>
                <span className="font-bold text-gray-900">₹{cartSummary.total}</span>
              </div>
              <Button fullWidth size="lg" disabled={placing || !canPlaceOrder} onClick={handlePlaceOrder}>
                {placing ? 'Placing...' : 'Place Order'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
