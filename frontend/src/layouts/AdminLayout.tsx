import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderHeart, Users, LogOut, Home, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminLinks = [
    { to: '/admin', label: 'لوحة الإحصائيات', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'إدارة المنتجات', icon: FolderHeart },
    { to: '/admin/orders', label: 'إدارة الطلبات', icon: ShoppingBag },
    { to: '/admin/users', label: 'إدارة المستخدمين', icon: Users }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeClass = 'flex items-center gap-3.5 px-5 py-4 bg-gradient-to-r from-brand-orange-500 to-orange-500 text-white rounded-2xl shadow-md shadow-orange-500/10 font-bold';
  const inactiveClass = 'flex items-center gap-3.5 px-5 py-4 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all duration-200 font-semibold';

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-l border-slate-100 p-6 sticky top-0 h-screen flex-shrink-0 z-20">
        {/* Brand Logo */}
        <div className="mb-10 px-2 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-brand-orange-500" />
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-800">لوحة الإشراف</span>
            <span className="text-[10px] font-bold text-slate-400">مشروبات مشبرة</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3.5 px-5 py-4 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all font-semibold"
          >
            <Home className="w-5 h-5 text-slate-400" />
            <span>عرض المتجر</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-5 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-right"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2.5 bg-slate-50 rounded-xl text-slate-600 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h2 className="hidden md:block text-xl font-black text-slate-800">
            مرحباً بك، {user?.name} 👋
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-3 py-1.5 bg-brand-orange-50 text-brand-orange-600 rounded-full border border-brand-orange-100">
              مدير رئيسي
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange-500 to-orange-500 flex items-center justify-center text-white font-black shadow-md select-none">
              م
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="p-6 md:p-8 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Drawer - Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 bg-white h-full p-6 shadow-2xl z-10 transition-transform duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-brand-orange-500" />
                <span className="text-base font-black text-slate-800">لوحة الإشراف</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3.5 px-5 py-4 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all font-semibold"
              >
                <Home className="w-5 h-5" />
                <span>عرض المتجر</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-5 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-right"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
export default AdminLayout;
