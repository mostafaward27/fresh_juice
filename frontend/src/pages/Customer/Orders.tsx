import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ClipboardList, Clock, Eye } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import type { Order } from '../../types/types';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';

export const Orders: React.FC = () => {
  const { fetchCustomerOrders } = useOrders();
  const { user } = useAuth();
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.phone) return;
      setLoading(true);
      try {
        const data = await fetchCustomerOrders(user.phone);
        setCustomerOrders(data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (loading) {
    return <Loader fullPage text="تحميل طلباتك السابقة..." />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received': return <Badge variant="info">مستلم</Badge>;
      case 'preparing': return <Badge variant="warning">جاري التجهيز</Badge>;
      case 'delivering': return <Badge variant="primary">قيد التوصيل</Badge>;
      case 'completed': return <Badge variant="success">تم التسليم</Badge>;
      default: return <Badge variant="slate">معلق</Badge>;
    }
  };

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>مشروبات مشبرة | طلباتي السابقة</title>
        <meta name="description" content="راجع طلباتك السابقة وتتبع حالة طلباتك الجارية من مشروبات مشبرة." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-10 flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-brand-orange-500" />
          <span>طلباتي السابقة</span>
        </h1>

        {customerOrders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Info Block */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-800 text-base number-font">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="number-font">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </span>
                    <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} مشروبات</span>
                  </div>
                  {/* Short summary of items */}
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-sm">
                    {order.items.map(item => `${item.product.name} (x${item.quantity})`).join('، ')}
                  </p>
                </div>

                {/* Price and Tracking link */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 block">الإجمالي الكلي</span>
                    <span className="text-lg font-black text-brand-orange-500 number-font">{order.totalPrice} ج.م</span>
                  </div>

                  <Link to={`/tracking/${order.id}`}>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-brand-orange-50 text-slate-700 hover:text-brand-orange-500 border border-slate-100 hover:border-brand-orange-500/10 rounded-2xl transition-all text-sm font-bold">
                      <Eye className="w-4 h-4" />
                      <span>تتبع الطلب</span>
                    </button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-sm p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4">
              📋
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">لا يوجد طلبات سابقة</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
              سجل طلبك الأول الآن للاستمتاع بأسرع خدمة توصيل للعصائر والمشروبات الباردة.
            </p>
            <Link to="/menu" className="px-5 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold rounded-xl shadow-sm text-sm transition-all">
              اطلب الآن
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
export default Orders;
