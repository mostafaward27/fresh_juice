import React from 'react';
import * as Icons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  color?: 'orange' | 'green' | 'blue' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  color = 'orange'
}) => {
  const IconComponent = (Icons as any)[icon] || Icons.TrendingUp;

  const colorThemes = {
    orange: {
      bg: 'bg-brand-orange-50/50 border-brand-orange-100/50',
      iconBg: 'bg-brand-orange-500 text-white shadow-brand-orange-500/20',
      text: 'text-brand-orange-600'
    },
    green: {
      bg: 'bg-brand-green-50/50 border-brand-green-100/50',
      iconBg: 'bg-brand-green-500 text-white shadow-brand-green-500/20',
      text: 'text-brand-green-600'
    },
    blue: {
      bg: 'bg-sky-50/50 border-sky-100/50',
      iconBg: 'bg-sky-500 text-white shadow-sky-500/20',
      text: 'text-sky-600'
    },
    purple: {
      bg: 'bg-indigo-50/50 border-indigo-100/50',
      iconBg: 'bg-indigo-500 text-white shadow-indigo-500/20',
      text: 'text-indigo-600'
    }
  };

  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    down: 'text-rose-600 bg-rose-50 border-rose-100',
    neutral: 'text-slate-500 bg-slate-50 border-slate-100'
  };

  return (
    <div className={`p-6 border rounded-[30px] bg-white/70 backdrop-blur-md shadow-premium flex flex-col justify-between ${colorThemes[color].bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-slate-400 text-xs font-bold block mb-1">{title}</span>
          <span className="text-3xl font-black text-slate-800 number-font">{value}</span>
        </div>
        <div className={`p-3.5 rounded-2xl shadow-lg ${colorThemes[color].iconBg}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100/50">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border number-font ${trendColors[changeType]}`}>
            {change}
          </span>
          <span className="text-[10px] font-bold text-slate-400">مقارنة بالأسبوع الماضي</span>
        </div>
      )}
    </div>
  );
};
export default StatCard;
