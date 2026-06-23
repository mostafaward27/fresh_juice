import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, Heart, Check } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/types';
import Loader from '../../components/ui/Loader';
import { ProductCustomizer } from '../../components/ProductCustomizer';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import { useToast } from '../../components/ui/Toast';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader fullPage text="تحميل تفاصيل المشروب..." />;
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
          🥤
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">المشروب غير موجود</h3>
        <p className="text-sm text-slate-500 max-w-xs mb-6">
          يبدو أن المشروب الذي تبحث عنه غير متوفر حالياً أو تم حذفه من القائمة.
        </p>
        <Link to="/menu" className="px-6 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold rounded-2xl shadow-md transition-all">
          العودة للمنيو
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(product.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(product.id);
    showToast(
      isFav ? 'تم الحذف من المفضلة' : 'تم الإضافة للمفضلة 💖',
      'info'
    );
  };

  const handleAddToCart = (
    quantity: number,
    size: 'small' | 'medium' | 'large',
    sugar: 0 | 25 | 50 | 100,
    ice: 'none' | 'normal' | 'extra',
    extras: string[]
  ) => {
    addToCart(product, quantity, size, sugar, ice, extras);
    showToast(`تم إضافة ${product.name} بنجاح إلى السلة!`, 'success');
  };

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>{`مشروبات مشبرة | ${product.name}`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/menu" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-orange-500 mb-8 font-bold transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>العودة لقائمة المشروبات</span>
        </Link>

        {/* Details Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-slate-100 rounded-[40px] p-6 md:p-12 shadow-premium relative overflow-hidden">
          
          {/* Left panel: Media & Description */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleFavoriteToggle}
                className="absolute top-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 text-slate-600 hover:text-rose-500 shadow-md hover:scale-105 transition-all"
              >
                <Heart className={`w-6 h-6 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-bold px-3 py-1 bg-brand-orange-50 text-brand-orange-600 rounded-lg">
                  {product.category === 'juices' ? 'عصائر طبيعية' : 
                   product.category === 'cocktails' ? 'كوكتيلات' : 
                   product.category === 'cold-coffee' ? 'قهوة باردة' : 'مشروبات خاصة'}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-600 number-font">{product.rating}</span>
                  <span className="text-xs text-slate-400 font-medium">({product.reviewsCount} تقييم)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">
                {product.name}
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                {product.description}
              </p>

              {/* Mock Ingredients block */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-700 text-sm mb-3">مميزات المشروب ⚡</h4>
                <ul className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-semibold">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-green-500" />
                    <span>مكونات طازجة 100٪</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-green-500" />
                    <span>بدون سكر مضاف صناعياً</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-green-500" />
                    <span>يُعصر ويُحضر عند الطلب</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-green-500" />
                    <span>توصيل سريع مبرد (مشبر)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right panel: Customizer Form */}
          <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-r border-slate-100 lg:pr-12 pt-8 lg:pt-0">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 mb-1">خصص مشروبك المشبر 🍹</h3>
              <p className="text-xs text-slate-400">اختر الحجم ونسبة الحلاوة والثلج والإضافات المفضلة</p>
            </div>
            
            <ProductCustomizer
              product={product}
              onAddToCart={handleAddToCart}
              buttonText="أضف إلى السلة 🍹"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
export default ProductDetails;
