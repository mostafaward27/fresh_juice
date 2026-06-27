import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/types';
import { useFavorites } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext';
import { useToast } from './ui/Toast';
import { useAuth } from '../context/AuthContext';

interface DrinkCardProps {
  product: Product;
  onQuickCustomize?: (product: Product) => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ product, onQuickCustomize }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const isFav = isFavorite(product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    // Simulate minor delay for a premium interactive feel
    await new Promise(resolve => setTimeout(resolve, 600));

    // Add with defaults: medium, 50% sugar, normal ice, no extras
    addToCart(
      product,
      1,
      'medium',
      50,
      'normal',
      []
    );
    setIsAdding(false);
    showToast(`تم إضافة ${product.name} للسلة بنجاح!`, 'success');
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toggleFavorite(product.id);
      return;
    }

    toggleFavorite(product.id);
    showToast(
      isFav ? 'تم الحذف من المفضلة' : 'تم الإضافة للمفضلة 💖',
      'info'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 group"
    >
      {/* Product Image Section */}
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden aspect-video">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

        {/* Favorite Icon */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-4 right-4 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/30 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm z-10 cursor-pointer"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Special Drink Badge */}
        {product.isSpecial && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-brand-green-500 text-white text-xs font-black rounded-full shadow-sm select-none z-10">
            مميز ✨
          </div>
        )}
      </Link>

      {/* Drink details */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {product.category === 'juices' ? 'عصير طبيعي' : 
             product.category === 'cocktails' ? 'كوكتيل صيفي' :
             product.category === 'cold-coffee' ? 'قهوة باردة' : 'خلطة خاصة'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 number-font">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-brand-orange-500 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h4>
        </Link>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">السعر</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 number-font">{product.price}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ج.م</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onQuickCustomize ? (
              <button
                onClick={() => onQuickCustomize(product)}
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl transition-colors cursor-pointer"
                title="تخصيص الخيارات"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to={`/product/${product.id}`}
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl transition-colors"
                title="تخصيص الخيارات"
              >
                <Settings2 className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-orange-500 to-orange-500 hover:from-brand-orange-600 hover:to-orange-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="إضافة سريعة للسلة"
            >
              {isAdding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default DrinkCard;
