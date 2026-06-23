import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, User, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
}

export const Checkout: React.FC = () => {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { placeOrder, isLoading } = useOrders();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.savedAddresses?.[0] || ''
    }
  });

  // Redirect to cart if empty
  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const placed = await placeOrder(
        data.name,
        data.phone,
        data.address,
        cart,
        total,
        deliveryFee,
        paymentMethod
      );

      // Trigger premium celebration confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Extra burst for visual awe
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.5 }
        });
      }, 300);

      showToast('تم تسجيل طلبك بنجاح! جاري تحضير انتعاشك 🍹', 'success');
      clearCart();
      
      // Delay navigation slightly so user can enjoy the confetti
      setTimeout(() => {
        navigate(`/tracking/${placed.id}`);
      }, 1500);
      
    } catch (err) {
      showToast('عذراً، فشل تسجيل الطلب. يرجى المحاولة لاحقاً', 'error');
    }
  };

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>مشروبات مشبرة | إتمام الطلب</title>
        <meta name="description" content="أدخل بيانات الشحن والتوصيل، واختر طريقة الدفع المناسبة لتأكيد طلبك." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-10">إتمام الشراء والدفع</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Checkout Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Delivery address details card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-4">1. معلومات التوصيل</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="الاسم الكامل"
                  placeholder="أدخل اسمك بالكامل"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.name?.message}
                  {...register('name', { required: 'الاسم مطلوب' })}
                />
                <Input
                  label="رقم الهاتف"
                  placeholder="مثال: 01012345678"
                  leftIcon={<Phone className="w-5 h-5" />}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'رقم الهاتف مطلوب',
                    pattern: {
                      value: /^01[0-2,5]{1}[0-9]{8}$/,
                      message: 'رقم هاتف مصري غير صالح'
                    }
                  })}
                />
              </div>

              <Input
                label="العنوان بالتفصيل"
                placeholder="اسم الشارع، رقم البناية، الطابق، رقم الشقة"
                leftIcon={<MapPin className="w-5 h-5" />}
                error={errors.address?.message}
                {...register('address', { required: 'العنوان مطلوب' })}
              />

              {/* Map Placeholder Graphic */}
              <div className="mt-2">
                <span className="text-sm font-semibold text-slate-700 block mb-3">موقع التوصيل على الخريطة (تقديري)</span>
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                  {/* Styled Map Background Grid representation */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                  {/* Decorative roads & pins */}
                  <div className="w-[80%] h-0.5 bg-slate-200 absolute rotate-12" />
                  <div className="w-[60%] h-0.5 bg-slate-200 absolute -rotate-45" />
                  <div className="w-1.5 h-32 bg-brand-orange-500/10 absolute -left-10" />
                  
                  {/* Pulsating pointer */}
                  <div className="relative flex items-center justify-center z-10">
                    <div className="absolute w-12 h-12 bg-brand-orange-500/20 rounded-full animate-ping" />
                    <div className="absolute w-6 h-6 bg-brand-orange-500/40 rounded-full" />
                    <MapPin className="w-8 h-8 text-brand-orange-500 fill-white drop-shadow-md z-10" />
                  </div>
                  
                  <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-500 rounded-lg">
                    يتم تحديد الموقع تلقائياً
                  </span>
                </div>
              </div>

            </div>

            {/* Payment Options Card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-4">2. طريقة الدفع</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Cash option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-4 p-5 border-2 rounded-2xl text-right transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-orange-500 bg-brand-orange-50/40'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'cod' ? 'bg-brand-orange-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">الدفع عند الاستلام</span>
                    <span className="text-xs text-slate-400">ادفع نقداً لعامل التوصيل عند الاستلام</span>
                  </div>
                </button>

                {/* Card option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-center gap-4 p-5 border-2 rounded-2xl text-right transition-all ${
                    paymentMethod === 'online'
                      ? 'border-brand-orange-500 bg-brand-orange-50/40'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'online' ? 'bg-brand-orange-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">الدفع الإلكتروني</span>
                    <span className="text-xs text-slate-400">فيزا، ماستر كارد، فودافون كاش</span>
                  </div>
                </button>

              </div>
            </div>

          </div>

          {/* Checkout items summary panel */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-6 sticky top-24">
            <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-4">ملخص الطلبية</h3>
            
            <div className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 text-right">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-bold text-slate-700 line-clamp-1">{item.product.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">الكمية: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-800 number-font">{item.customizedPrice * item.quantity} ج.م</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-50 pt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span>المجموع الفرعي</span>
                <span className="number-font font-bold text-slate-700">{subtotal} ج.م</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span>رسوم التوصيل</span>
                <span className="number-font font-bold text-slate-700">{deliveryFee} ج.م</span>
              </div>
              <div className="border-t border-slate-50 pt-4 flex items-center justify-between font-black text-slate-800 text-base">
                <span>الإجمالي النهائي</span>
                <span className="text-xl text-brand-orange-500 number-font">{total} ج.م</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              leftIcon={<ShoppingBag className="w-5 h-5 ml-1" />}
            >
              تأكيد الطلب الآن 🍹
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
export default Checkout;
