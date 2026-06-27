import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  type = 'text',
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col w-full gap-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute right-4 text-slate-400 dark:text-slate-500 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={currentType}
          className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-all duration-300 ${
            leftIcon ? 'pr-11 font-bold' : ''
          } ${isPassword || rightIcon ? 'pl-11 font-bold' : ''} ${
            error ? 'border-rose-500 focus:ring-rose-500' : ''
          } ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute left-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10 cursor-pointer flex items-center justify-center"
            title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none z-10">
            {rightIcon}
          </div>
        ) : null}
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-500">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
