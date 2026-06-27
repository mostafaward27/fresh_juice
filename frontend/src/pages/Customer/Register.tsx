import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, UserPlus, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register: React.FC = () => {
  const { register: signup, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve origin route if redirected by Favorites Auth Guard or ProtectedRoute
  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await signup(data.name, data.email, data.phone, data.password);
      showToast('تم إنشاء حسابك بنجاح! مرحباً بك في عائلة مشبر 🍹', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء إنشاء الحساب', 'error');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-tr from-orange-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <Helmet>
        <title>مشروبات مشبرة | حساب جديد</title>
        <meta name="description" content="أنشئ حساباً جديداً في مشروبات مشبرة لتستمتع بعروض حصرية وتتتبع شحناتك وتخصص مشروباتك المفضلة." />
      </Helmet>

      {/* Decorative ice cubes */}
      <div className="absolute top-[20%] right-[15%] text-3xl animate-float-slow select-none pointer-events-none opacity-40">🧊</div>
      <div className="absolute bottom-[20%] left-[15%] text-2xl animate-float-medium select-none pointer-events-none opacity-40">🧊</div>

      <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-100 dark:border-slate-800 p-8 rounded-[36px] shadow-2xl relative z-10 text-right">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-2xl animate-bounce inline-block mb-2">🍹</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">حساب جديد</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">ابدأ تجربتك المنعشة وسجل بياناتك الآن</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="الاسم الكامل"
            type="text"
            placeholder="أحمد محمد"
            leftIcon={<User className="w-5 h-5" />}
            error={errors.name?.message}
            {...register('name', { required: 'الاسم مطلوب' })}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
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

          <Input
            label="رقم الهاتف"
            type="text"
            placeholder="01012345678"
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

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'كلمة المرور مطلوبة',
              minLength: {
                value: 6,
                message: 'يجب أن لا تقل كلمة المرور عن 6 أحرف'
              }
            })}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'تأكيد كلمة المرور مطلوب',
              validate: (val, formValues) => {
                if (val !== formValues.password) {
                  return 'كلمات المرور غير متطابقة';
                }
              }
            })}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4"
            leftIcon={<UserPlus className="w-5 h-5 ml-1" />}
          >
            إنشاء حساب
          </Button>
        </form>

        <div className="text-center mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
          <span className="text-xs text-slate-500 dark:text-slate-400">لديك حساب بالفعل؟ </span>
          <Link to="/login" state={location.state} className="text-xs font-black text-brand-orange-500 hover:underline">
            سجل دخولك الآن
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Register;
