import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl animate-bounce">🍹</span>
              <span className="text-2xl font-black text-white">مشروبات مشبرة</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mt-2">
              أفضل العصائر والمشروبات الباردة والمشبرة المصنوعة بجودة فائقة وطعم لا يُنسى. انتعاشك الصيفي يبدأ من هنا.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-brand-orange-500 text-slate-400 hover:text-white rounded-xl transition-all duration-300" title="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-brand-orange-500 text-slate-400 hover:text-white rounded-xl transition-all duration-300" title="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-brand-orange-500 text-slate-400 hover:text-white rounded-xl transition-all duration-300" title="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-brand-orange-500">
              روابط سريعة
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-orange-500 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-brand-orange-500 transition-colors">منيو المشروبات</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-orange-500 transition-colors">سلة المشتريات</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-orange-500 transition-colors">ملفي الشخصي</Link>
              </li>
            </ul>
          </div>

          {/* Categories Shortcuts */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-brand-orange-500">
              تصنيفاتنا
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li>
                <Link to="/menu?category=juices" className="hover:text-brand-orange-500 transition-colors">عصائر طبيعية فريش</Link>
              </li>
              <li>
                <Link to="/menu?category=cocktails" className="hover:text-brand-orange-500 transition-colors">كوكتيلات باردة ومبتكرة</Link>
              </li>
              <li>
                <Link to="/menu?category=cold-coffee" className="hover:text-brand-orange-500 transition-colors">قهوة باردة ومثلجة</Link>
              </li>
              <li>
                <Link to="/menu?category=specials" className="hover:text-brand-orange-500 transition-colors">مشروبات مشبرة خاصة</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-brand-orange-500">
              تواصل معنا
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange-500 flex-shrink-0 mt-0.5" />
                <span>12 شارع التحرير، الدقي، الجيزة، مصر</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-orange-500 flex-shrink-0" />
                <span className="number-font" dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange-500 flex-shrink-0" />
                <span>info@mshabar.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} مشروبات مشبرة. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-orange-500 transition-colors">شروط الاستخدام</a>
            <a href="#" className="hover:text-brand-orange-500 transition-colors">سياسة الخصوصية</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
