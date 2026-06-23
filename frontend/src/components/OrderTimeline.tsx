import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, Truck, CheckCircle2 } from 'lucide-react';
import type { OrderStatus } from '../types/types';

interface OrderTimelineProps {
  status: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const steps = [
    {
      key: 'received' as OrderStatus,
      label: 'تم استلام الطلب',
      desc: 'تم استلام طلبك وبانتظار التأكيد',
      icon: ClipboardList
    },
    {
      key: 'preparing' as OrderStatus,
      label: 'جاري التجهيز',
      desc: 'نقوم بتحضير مشروباتك المشبرة الفريش',
      icon: ChefHat
    },
    {
      key: 'delivering' as OrderStatus,
      label: 'جاري التوصيل',
      desc: 'السائق في الطريق إليك الآن',
      icon: Truck
    },
    {
      key: 'completed' as OrderStatus,
      label: 'تم التسليم',
      desc: 'تم تسليم الطلب، بالهناء والشفاء! 🍹',
      icon: CheckCircle2
    }
  ];

  // Helper to determine status order
  const getStatusIndex = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'delivering': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="flex flex-col w-full gap-8 relative select-none">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div key={step.key} className="flex gap-4 relative">
            {/* Step Icon Capsule */}
            <div className="flex flex-col items-center z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isDone || isActive ? '#ff7e5f' : '#f1f5f9',
                  color: isDone || isActive ? '#ffffff' : '#94a3b8'
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                  isActive ? 'border-orange-200' : 'border-white'
                } shadow-md transition-all duration-300`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div className="w-1 h-16 bg-slate-100 absolute top-12 right-[22px] -z-10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ height: '0%' }}
                    animate={{ height: isDone ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-gradient-to-b from-brand-orange-500 to-orange-400"
                  />
                </div>
              )}
            </div>

            {/* Step text */}
            <div className="flex flex-col justify-center text-right pr-2">
              <h5 className={`font-bold text-base transition-colors duration-300 ${
                isActive ? 'text-brand-orange-500 text-lg' : isDone ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {step.label}
              </h5>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isActive ? 'text-slate-600' : isDone ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default OrderTimeline;
