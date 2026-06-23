import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAntiGravity } from '../context/AntiGravityContext';
import { useToast } from '../components/ui/Toast';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const { isAntiGravityActive, toggleAntiGravity } = useAntiGravity();
  const { showToast } = useToast();

  const handleToggle = () => {
    toggleAntiGravity();
    if (!isAntiGravityActive) {
      showToast('🚀 تم تفعيل وضعية مضاد الجاذبية! استمتع بمشروباتك وهي تطفو!', 'success');
    } else {
      showToast('🪐 تم إيقاف وضعية مضاد الجاذبية وعادت الجاذبية لطبيعتها.', 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
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
              : 'bg-white/80 text-slate-600 hover:text-brand-orange-500 border-slate-200 shadow-slate-200/50'
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

      <Footer />
    </div>
  );
};

export default MainLayout;
