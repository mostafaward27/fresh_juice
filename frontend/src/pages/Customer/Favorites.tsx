import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoriteContext';
import { productService } from '../../services/productService';
import type { Product } from '../../types/types';
import { DrinkCard } from '../../components/DrinkCard';
import Loader from '../../components/ui/Loader';
import { Link } from 'react-router-dom';

export const Favorites: React.FC = () => {
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await productService.getProducts();
        const filtered = allProducts.filter(p => favorites.includes(p.id));
        setFavoriteProducts(filtered);
      } catch (err) {
        console.error('Failed to load favorite products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [favorites]);

  if (loading) {
    return <Loader fullPage text="تحميل مشروباتك المفضلة..." />;
  }

  return (
    <div className="py-10 bg-slate-50/50 flex-grow text-right">
      <Helmet>
        <title>مشروبات مشبرة | المشروبات المفضلة</title>
        <meta name="description" content="راجع قائمة مشروباتك وعصائرك المفضلة التي قمت بحفظها للطلب السريع." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-10 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span>المشروبات المفضلة</span>
        </h1>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((drink) => (
              <DrinkCard key={drink.id} product={drink} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-sm max-w-xl mx-auto p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mb-4 text-rose-500">
              💖
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">قائمة المفضلة فارغة</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
              لم تقم بإضافة أي مشروبات إلى قائمتك المفضلة بعد. تصفح المنيو واضغط على أيقونة القلب لحفظ المشروب هنا.
            </p>
            <Link to="/menu" className="px-5 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold rounded-xl shadow-sm text-sm transition-all">
              تصفح منيو العصائر
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
export default Favorites;
