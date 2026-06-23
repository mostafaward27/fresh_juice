import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, MapPin, Plus, Trash2, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<string[]>(user?.savedAddresses || []);
  const [newAddress, setNewAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const onSubmitInfo = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone
      });
      showToast('تم تحديث بياناتك الشخصية بنجاح!', 'success');
    } catch (err) {
      showToast('فشل تحديث البيانات، يرجى المحاولة لاحقاً', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const updated = [...addresses, newAddress.trim()];
    try {
      await updateProfile({ savedAddresses: updated });
      setAddresses(updated);
      setNewAddress('');
      showToast('تم إضافة العنوان الجديد بنجاح', 'success');
    } catch (err) {
      showToast('فشل إضافة العنوان', 'error');
    }
  };

  const handleDeleteAddress = async (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    try {
      await updateProfile({ savedAddresses: updated });
      setAddresses(updated);
      showToast('تم حذف العنوان', 'info');
    } catch (err) {
      showToast('فشل حذف العنوان', 'error');
    }
  };

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>مشروبات مشبرة | حسابي الشخصي</title>
        <meta name="description" content="عدّل معلوماتك الشخصية، تصفح عناوينك المحفوظة، وراجع إحصائيات حسابك." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-10">حسابي الشخصي</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Info Side */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Personal credentials form card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-4 mb-6">البيانات الشخصية</h3>
              
              <form onSubmit={handleSubmit(onSubmitInfo)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="الاسم الكامل"
                    placeholder="أحمد محمد"
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
                        message: 'رقم الهاتف غير صالح'
                      }
                    })}
                  />
                </div>

                <Input
                  label="البريد الإلكتروني"
                  placeholder="example@mshabar.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'البريد الإلكتروني مطلوب',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'البريد الإلكتروني غير صالح'
                    }
                  })}
                />

                <Button type="submit" isLoading={isUpdating} className="self-start mt-2">
                  تحديث البيانات
                </Button>
              </form>
            </div>

            {/* Address Management Card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-4 mb-6">دفتر العناوين</h3>
              
              {/* List of addresses */}
              {addresses.length > 0 ? (
                <div className="flex flex-col gap-3 mb-6">
                  {addresses.map((address, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/50 rounded-2xl gap-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-brand-orange-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-700 leading-normal">{address}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="حذف العنوان"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 mb-6">لا يوجد عناوين مسجلة بعد. أضف عنوانك الأول بالأسفل لتسهيل عمليات التوصيل لاحقاً.</p>
              )}

              {/* Add address form */}
              <form onSubmit={handleAddAddress} className="flex gap-2">
                <input
                  type="text"
                  placeholder="أدخل عنواناً جديداً (اسم الشارع، الحي، المدينة)"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right"
                />
                <Button type="submit" leftIcon={<Plus className="w-4 h-4 ml-1" />}>
                  إضافة
                </Button>
              </form>
            </div>

          </div>

          {/* Right Side / Shortcuts */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
              <h4 className="font-extrabold text-slate-800 text-base mb-2">روابط سريعة لحسابك</h4>
              
              <Link to="/orders" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-brand-orange-50/40 border border-slate-100 hover:border-brand-orange-500/10 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-orange-500 text-white rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">طلباتي السابقة</span>
                </div>
                <span className="text-xs text-slate-400 font-bold group-hover:text-brand-orange-500 transition-colors">عرض الكل ←</span>
              </Link>

              <Link to="/favorites" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-brand-orange-50/40 border border-slate-100 hover:border-brand-orange-500/10 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500 text-white rounded-xl">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">مشروباتي المفضلة</span>
                </div>
                <span className="text-xs text-slate-400 font-bold group-hover:text-rose-500 transition-colors">عرض الكل ←</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Profile;
