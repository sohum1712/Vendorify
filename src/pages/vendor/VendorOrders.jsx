import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

const statusBadgeClass = (status) => {
  const base = 'text-xs px-2 py-1 rounded-full';
  if (status === 'NEW') return `${base} bg-blue-100 text-blue-700`;
  if (status === 'ACCEPTED') return `${base} bg-orange-100 text-orange-700`;
  if (status === 'COMPLETED') return `${base} bg-green-100 text-green-700`;
  if (status === 'REJECTED') return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
};

const VendorOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersForVendor, updateOrderStatus } = useAppData();

  const vendorId = useMemo(() => {
    if (user && user.role === 'vendor' && user.vendorId) return user.vendorId;
    return 1;
  }, [user]);

  const orders = getOrdersForVendor(vendorId);

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop pb-20">
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/vendor')} className="flex items-center text-sm text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="font-bold text-gray-900">Orders</div>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-3">
        {!orders.length ? (
          <div className="text-sm text-gray-600">No orders yet.</div>
        ) : (
          orders.map((o) => (
            <Card key={o.id} hoverEffect>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{o.customerName}</div>
                    <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={statusBadgeClass(o.status)}>{o.status}</span>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.name} × {it.qty}</span>
                      <span>₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-gray-900">₹{o.total}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  {o.status === 'NEW' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus({ orderId: o.id, status: 'ACCEPTED' })}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus({ orderId: o.id, status: 'REJECTED' })}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}

                  {o.status === 'ACCEPTED' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus({ orderId: o.id, status: 'COMPLETED' })}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus({ orderId: o.id, status: 'REJECTED' })}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
