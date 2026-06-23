import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Search, Eye } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import type { Order, OrderStatus } from '../../types/types';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';

export const OrdersManagement: React.FC = () => {
  const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrders();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`تم تحديث حالة الطلب ${orderId} بنجاح!`, 'success');
    } catch (err) {
      showToast('فشل تحديث حالة الطلب', 'error');
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Filter orders based on query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query)
    );
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 'bg-sky-50 text-sky-600 border border-sky-100';
      case 'preparing': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'delivering': return 'bg-brand-orange-50 text-brand-orange-600 border border-brand-orange-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  return (
    <div className="text-right">
      <Helmet>
        <title>لوحة التحكم | إدارة الطلبات</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-brand-orange-500" />
            <span>إدارة الطلبات الجارية</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">تتبع حالات الطلبات وتحديثها للزبائن في الوقت الفعلي</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute right-4 top-3.5 text-slate-400 pointer-events-none w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right shadow-sm"
        />
      </div>

      {isLoading ? (
        <Loader text="جاري تحميل قائمة الطلبات..." />
      ) : (
        /* Orders list table */
        <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                  <th className="p-5">رقم الطلب</th>
                  <th className="p-5">العميل</th>
                  <th className="p-5">الهاتف</th>
                  <th className="p-5">عدد المشروبات</th>
                  <th className="p-5">القيمة الكلية</th>
                  <th className="p-5 text-center">الحالة الجارية</th>
                  <th className="p-5 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-slate-800 number-font">{order.id}</td>
                    <td className="p-5">{order.customerName}</td>
                    <td className="p-5 number-font" dir="ltr">{order.phone}</td>
                    <td className="p-5">{order.items.reduce((acc, i) => acc + i.quantity, 0)} أكواب</td>
                    <td className="p-5 font-bold text-slate-800 number-font">{order.totalPrice} ج.م</td>
                    <td className="p-5">
                      <div className="flex items-center justify-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold text-center border focus:outline-none ${getStatusColor(order.status)}`}
                        >
                          <option value="received">تم الاستلام</option>
                          <option value="preparing">جاري التجهيز</option>
                          <option value="delivering">جاري التوصيل</option>
                          <option value="completed">تم التسليم</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 text-slate-400 hover:text-brand-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      لا يوجد طلبات تطابق معايير البحث.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedOrder ? `تفاصيل الفاتورة: ${selectedOrder.id}` : ''}
        size="md"
      >
        {selectedOrder && (
          <div className="flex flex-col gap-6 text-right">
            
            {/* Customer specs */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs flex flex-col gap-2">
              <div>
                <span className="text-slate-400 font-bold">اسم العميل: </span>
                <span className="font-bold text-slate-700">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold">رقم الهاتف: </span>
                <span className="font-bold text-slate-700 number-font" dir="ltr">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold">العنوان: </span>
                <span className="font-bold text-slate-700 leading-normal">{selectedOrder.address}</span>
              </div>
            </div>

            {/* Items list */}
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm mb-3">المشروبات المطلوبة</h4>
              <div className="flex flex-col gap-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.product.name} (x{item.quantity})</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        الحجم: {item.selectedSize === 'small' ? 'صغير' : item.selectedSize === 'medium' ? 'وسط' : 'كبير'} 
                        {' | '} السكر: {item.selectedSugar}% {' | '} الثلج: {item.selectedIce === 'none' ? 'بدون' : item.selectedIce === 'normal' ? 'عادي' : 'إضافي'}
                      </span>
                    </div>
                    <span className="font-bold text-slate-700 number-font">{item.customizedPrice * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary calculation */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs">
              <div className="flex justify-between font-bold text-slate-500">
                <span>المجموع الفرعي:</span>
                <span className="number-font">{selectedOrder.totalPrice - selectedOrder.deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between font-bold text-slate-500">
                <span>رسوم التوصيل:</span>
                <span className="number-font">{selectedOrder.deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between font-black text-brand-orange-500 text-sm mt-1">
                <span>الإجمالي الكلي:</span>
                <span className="number-font">{selectedOrder.totalPrice} ج.م</span>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
export default OrdersManagement;
