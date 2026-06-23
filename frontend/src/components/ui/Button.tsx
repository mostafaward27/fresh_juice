import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-orange-500 to-orange-500 hover:from-brand-orange-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 focus:ring-brand-orange-500',
    secondary: 'bg-gradient-to-r from-brand-green-500 to-teal-500 hover:from-brand-green-600 hover:to-teal-600 text-white shadow-lg shadow-teal-500/20 focus:ring-brand-green-500',
    outline: 'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-300 focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-slate-100/50 text-slate-600 hover:text-slate-900 focus:ring-slate-500',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/10 focus:ring-rose-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props as any}
    >
      {isLoading && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="ml-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="mr-2">{rightIcon}</span>}
    </motion.button>
  );
};
