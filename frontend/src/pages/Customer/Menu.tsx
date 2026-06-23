import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { DrinkCard } from '../../components/DrinkCard';
import { CategoryCard } from '../../components/CategoryCard';
import { Modal } from '../../components/ui/Modal';
import { ProductCustomizer } from '../../components/ProductCustomizer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/ui/Toast';
import type { Product } from '../../types/types';

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync category state with URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleQuickCustomize = (product: Product) => {
    setSelectedProduct(product);
    setIsCustomizerOpen(true);
  };

  const handleCustomAddToCart = (
    quantity: number,
    size: 'small' | 'medium' | 'large',
    sugar: 0 | 25 | 50 | 100,
    ice: 'none' | 'normal' | 'extra',
    extras: string[]
  ) => {
    if (!selectedProduct) return;
    
    addToCart(selectedProduct, quantity, size, sugar, ice, extras);
    setIsCustomizerOpen(false);
    showToast(`تم إضافة ${selectedProduct.name} للسلة بخصائصك المخصصة!`, 'success');
  };

  // Filter products based on search query and category selection
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryDesc = selectedCategory === 'all' 
    ? 'تصفح قائمة المشروبات المشبرة المتكاملة واختر ما يروق لك'
    : CATEGORIES.find(c => c.slug === selectedCategory)?.description;

  return (
    <div className="py-10 bg-slate-50/50 flex-grow">
      <Helmet>
        <title>مشروبات مشبرة | منيو المشروبات</title>
        <meta name="description" content="تصفح قائمة عصائرنا الطبيعية المنعشة والمشروبات الباردة والقهوة المثلجة والمشروبات الخاصة والمبتكرة." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-brand-orange-500 font-black text-sm block mb-1">قائمة المشروبات</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">منيو الانتعاش 🍹</h1>
          <p className="text-slate-500 text-sm leading-relaxed">{activeCategoryDesc}</p>
        </div>

        {/* Search & Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-2xl mx-auto">
          <div className="relative w-full flex items-center">
            <Search className="absolute right-4 text-slate-400 pointer-events-none w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن عصيرك المفضل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right shadow-sm"
            />
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 justify-start md:justify-center scrollbar-none">
          <CategoryCard
            name="الكل"
            slug="all"
            icon="Layers"
            isActive={selectedCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
          />
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              isActive={selectedCategory === cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
            />
          ))}
        </div>

        {/* Drink list grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {filteredProducts.map((drink) => (
              <DrinkCard
                key={drink.id}
                product={drink}
                onQuickCustomize={handleQuickCustomize}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-sm max-w-xl mx-auto mt-10 p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">عذراً، لم نجد نتائج تطابق بحثك</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              تأكد من كتابة اسم المشروب بشكل صحيح أو اختر تصنيفاً آخر لتصفح مشروبات بديلة.
            </p>
          </div>
        )}

      </div>

      {/* Quick Customizer Modal */}
      <Modal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        title={selectedProduct ? `تخصيص: ${selectedProduct.name}` : ''}
        size="md"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 gap-6">
            {/* Short product banner */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-right">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-800">{selectedProduct.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Customizer Option Form */}
            <ProductCustomizer
              product={selectedProduct}
              onAddToCart={handleCustomAddToCart}
            />
          </div>
        )}
      </Modal>

    </div>
  );
};
export default Menu;
