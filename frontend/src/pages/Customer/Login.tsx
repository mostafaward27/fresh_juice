import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve origin route if redirected by ProtectedRoute
  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      showToast('أهلاً بك مجدداً في عالم الانتعاش! 🍹', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-tr from-orange-50 via-white to-slate-50 relative">
      <Helmet>
        <title>مشروبات مشبرة | تسجيل الدخول</title>
        <meta name="description" content="سجل دخولك لحسابك في مشروبات مشبرة لمتابعة طلباتك، وإدارة مفضلتك." />
      </Helmet>

      {/* Decorative ice cubes */}
      <div className="absolute top-[20%] left-[15%] text-3xl animate-float-slow select-none pointer-events-none">🧊</div>
      <div className="absolute bottom-[20%] right-[15%] text-2xl animate-float-medium select-none pointer-events-none">🧊</div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-slate-100 p-8 rounded-[36px] shadow-2xl relative z-10 text-right">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-2xl animate-bounce inline-block mb-2">🍹</span>
          <h2 className="text-2xl font-black text-slate-800">مرحباً بك مجدداً</h2>
          <p className="text-slate-500 text-xs mt-1">سجل دخولك لتطلب مشروباتك المشبرة المفضلة</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4"
            leftIcon={<LogIn className="w-5 h-5 ml-1" />}
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="text-center mt-6 border-t border-slate-100 pt-6">
          <span className="text-xs text-slate-500">ليس لديك حساب؟ </span>
          <Link to="/register" className="text-xs font-black text-brand-orange-500 hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Login;
