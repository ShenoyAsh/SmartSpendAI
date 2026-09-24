import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  BrainCircuit, 
  Info,
  Compass
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'upload', label: 'Upload Dataset', icon: UploadCloud, badge: null },
  { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3, badge: null },
  { id: 'anomalies', label: 'Anomaly Detection', icon: AlertTriangle, badge: 'ML' },
  { id: 'prediction', label: 'Spending Prediction', icon: TrendingUp, badge: 'AI' },
  { id: 'insights', label: 'AI Insights', icon: BrainCircuit, badge: 'Smart' },
  { id: 'landing', label: 'Project Overview', icon: Compass, badge: null },
  { id: 'about', label: 'About & Report', icon: Info, badge: null },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="w-64 shrink-0 bg-slate-950/70 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Analytics Modules
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Academic Internship Info Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            <span>IBM SkillsBuild</span>
          </div>
          <p className="text-slate-300 font-medium">
            Data Analytics with AI Internship
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Machine Learning anomaly detection and spending forecasting for intelligent financial governance.
          </p>
        </div>
      </div>

      {/* Version badge */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 px-2">
        <span>SmartSpend v1.0.0</span>
        <span className="text-emerald-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>FastAPI</span>
        </span>
      </div>
    </aside>
  );
}
