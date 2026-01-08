import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

const statusBadge = (status) => {
  const base = 'text-xs px-2 py-1 rounded-full';
  if (status === 'NEW') return `${base} bg-blue-100 text-blue-700`;
  if (status === 'ACCEPTED') return `${base} bg-orange-100 text-orange-700`;
  if (status === 'COMPLETED') return `${base} bg-green-100 text-green-700`;
  if (status === 'REJECTED') return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
};

const CustomerOrders = () => {
  const navigate = useNavigate();
  const { getOrdersForCustomer, getVendorById } = useAppData();

  const orders = getOrdersForCustomer();

  const handleShareOnWhatsApp = (order) => {
    const vendor = getVendorById(order.vendorId);
    const vendorName = vendor?.name || 'Vendor';
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');
    const message = `*New Order*\n\n*Vendor:* ${vendorName}\n*Items:*\n${itemsList}\n\n*Total:* ₹${order.total}\n*Address:* ${order.customerAddress}\n\nStatus: ${order.status}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/customer')} className="flex items-center text-sm text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="font-bold text-gray-900">My Orders</div>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-3">
        {!orders.length ? (
          <div className="text-sm text-gray-600">No orders yet.</div>
        ) : (
          orders.map((o) => {
            const vendor = getVendorById(o.vendorId);
            return (
              <Card key={o.id} hoverEffect>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{vendor?.name || 'Vendor'}</div>
                      <div className="text-xs text-gray-500">Order #{o.id.slice(-6)}</div>
                    </div>
                    <span className={statusBadge(o.status)}>
                      {o.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {o.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">₹{o.total}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareOnWhatsApp(o)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <MessageCircle size={14} />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
