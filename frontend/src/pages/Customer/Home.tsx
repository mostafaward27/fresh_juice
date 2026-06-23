import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Send, ShieldCheck, Star, Quote } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { DrinkCard } from '../../components/DrinkCard';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

// Let's resolve the path. CATEGORIES was defined in data/products.ts. Let's fix that.
// Yes! import { CATEGORIES, PRODUCTS } from '../../data/products';
import { CATEGORIES as productsCategories } from '../../data/products';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const featuredDrinks = PRODUCTS.filter(p => p.isFeatured).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('شكراً لتسجيلك! سنرسل لك عروضنا المشبرة أولاً بأول 📧', 'success');
    setEmail('');
  };

  const reviews = [
    {
      id: 1,
      name: 'أنس الجوهري',
      role: 'عميل مميز',
      text: 'المانجو المشبر عندهم حكاية تانية خالص! العصير مركز وطازة والثلج فيه مجروش بنسبة مثالية تبرد القلب.',
      rating: 5,
      avatar: 'أ'
    },
    {
      id: 2,
      name: 'رانيا مصطفى',
      role: 'محب للقهوة المثلجة',
      text: 'السبانش لاتيه بارد ولذيذ جداً، مش حلو زيادة ونكهة القهوة واضحة وقوية. التغليف ممتاز والتوصيل سريع.',
      rating: 5,
      avatar: 'ر'
    },
    {
      id: 3,
      name: 'عمر الخطيب',
      role: 'متذوق عصائر',
      text: 'عصير الامبراطور هو المفضل عندي، خلطة الأفوكادو والمانجو مع القشطة والمكسرات غنية ومغذية جداً، أنصح به بشدة.',
      rating: 5,
      avatar: 'ع'
    }
  ];

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>مشروبات مشبرة | الصفحة الرئيسية</title>
        <meta name="description" content="عصائر فريش، كوكتيلات صيفية، قهوة باردة، ومشروبات خاصة مشبرة لإنعاش حواسك. اطلب الآن من منيو مشروبات مشبرة." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-50 via-white to-slate-50 py-20 md:py-28 flex items-center justify-center overflow-hidden">
        {/* Floating Bubble/Ice Background items */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-6 h-6 bg-brand-orange-500/10 rounded-full animate-bubble-slow" />
          <div className="absolute top-[40%] right-[15%] w-8 h-8 bg-brand-green-500/10 rounded-full animate-bubble-medium" />
          <div className="absolute bottom-[30%] left-[20%] w-10 h-10 bg-amber-400/10 rounded-full animate-bubble-slow" />
          {/* Animated ice cube representations */}
          <div className="absolute top-[15%] right-[25%] text-4xl animate-float-slow select-none">🧊</div>
          <div className="absolute bottom-[20%] left-[8%] text-3xl animate-float-medium select-none">🧊</div>
          <div className="absolute top-[50%] left-[45%] text-2xl animate-float-fast select-none">🧊</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange-50 border border-brand-orange-100 rounded-full text-brand-orange-600 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black">طعم الانتعاش الحقيقي</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-800 leading-[1.2] mb-6">
              انتعاشك يبدأ من هنا <span className="inline-block animate-pulse-slow">🍹</span>
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl font-medium">
              أفضل العصائر الطبيعية الطازجة والمشروبات الباردة والمشبرة، المحضرة يومياً من فاكهة منتقاة بعناية لتعطيك طاقة وحيوية.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
              <Button
                size="lg"
                onClick={() => navigate('/menu')}
                leftIcon={<ArrowLeft className="w-5 h-5 mr-1 transform rotate-180" />}
                className="w-full sm:w-auto"
              >
                اطلب الآن
              </Button>
              <Link to="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  شاهد المنيو
                </Button>
              </Link>
            </div>

            {/* Quick trust items */}
            <div className="flex items-center gap-6 mt-12 text-slate-500 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-green-500" />
                <span className="text-xs font-bold">مكونات فريش 100٪</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-600 number-font">4.9 / 5</span>
              </div>
            </div>

          </motion.div>

          {/* Graphic panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Colored background glow */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-brand-orange-500/20 to-brand-green-500/20 filter blur-[80px] -z-10 animate-pulse-slow" />
            
            {/* Realistic drink image wrap */}
            <div className="w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-[48px] overflow-hidden border border-white/30 shadow-2xl bg-white/20 backdrop-blur-md p-4 animate-float-slow relative">
              <img
                src="https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800"
                alt="مشروب مشبر فريش"
                className="w-full h-full object-cover rounded-[36px]"
              />
              {/* Glassmorphic overlay card on floating graphic */}
              <div className="absolute bottom-10 right-10 left-10 p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-white/20 shadow-lg text-right flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange-500 text-white flex items-center justify-center font-black">
                  ٪100
                </div>
                <div>
                  <span className="text-xs font-black text-slate-400 block">ضمان طبيعي</span>
                  <span className="text-sm font-black text-slate-800">خالٍ من المواد الحافظة</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Categories section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-orange-500 font-black text-sm block mb-2">اختر نكهتك</span>
          <h2 className="text-3xl font-black text-slate-800 mb-4">تصنيفات الانتعاش</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mb-12">
            اكتشف تشكيلتنا الواسعة المصممة خصيصاً لتناسب جميع الأذواق والأوقات الصيفية الحارة.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {productsCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/menu?category=${cat.slug}`)}
                className="flex flex-col items-center p-6 border border-slate-100 hover:border-brand-orange-500/20 bg-slate-50/50 hover:bg-brand-orange-50/20 rounded-3xl w-40 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  {cat.id === 'juices' ? '🍹' : cat.id === 'cocktails' ? '🧉' : cat.id === 'cold-coffee' ? '☕' : '✨'}
                </div>
                <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drinks section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div className="text-right">
              <span className="text-brand-green-600 font-black text-sm block mb-2">الأكثر طلباً</span>
              <h2 className="text-3xl font-black text-slate-800">مشروباتنا الأكثر شهرة 🔥</h2>
            </div>
            <Link to="/menu">
              <Button variant="outline" rightIcon={<ArrowLeft className="w-4 h-4 mr-1 transform rotate-180" />}>
                عرض المنيو كامل
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDrinks.map((drink) => (
              <DrinkCard key={drink.id} product={drink} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-brand-orange-500 to-orange-600 rounded-[40px] p-8 md:p-16 text-white text-right overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-10">
            {/* Bubble backdrops */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/10 rounded-full -top-10 -left-10 filter blur-xl" />

            <div className="relative z-10 max-w-xl">
              <div className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black inline-block mb-4 select-none">
                عرض خاص لفترة محدودة ⚡
              </div>
              <h3 className="text-3xl sm:text-4xl font-black mb-4">احصل على كوب مجاني مع طلبك الأول!</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
                سجل حساباً معنا اليوم واطلب أي عصير من فئة المشروبات الخاصة لتستمتع بكوب ليمون بالنعناع هدية مجاناً مع التوصيل.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-brand-orange-500"
                >
                  سجل الآن مجاناً
                </Button>
              </div>
            </div>

            <div className="relative z-10 w-[240px] sm:w-[320px] aspect-square rounded-[36px] overflow-hidden border-4 border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
                alt="كوب ليمون مجاني"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-orange-500 font-black text-sm block mb-2">رأي عملائنا</span>
          <h2 className="text-3xl font-black text-slate-800 mb-12">ماذا يقولون عن انتعاشنا؟ 💬</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-8 bg-white border border-slate-100 rounded-[32px] text-right shadow-premium flex flex-col justify-between relative">
                <Quote className="absolute top-6 left-6 w-10 h-10 text-slate-100" />
                <div className="flex text-amber-400 mb-6">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">"{rev.text}"</p>
                <div className="flex items-center gap-3 mt-4 border-t border-slate-50 pt-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange-500 to-orange-400 text-white flex items-center justify-center font-black">
                    {rev.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">{rev.name}</span>
                    <span className="text-xs text-slate-400">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-2xl mb-4">📧</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">اشترك في قائمتنا البريدية</h2>
          <p className="text-slate-500 text-sm mb-8 max-w-md">
            احصل على عروض حصرية، خصومات خاصة، وتنبيهات بأحدث مشروباتنا المنعشة التي نطلقها أسبوعياً.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow px-5 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right"
            />
            <Button type="submit" leftIcon={<Send className="w-4 h-4 ml-1" />}>
              اشترك الآن
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
};
export default Home;
