import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';

export const Cart: React.FC = () => {
  const { cart, subtotal, deliveryFee, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const getSugarLabel = (value: number) => {
    switch (value) {
      case 0: return 'بدون سكر';
      case 25: return 'سكر خفيف (25%)';
      case 50: return 'سكر وسط (50%)';
      case 100: return 'سكر كامل (100%)';
      default: return 'سكر وسط';
    }
  };

  const getIceLabel = (value: string) => {
    switch (value) {
      case 'none': return 'بدون ثلج';
      case 'normal': return 'ثلج عادي';
      case 'extra': return 'ثلج إضافي';
      default: return 'ثلج عادي';
    }
  };

  const getSizeLabel = (value: string) => {
    switch (value) {
      case 'small': return 'صغير';
      case 'medium': return 'وسط';
      case 'large': return 'كبير';
      default: return 'وسط';
    }
  };

  return (
    <div className="py-10 bg-slate-50/50 dark:bg-slate-950 flex-grow text-right transition-colors duration-300">
      <Helmet>
        <title>مشروبات مشبرة | سلة المشتريات</title>
        <meta name="description" content="راجع مشروباتك المضافة في سلة المشتريات، عدل الكميات، واستكمل الدفع." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-brand-orange-500" />
            <span>سلة المشتريات</span>
          </h1>
          <Link to="/menu" className="text-sm font-bold text-brand-orange-500 hover:text-brand-orange-600 transition-colors flex items-center gap-2">
            <span>مواصلة التسوق</span>
            <ArrowLeft className="w-4 h-4 transform rotate-180" />
          </Link>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-sm gap-4"
                >
                  {/* Left part: Image & customized info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm md:text-base leading-snug">
                        {item.product.name}
                      </h3>
                      {/* Configuration Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          الحجم: {getSizeLabel(item.selectedSize)}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          السكر: {getSugarLabel(item.selectedSugar)}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          الثلج: {getIceLabel(item.selectedIce)}
                        </span>
                        {item.selectedExtras.map(extra => {
                          const extraOpt = item.product.availableExtras.find(e => e.name === extra);
                          return (
                            <span key={extra} className="text-[10px] font-bold bg-orange-50 dark:bg-brand-orange-950/20 text-brand-orange-600 dark:text-brand-orange-400 px-2 py-0.5 rounded-md">
                              +{extraOpt?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right part: Adjust quantity & price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50 dark:border-slate-800">
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-xl select-none">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </button>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-100 w-6 text-center number-font">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center gap-4">
                      <div className="text-left min-w-[70px]">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">السعر</span>
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="text-base font-black text-slate-800 dark:text-slate-100 number-font">
                            {item.customizedPrice * item.quantity}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ج.م</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-slate-400 dark:text-slate-500 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Subtotal Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col gap-6 sticky top-24">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-50 dark:border-slate-800 pb-4">إجمالي الطلب</h3>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>المجموع الفرعي</span>
                  <span className="number-font font-bold text-slate-700 dark:text-slate-200">{subtotal} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>رسوم التوصيل</span>
                  <span className="number-font font-bold text-slate-700 dark:text-slate-200">{deliveryFee} ج.م</span>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-800 pt-4 flex items-center justify-between font-black text-slate-800 dark:text-slate-100 text-base">
                  <span>الإجمالي الكلي</span>
                  <span className="text-xl text-brand-orange-500 number-font">{total} ج.م</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                size="lg"
                className="w-full mt-2 cursor-pointer"
                leftIcon={<ShoppingBag className="w-5 h-5 ml-1" />}
              >
                الذهاب للدفع
              </Button>
            </div>

          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm max-w-xl mx-auto p-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/20 rounded-full flex items-center justify-center text-4xl mb-6 animate-pulse-slow">
              🛒
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">سلتك فارغة تماماً</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed mb-8">
              لم تقم بإضافة أي عصير منعش إلى سلتك بعد. اذهب للمنيو واكتشف أشهى المشروبات الباردة.
            </p>
            <Link to="/menu">
              <Button size="lg" className="cursor-pointer">شاهد منيو العصائر</Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
export default Cart;
