import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  ShieldAlert, 
  TrendingUp, 
  BrainCircuit, 
  BarChart3, 
  Database,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 border border-indigo-500/20 p-8 md:p-14 text-center max-w-5xl mx-auto shadow-2xl shadow-indigo-950/30">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IBM SkillsBuild Academic Internship Project</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Intelligent Personal Expense Analytics & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Anomaly Detection</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform raw transaction CSVs into deep financial intelligence with automated data cleaning, 
          Scikit-Learn Isolation Forest outlier detection, and Random Forest expenditure forecasting.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>Launch Analytics Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Upload Expense CSV</span>
          </button>
        </div>

        {/* Highlight Stats Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">Isolation Forest</p>
            <p className="text-xs text-slate-400 mt-0.5">Unsupervised Outlier Detection</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">Random Forest</p>
            <p className="text-xs text-slate-400 mt-0.5">Time-Series Expenditure ML</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">FastAPI</p>
            <p className="text-xs text-slate-400 mt-0.5">High Performance REST Core</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">React + Recharts</p>
            <p className="text-xs text-slate-400 mt-0.5">Interactive Visual Intelligence</p>
          </div>
        </div>
      </div>

      {/* 6 Core Functional Modules */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Core System Modules</h2>
          <p className="text-sm text-slate-400">Everything needed to move from raw statements to decision-ready insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('upload')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Data Preprocessing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardizes multi-format CSVs, auto-detects date and amount formats, removes duplicates, handles missing values, and normalizes categories.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('analytics')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Dimensional Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes descriptive statistics, category distribution, month-over-month shifts, payment channel habits, and daily spending velocity.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('anomalies')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Isolation Forest Anomalies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unsupervised machine learning flags statistically unusual spikes based on category z-scores, amounts, and spending patterns with clear human reasons.
            </p>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('prediction')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Spending Forecasting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Random Forest Regression models lagged historical trends to forecast next-month expenditures accompanied by honest evaluation metrics (MAE, RMSE, R²).
            </p>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => onNavigate('insights')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Financial Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic rule-based intelligence calculates financial health scores, identifies concentration risks, and provides tailored 50/30/20 budget advice.
            </p>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => onNavigate('about')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Full Academic Documentation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with a complete Jupyter EDA notebook (Ashwini_SmartSpendAI.ipynb) and a 30-page formatted Word project report for viva evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
