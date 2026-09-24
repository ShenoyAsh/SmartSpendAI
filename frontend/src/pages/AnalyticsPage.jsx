import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  CreditCard, 
  Layers, 
  TrendingUp,
  Receipt,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', 
  '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6', 
  '#3b82f6', '#a855f7'
];

export default function AnalyticsPage({ 
  summary, 
  categories, 
  monthly, 
  paymentModes, 
  daily 
}) {
  const [activeTab, setActiveTab] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const catList = categories?.categories || [];
  const monthlyList = monthly?.monthly || [];
  const paymentList = paymentModes?.payment_modes || [];
  const dailyList = daily?.daily || [];

  const filteredCategories = catList.filter(c => 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Comprehensive Expense Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical distributions, multi-channel payment breakdowns, and temporal spending curves.
          </p>
        </div>

        {/* Analytical Sub-tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Category Analysis
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Trends
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'payment' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Payment Channels
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'daily' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Velocity
          </button>
        </div>
      </div>

      {/* Summary Distribution Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Median Tx</span>
          <p className="text-base font-bold text-white mt-0.5">{formatCurrency(summary?.median_transaction)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Std Deviation</span>
          <p className="text-base font-bold text-indigo-400 mt-0.5">{formatCurrency(summary?.std_deviation)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Min Single Tx</span>
          <p className="text-base font-bold text-emerald-400 mt-0.5">{formatCurrency(summary?.min_transaction)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Max Single Tx</span>
          <p className="text-base font-bold text-rose-400 mt-0.5">{formatCurrency(summary?.max_transaction)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Daily Average</span>
          <p className="text-base font-bold text-amber-400 mt-0.5">{formatCurrency(daily?.average_daily_spending)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Active Categories</span>
          <p className="text-base font-bold text-cyan-400 mt-0.5">{summary?.unique_categories || 0}</p>
        </div>
      </div>

      {/* 1. Category Tab View */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart (2 cols) */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Expenditure by Category</h3>
                  <p className="text-xs text-slate-400">Total spending across categorized expenses</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  Highest: {categories?.highest_category} ({formatCurrency(categories?.highest_amount)})
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={catList} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="category" 
                      stroke="#64748b" 
                      fontSize={11} 
                      angle={-20} 
                      textAnchor="end" 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false} 
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                              <p className="font-bold text-white">{data.category}</p>
                              <p className="text-indigo-400 font-semibold">Spend: {formatCurrency(data.total_amount)}</p>
                              <p className="text-slate-400">Share: {data.percentage}%</p>
                              <p className="text-slate-400">Count: {data.transaction_count} tx (avg {formatCurrency(data.average_amount)})</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="total_amount" radius={[6, 6, 0, 0]}>
                      {catList.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart (1 col) */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Budget Proportions</h3>
                <p className="text-xs text-slate-400">Percentage distribution of total funds</p>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={catList}
                      dataKey="total_amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {catList.map((entry, index) => (
                        <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs">
                              <p className="font-bold text-white">{data.category}</p>
                              <p className="text-indigo-400">{formatCurrency(data.total_amount)} ({data.percentage}%)</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                {catList.map((c, i) => (
                  <div key={c.category} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                      <span className="text-slate-300 truncate">{c.category}</span>
                    </div>
                    <span className="text-slate-400 font-semibold">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Summary Table */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Category Granular Breakdown</h3>
                <p className="text-xs text-slate-400">Transaction counts, total volumes, and average basket sizes</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[10px] text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total Spending</th>
                    <th className="py-3 px-4">Contribution %</th>
                    <th className="py-3 px-4">Transactions</th>
                    <th className="py-3 px-4">Average per Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCategories.map((c) => (
                    <tr key={c.category} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{c.category}</td>
                      <td className="py-3 px-4 font-medium text-indigo-300">{formatCurrency(c.total_amount)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(c.percentage, 100)}%` }}></div>
                          </div>
                          <span>{c.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{c.transaction_count}</td>
                      <td className="py-3 px-4 text-slate-300">{formatCurrency(c.average_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Monthly Trends Tab View */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
              <span className="text-emerald-400 font-semibold uppercase">Highest Spending Month</span>
              <p className="text-xl font-bold text-white mt-1">{monthly?.highest_month}</p>
              <p className="text-slate-400 mt-0.5">{formatCurrency(monthly?.highest_amount)}</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
              <span className="text-cyan-400 font-semibold uppercase">Lowest Spending Month</span>
              <p className="text-xl font-bold text-white mt-1">{monthly?.lowest_month}</p>
              <p className="text-slate-400 mt-0.5">{formatCurrency(monthly?.lowest_amount)}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Chronological Monthly Spending & MoM Variance</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyList} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month_label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-white">{d.month_label}</p>
                            <p className="text-violet-400 font-semibold">Total: {formatCurrency(d.total_amount)}</p>
                            <p className="text-slate-400">Transactions: {d.transaction_count} (avg {formatCurrency(d.average_amount)})</p>
                            <p className={d.mom_change_pct >= 0 ? 'text-rose-400' : 'text-emerald-400'}>
                              MoM Change: {d.mom_change_pct >= 0 ? '+' : ''}{d.mom_change_pct}% ({formatCurrency(d.mom_change_amount)})
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="total_amount" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#monthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Shift Table */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Monthly Transaction & Shift History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[10px] text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Total Spending</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Avg Transaction</th>
                    <th className="py-3 px-4">MoM Difference</th>
                    <th className="py-3 px-4">MoM % Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {monthlyList.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{m.month_label}</td>
                      <td className="py-3 px-4 font-medium text-violet-300">{formatCurrency(m.total_amount)}</td>
                      <td className="py-3 px-4">{m.transaction_count}</td>
                      <td className="py-3 px-4">{formatCurrency(m.average_amount)}</td>
                      <td className={`py-3 px-4 font-medium ${
                        m.mom_change_amount > 0 ? 'text-rose-400' : m.mom_change_amount < 0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {m.mom_change_amount > 0 ? '+' : ''}{formatCurrency(m.mom_change_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          m.mom_change_pct > 0 
                            ? 'bg-rose-500/15 text-rose-400' 
                            : m.mom_change_pct < 0 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {m.mom_change_pct > 0 ? '+' : ''}{m.mom_change_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Payment Channels Tab View */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Payment Channel Volume Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentList} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="payment_mode" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1">
                              <p className="font-bold text-white">{d.payment_mode}</p>
                              <p className="text-cyan-400">Total: {formatCurrency(d.total_amount)} ({d.percentage}%)</p>
                              <p className="text-slate-400">{d.transaction_count} tx (avg {formatCurrency(d.average_amount)})</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="total_amount" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Payment Channel Breakdown</h3>
                <p className="text-xs text-slate-400">Transaction counts and average ticket sizes per mode</p>
              </div>

              <div className="space-y-3">
                {paymentList.map((pm, i) => (
                  <div key={pm.payment_mode} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-white">{pm.payment_mode}</span>
                      </div>
                      <p className="text-slate-400">{pm.transaction_count} transactions (avg {formatCurrency(pm.average_amount)})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-cyan-400">{formatCurrency(pm.total_amount)}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{pm.percentage}% of spend</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 pt-2">
                Primary payment channel: <strong className="text-white">{paymentModes?.preferred_mode}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Daily Spending Tab View */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
              <span className="text-amber-400 font-semibold uppercase">Daily Average Spending</span>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(daily?.average_daily_spending)}</p>
              <p className="text-slate-400 mt-0.5">Baseline spending rate per active calendar day</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs">
              <span className="text-rose-400 font-semibold uppercase">Peak Expenditure Day</span>
              <p className="text-xl font-bold text-white mt-1">{daily?.highest_spending_day}</p>
              <p className="text-slate-400 mt-0.5">Single day spend: {formatCurrency(daily?.highest_day_amount)}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Daily Spending Trajectory</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyList} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-white">{d.date}</p>
                            <p className="text-amber-400 font-semibold">Total: {formatCurrency(d.total_amount)}</p>
                            <p className="text-slate-400">{d.transaction_count} transaction(s)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="total_amount" stroke="#f59e0b" strokeWidth={2} fill="url(#dailyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
