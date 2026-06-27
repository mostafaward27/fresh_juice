import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAntiGravity } from '../context/AntiGravityContext';
import { useFavorites } from '../context/FavoriteContext';
import { useToast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const { isAntiGravityActive, toggleAntiGravity } = useAntiGravity();
  const { showAuthModal, setShowAuthModal } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    toggleAntiGravity();
    if (!isAntiGravityActive) {
      showToast('🚀 تم تفعيل وضعية مضاد الجاذبية! استمتع بمشروباتك وهي تطفو!', 'success');
    } else {
      showToast('🪐 تم إيقاف وضعية مضاد الجاذبية وعادت الجاذبية لطبيعتها.', 'info');
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    navigate('/login', { state: { from: location } });
  };

  const handleSignUp = () => {
    setShowAuthModal(false);
    navigate('/register', { state: { from: location } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
      
      {/* Floating Anti-Gravity Controller Button */}
      <div className="fixed bottom-6 left-6 z-50 select-none">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2.5 p-4 rounded-full border shadow-xl backdrop-blur-md transition-all duration-500 group ${
            isAntiGravityActive
              ? 'bg-gradient-to-r from-brand-orange-500 to-orange-500 text-white border-brand-orange-400 shadow-orange-500/20'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-brand-orange-500 dark:hover:text-brand-orange-500 border-slate-200 dark:border-slate-800 shadow-slate-200/50 dark:shadow-slate-950/50'
          }`}
          title="وضعية مضاد الجاذبية"
        >
          <motion.div
            animate={isAntiGravityActive ? { 
              y: [0, -6, 0],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Rocket className={`w-5 h-5 ${isAntiGravityActive ? 'fill-white' : ''}`} />
          </motion.div>
          
          <span className="text-xs font-black max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
            {isAntiGravityActive ? 'مضاد الجاذبية: نشط 🪐' : 'تفعيل مضاد الجاذبية 🚀'}
          </span>
        </motion.button>
      </div>

      {/* Favorites Auth Guard Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="حفظ في المفضلة / Save to Favorites"
        size="sm"
      >
        <div className="text-center p-2">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto text-rose-500">
            💖
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mb-6 leading-relaxed">
            Please sign in or create an account to save products to your favorites.
            <br />
            <span className="text-xs text-slate-400 dark:text-slate-500 block mt-2">
              يرجى تسجيل الدخول أو إنشاء حساب لحفظ المنتجات في قائمتك المفضلة.
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleSignIn}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-orange-500 to-orange-500 hover:from-brand-orange-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-sm text-sm transition-all flex-grow cursor-pointer"
            >
              تسجيل الدخول / Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-sm transition-all flex-grow cursor-pointer"
            >
              حساب جديد / Create Account
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default MainLayout;
