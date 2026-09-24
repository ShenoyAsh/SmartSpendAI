import React from 'react';
import { 
  Sparkles, 
  Database, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({ 
  datasets, 
  selectedDatasetId, 
  onSelectDataset, 
  onNavigate, 
  onRefresh,
  isRefreshing,
  apiHealthy 
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">SmartSpend</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              AI Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            IBM SkillsBuild Academic Internship Edition
          </p>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center space-x-3">
        {/* Dataset Selector */}
        {datasets && datasets.length > 0 && (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium hidden md:inline">Dataset:</span>
            <select
              value={selectedDatasetId || ''}
              onChange={(e) => onSelectDataset(e.target.value ? Number(e.target.value) : null)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                  {d.filename} ({d.valid_rows} tx)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh analytics data"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Upload quick button */}
        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload CSV</span>
        </button>

        {/* API Health indicator */}
        <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          {apiHealthy ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 font-medium hidden md:inline">API Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-amber-400 font-medium hidden md:inline">Connecting</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
