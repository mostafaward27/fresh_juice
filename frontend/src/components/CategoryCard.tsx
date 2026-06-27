import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  isActive,
  onClick
}) => {
  // Dynamically resolve icon from Lucide React
  const IconComponent = (Icons as any)[icon] || Icons.GlassWater;

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-5 rounded-3xl w-28 md:w-36 h-28 md:h-36 transition-all duration-300 cursor-pointer ${
        isActive
          ? 'bg-gradient-to-br from-brand-orange-500 to-orange-500 text-white shadow-xl shadow-orange-500/20'
          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm'
      }`}
    >
      <div className={`p-3 rounded-2xl mb-3 transition-colors duration-300 ${
        isActive ? 'bg-white/20 text-white' : 'bg-orange-50 dark:bg-orange-950/20 text-brand-orange-500'
      }`}>
        <IconComponent className="w-6 h-6 md:w-8 h-8" />
      </div>
      <span className="text-xs md:text-sm font-bold tracking-wide">{name}</span>
    </motion.button>
  );
};
export default CategoryCard;
