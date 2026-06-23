import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Clock, MapPin, Receipt } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import type { Order } from '../../types/types';
import Loader from '../../components/ui/Loader';
import { OrderTimeline } from '../../components/OrderTimeline';

export const Tracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderDetails } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const data = await getOrderDetails(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order for tracking', err);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchOrder();
      setLoading(false);
    };
    init();
  }, [orderId]);

  // Set up polling interval to check order updates (like a real socket/polling layer)
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return <Loader fullPage text="جاري تحميل حالة الطلب..." />;
  }

  if (!order) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
          ❓
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">الطلب غير موجود</h3>
        <p className="text-sm text-slate-500 max-w-xs mb-6">
          لم نتمكن من العثور على أي طلب مسجل بالرقم المكتوب. تأكد من صحة الرابط.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold rounded-2xl shadow-md transition-all">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>{`مشروبات مشبرة | تتبع طلبك ${order.id}`}</title>
        <meta name="description" content={`تتبع حالة طلبك ${order.id} خطوة بخطوة من مشروبات مشبرة.`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header link */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-orange-500 mb-8 font-bold transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Timeline side */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">رقم الطلب</span>
                  <span className="text-lg font-black text-slate-800 number-font">{order.id}</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-400 block">الوقت المتوقع</span>
                  <div className="flex items-center gap-1.5 justify-end text-brand-green-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-black">{order.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Order Stepper */}
              <OrderTimeline status={order.status} />
            </div>
            
            {/* Delivery target detail */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4 text-sm">
              <h4 className="font-extrabold text-slate-800 text-base mb-2">تفاصيل عنوان التوصيل</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">{order.customerName}</span>
                  <span className="text-slate-500 text-xs block mt-1">{order.address}</span>
                  <span className="text-slate-400 text-xs block mt-1 number-font" dir="ltr">{order.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill summary side */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
              <h4 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-orange-500" />
                <span>ملخص الفاتورة</span>
              </h4>

              {/* Ordered Items list */}
              <div className="flex flex-col gap-4 max-h-48 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block leading-tight">{item.product.name}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">الكمية: {item.quantity}</span>
                    </div>
                    <span className="font-black text-slate-800 number-font">{item.customizedPrice * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-50 pt-4 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>المجموع</span>
                  <span className="number-font font-bold text-slate-700">{order.totalPrice - order.deliveryFee} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>التوصيل</span>
                  <span className="number-font font-bold text-slate-700">{order.deliveryFee} ج.م</span>
                </div>
                <div className="border-t border-slate-50 pt-4 flex items-center justify-between font-black text-slate-800 text-sm">
                  <span>الإجمالي</span>
                  <span className="text-base text-brand-orange-500 number-font">{order.totalPrice} ج.م</span>
                </div>
              </div>

              {/* Payment label */}
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600 mt-2">
                <span>طريقة الدفع:</span>
                <span>{order.paymentMethod === 'cod' ? 'كاش عند الاستلام' : 'دفع إلكتروني متأكد'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Tracking;
