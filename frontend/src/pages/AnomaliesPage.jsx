import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function AnomaliesPage({ anomalies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const anomList = anomalies?.anomalies || [];
  const totalAnomalies = anomalies?.total_anomalies || 0;
  const anomalyPct = anomalies?.anomaly_percentage || 0;
  const totalTx = anomalies?.total_transactions || 0;

  // Categories list for filter
  const uniqueCategories = ['All', ...new Set(anomList.map(a => a.category))];

  const filteredAnomalies = anomList.filter(a => {
    const matchesSearch = 
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Unusual Transaction & Anomaly Detection</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning surveillance using Scikit-Learn Isolation Forest to detect statistical expenditure spikes.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">
            {totalAnomalies} Outliers Flagged ({anomalyPct}%)
          </span>
        </div>
      </div>

      {/* Model Explainability / Academic Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-slate-900 border border-rose-500/20 text-xs space-y-3">
        <div className="flex items-center space-x-2 text-rose-300 font-bold">
          <Info className="w-4 h-4" />
          <span>Academic Note: Understanding Isolation Forest Anomaly Detection</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Isolation Forest is an unsupervised tree-based ensemble algorithm. Instead of modeling normal instances, 
          it explicitly isolates anomalies. Because outliers require fewer random partitioning splits in the feature space, 
          they produce significantly shorter average tree path lengths. We combine raw amounts, category-relative z-scores, 
          and temporal signals to flag potential anomalies.
        </p>
        <p className="text-slate-400 text-[11px] italic">
          Important: SmartSpend AI identifies statistically unusual transactions for user review. It never classifies transactions as fraud or illegal activity.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Anomalies</span>
          <p className="text-2xl font-extrabold text-rose-400">{totalAnomalies}</p>
          <p className="text-[11px] text-slate-400">Transactions exceeding isolation threshold</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Contamination Ratio</span>
          <p className="text-2xl font-extrabold text-amber-400">{anomalyPct}%</p>
          <p className="text-[11px] text-slate-400">Proportion of dataset flagged as outliers</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Baseline Volume</span>
          <p className="text-2xl font-extrabold text-emerald-400">{totalTx - totalAnomalies}</p>
          <p className="text-[11px] text-slate-400">Transactions adhering to normal spending bounds</p>
        </div>
      </div>

      {/* Outlier Chart */}
      {anomList.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Unusual Transaction Value Distribution</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomList} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1 shadow-2xl max-w-xs">
                          <p className="font-bold text-white">{d.category} — {d.date}</p>
                          <p className="text-rose-400 font-semibold text-sm">Amount: {formatCurrency(d.amount)}</p>
                          <p className="text-slate-400">Paid via: {d.payment_mode}</p>
                          <p className="text-slate-300 italic pt-1 border-t border-slate-800">{d.reason}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search anomaly by category, description or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Detailed Anomaly Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Detected Unusual Transactions</h3>
          <span className="text-xs text-slate-400">Showing {filteredAnomalies.length} record(s)</span>
        </div>

        {filteredAnomalies.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-white">No Unusual Spikes Match Criteria</p>
            <p className="text-xs text-slate-400">All recorded transactions align with standard spending patterns.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[10px] text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Outlier Severity</th>
                  <th className="py-3 px-4">Explainable Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAnomalies.map((a, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-300">{a.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{a.category}</td>
                    <td className="py-3.5 px-4 font-extrabold text-rose-400">{formatCurrency(a.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-300">{a.payment_mode}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[180px] truncate">{a.description || 'Personal Expense'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full" 
                            style={{ width: `${Math.min(a.anomaly_score * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-rose-400">{a.anomaly_score}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[280px]">
                      <span className="p-1 px-2 rounded bg-rose-950/30 text-rose-200 border border-rose-500/20 text-[11px] block leading-relaxed">
                        {a.reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
