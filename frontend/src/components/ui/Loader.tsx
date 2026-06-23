import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullPage = false,
  size = 'md',
  text = 'جاري التحميل...'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const containerStyles = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/85 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerStyles}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Animated Cup/Glass Outer Rim */}
        <div className="absolute inset-0 border-4 border-t-brand-orange-500 border-x-brand-green-500 border-b-brand-orange-500 rounded-2xl animate-spin" />
        
        {/* Rising Ice Cubes/Bubbles inside the Loader */}
        <div className="absolute inset-2 bg-gradient-to-br from-brand-orange-500/10 to-brand-green-500/10 rounded-xl overflow-hidden flex items-end justify-center">
          <motion.div
            animate={{
              y: [-10, -40],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-2 h-2 bg-brand-orange-500 rounded-full mb-1"
          />
          <motion.div
            animate={{
              y: [-5, -35],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.4,
              ease: 'easeInOut'
            }}
            className="w-1.5 h-1.5 bg-brand-green-500 rounded-full mb-2 mx-1"
          />
          <motion.div
            animate={{
              y: [-12, -45],
              opacity: [0, 0.9, 0],
              scale: [0.7, 1.1, 0.7]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: 0.8,
              ease: 'easeInOut'
            }}
            className="w-2 h-2 bg-amber-400 rounded-full mb-1"
          />
        </div>
      </div>
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-sm font-semibold text-slate-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
export default Loader;
