import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { productService } from '../../services/productService';
import { StatCard } from '../../components/StatCard';
import Loader from '../../components/ui/Loader';

export const AdminDashboard: React.FC = () => {
  const { orders, fetchOrders } = useOrders();
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        await fetchOrders();
        const prods = await productService.getProducts();
        setProductCount(prods.length);
      } catch (err) {
        console.error('Error loading dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <Loader text="جاري تحميل إحصائيات الإشراف..." />;
  }

  // Calculate stats based on orders list
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  
  // Unique customer count based on phone numbers
  const uniquePhones = new Set(orders.map(o => o.phone));
  const totalCustomers = uniquePhones.size || 2; // Fallback default to avoid 0

  // Chart data simulation
  const chartData = [
    { label: 'السبت', value: 85, color: 'from-brand-orange-500 to-orange-400' },
    { label: 'الأحد', value: 60, color: 'from-brand-orange-500 to-orange-400' },
    { label: 'الاثنين', value: 45, color: 'from-slate-300 to-slate-200' },
    { label: 'الثلاثاء', value: 70, color: 'from-brand-green-500 to-teal-400' },
    { label: 'الأربعاء', value: 90, color: 'from-brand-green-500 to-teal-400' },
    { label: 'الخميس', value: 110, color: 'from-brand-orange-500 to-orange-400' },
    { label: 'الجمعة', value: 130, color: 'from-brand-orange-500 to-orange-400' }
  ];

  return (
    <div className="text-right">
      <Helmet>
        <title>لوحة التحكم | الإحصائيات</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">موجز الإحصائيات</h1>
        <p className="text-xs text-slate-400 mt-1">نظرة عامة على مبيعات متجر مشروبات مشبرة</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="إجمالي المبيعات"
          value={`${totalRevenue} ج.م`}
          icon="DollarSign"
          change="+12%"
          changeType="up"
          color="green"
        />
        <StatCard
          title="الطلبات الكلية"
          value={totalOrders}
          icon="ShoppingCart"
          change="+8%"
          changeType="up"
          color="orange"
        />
        <StatCard
          title="العملاء المسجلون"
          value={totalCustomers}
          icon="Users"
          change="+15%"
          changeType="up"
          color="blue"
        />
        <StatCard
          title="المنتجات النشطة"
          value={productCount}
          icon="GlassWater"
          change="مستقر"
          changeType="neutral"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart Mockup */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">معدل الطلب الأسبوعي</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">مقارنة الطلبات على مدار أيام الأسبوع</p>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Calendar className="w-4 h-4" />
              <span>آخر 7 أيام</span>
            </div>
          </div>

          {/* Visual CSS-based column chart */}
          <div className="flex items-end justify-between h-56 pt-6 px-4 relative">
            {/* Grid helper lines */}
            <div className="absolute inset-x-0 top-6 border-t border-slate-50" />
            <div className="absolute inset-x-0 top-[50%] border-t border-slate-50" />
            <div className="absolute inset-x-0 bottom-[10%] border-t border-slate-100" />
            
            {chartData.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 w-8 sm:w-12 z-10 group cursor-pointer">
                {/* Visual tooltip */}
                <div className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-slate-800 text-white text-[9px] font-black rounded-lg absolute -translate-y-8 transition-opacity duration-200 number-font">
                  {day.value} طلب
                </div>
                {/* Bar */}
                <div
                  style={{ height: `${(day.value / 150) * 100}%` }}
                  className={`w-full bg-gradient-to-t ${day.color} rounded-t-xl group-hover:scale-x-105 transition-all duration-300 shadow-sm`}
                />
                <span className="text-[10px] font-bold text-slate-400">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations / Activity */}
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-base mb-6 border-b border-slate-50 pb-4">آخر النشاطات</h3>
          
          <div className="flex flex-col gap-4 text-xs">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-start gap-3 p-3 border border-slate-50 bg-slate-50/20 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-orange-500 flex items-center justify-center font-black">
                  📝
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">طلب جديد {order.id}</span>
                  <span className="text-slate-400 block mt-1">بواسطة {order.customerName} - قيمة {order.totalPrice} ج.م</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-slate-400 py-10 text-center">لا يوجد نشاطات مسجلة بعد.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;
