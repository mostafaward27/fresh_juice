import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Heart, ClipboardList, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/menu', label: 'المنيو' }
  ];

  const activeStyle = "text-brand-orange-500 font-black relative after:content-[''] after:absolute after:bottom-[-6px] after:right-0 after:w-full after:h-1 after:bg-brand-orange-500 after:rounded-full";
  const inactiveStyle = "text-slate-600 hover:text-brand-orange-500 font-bold transition-colors";

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl animate-bounce">🍹</span>
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-brand-orange-500 via-orange-600 to-brand-green-600 bg-clip-text text-transparent">
                مشروبات مشبرة
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                {link.label}
              </NavLink>
            ))}
            
            {isAuthenticated && (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                >
                  المفضلة
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                >
                  طلباتي
                </NavLink>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-brand-orange-500 rounded-2xl transition-all duration-300">
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -left-1.5 w-5 h-5 flex items-center justify-center bg-brand-orange-500 text-white text-[10px] font-black rounded-full shadow-md shadow-brand-orange-500/20 number-font"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Admin shortcut */}
            {isAdmin && (
              <Link to="/admin" className="p-3 bg-teal-50 hover:bg-teal-100 text-brand-green-600 hover:text-teal-700 rounded-2xl transition-all" title="لوحة التحكم">
                <ShieldAlert className="w-6 h-6" />
              </Link>
            )}

            {/* Auth Button / Dropdown */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 p-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 rounded-2xl transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-bold">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-3 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-orange-500 to-orange-500 hover:from-brand-orange-600 hover:to-orange-600 text-white text-sm font-bold rounded-2xl shadow-sm transition-all"
                >
                  حساب جديد
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Cart Icon Mobile */}
            <Link to="/cart" className="relative p-2.5 bg-slate-50 text-slate-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-4.5 h-4.5 flex items-center justify-center bg-brand-orange-500 text-white text-[9px] font-black rounded-full number-font">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin shortcut Mobile */}
            {isAdmin && (
              <Link to="/admin" className="p-2.5 bg-teal-50 text-brand-green-600 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </Link>
            )}

            {/* Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 bg-slate-50 text-slate-700 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> المفضلة
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center gap-2"
                  >
                    <ClipboardList className="w-4 h-4" /> طلباتي
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center gap-2 border-t border-slate-50 mt-2"
                  >
                    <User className="w-4 h-4" /> حسابي الشخصي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2.5 px-4 font-bold text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center gap-2 text-right w-full"
                  >
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-4 border-t border-slate-100 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-center font-bold text-slate-700 hover:bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-center font-bold text-white bg-gradient-to-r from-brand-orange-500 to-orange-500 rounded-2xl"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
