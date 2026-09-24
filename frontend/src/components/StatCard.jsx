import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', // 'positive', 'negative', 'neutral', 'warning'
  color = 'indigo' 
}) {
  const colorStyles = {
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      borderHover: 'hover:border-indigo-500/30',
      glow: 'from-indigo-500/5',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      borderHover: 'hover:border-emerald-500/30',
      glow: 'from-emerald-500/5',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderHover: 'hover:border-amber-500/30',
      glow: 'from-amber-500/5',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderHover: 'hover:border-rose-500/30',
      glow: 'from-rose-500/5',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      borderHover: 'hover:border-cyan-500/30',
      glow: 'from-cyan-500/5',
    }
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 transition-all duration-300 ${style.borderHover} hover:shadow-xl hover:shadow-black/20 group`}>
      {/* Top subtle glow */}
      <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${style.glow} to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${style.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
          <span className="text-slate-400 truncate max-w-[170px]">
            {subtitle}
          </span>
          {trend && (
            <span className={`px-2 py-0.5 rounded font-semibold ${
              trendType === 'positive' 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : trendType === 'negative'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                : trendType === 'warning'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
