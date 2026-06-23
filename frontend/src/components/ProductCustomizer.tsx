import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import type { Product } from '../types/types';
import { Button } from './ui/Button';

interface ProductCustomizerProps {
  product: Product;
  onAddToCart: (
    quantity: number,
    size: 'small' | 'medium' | 'large',
    sugar: 0 | 25 | 50 | 100,
    ice: 'none' | 'normal' | 'extra',
    extras: string[]
  ) => void;
  buttonText?: string;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  product,
  onAddToCart,
  buttonText = 'إضافة للسلة 🍹'
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedSugar, setSelectedSugar] = useState<0 | 25 | 50 | 100>(50);
  const [selectedIce, setSelectedIce] = useState<'none' | 'normal' | 'extra'>('normal');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState(product.price);

  // Update current price based on customization
  useEffect(() => {
    let base = product.price;

    // Size modifier
    const sizeMod = product.availableSizes.find(s => s.name === selectedSize)?.priceModifier || 0;
    base += sizeMod;

    // Extras pricing
    selectedExtras.forEach(extraName => {
      const extraPrice = product.availableExtras.find(e => e.name === extraName)?.price || 0;
      base += extraPrice;
    });

    setCurrentPrice(base);
  }, [product, selectedSize, selectedExtras]);

  const toggleExtra = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName)
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  const handleAdd = () => {
    onAddToCart(quantity, selectedSize, selectedSugar, selectedIce, selectedExtras);
  };

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Size Option */}
      <div>
        <h4 className="text-sm font-extrabold text-slate-700 mb-3">حجم الكوب</h4>
        <div className="grid grid-cols-3 gap-3">
          {product.availableSizes.map(size => (
            <button
              key={size.name}
              type="button"
              onClick={() => setSelectedSize(size.name)}
              className={`flex flex-col items-center justify-center p-3.5 border-2 rounded-2xl transition-all duration-200 ${
                selectedSize === size.name
                  ? 'border-brand-orange-500 bg-brand-orange-50/40 text-brand-orange-600 font-bold'
                  : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span className="text-sm">{size.label}</span>
              <span className="text-xs mt-1 text-slate-400 number-font">
                {size.priceModifier >= 0 ? `+${size.priceModifier}` : size.priceModifier} ج.م
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sugar Level */}
      <div>
        <h4 className="text-sm font-extrabold text-slate-700 mb-3">نسبة السكر</h4>
        <div className="grid grid-cols-4 gap-2">
          {product.availableSugar.map(sugar => (
            <button
              key={sugar.value}
              type="button"
              onClick={() => setSelectedSugar(sugar.value)}
              className={`py-3 text-xs border-2 rounded-2xl text-center transition-all duration-200 font-bold ${
                selectedSugar === sugar.value
                  ? 'border-brand-orange-500 bg-brand-orange-50/40 text-brand-orange-600'
                  : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
              }`}
            >
              {sugar.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ice Level */}
      <div>
        <h4 className="text-sm font-extrabold text-slate-700 mb-3">كمية الثلج</h4>
        <div className="grid grid-cols-3 gap-3">
          {product.availableIce.map(ice => (
            <button
              key={ice.value}
              type="button"
              onClick={() => setSelectedIce(ice.value)}
              className={`py-3.5 text-sm border-2 rounded-2xl text-center transition-all duration-200 font-bold ${
                selectedIce === ice.value
                  ? 'border-brand-orange-500 bg-brand-orange-50/40 text-brand-orange-600'
                  : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
              }`}
            >
              {ice.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extras */}
      {product.availableExtras.length > 0 && (
        <div>
          <h4 className="text-sm font-extrabold text-slate-700 mb-3">إضافات لذيذة</h4>
          <div className="flex flex-col gap-2">
            {product.availableExtras.map(extra => {
              const isChecked = selectedExtras.includes(extra.name);
              return (
                <button
                  key={extra.name}
                  type="button"
                  onClick={() => toggleExtra(extra.name)}
                  className={`flex items-center justify-between p-3.5 border-2 rounded-2xl transition-all duration-200 ${
                    isChecked
                      ? 'border-brand-orange-500 bg-brand-orange-50/30'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isChecked ? 'border-brand-orange-500 bg-brand-orange-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{extra.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-500 number-font">+{extra.price} ج.م</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl select-none">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Minus className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-lg font-black text-slate-800 w-8 text-center number-font">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto flex-grow justify-end">
          <div className="text-left">
            <span className="text-xs font-bold text-slate-400 block">الإجمالي</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-orange-500 number-font">
                {currentPrice * quantity}
              </span>
              <span className="text-xs font-bold text-slate-500">ج.م</span>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            className="w-full sm:w-auto"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductCustomizer;
