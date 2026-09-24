import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  AlertTriangle, 
  TrendingUp, 
  BrainCircuit, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import StatCard from '../components/StatCard';

const CATEGORY_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', 
  '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6'
];

export default function DashboardPage({ 
  summary, 
  categories, 
  monthly, 
  paymentModes, 
  anomalies, 
  prediction, 
  insights,
  onNavigate 
}) {
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const monthlyData = monthly?.monthly || [];
  const categoryData = categories?.categories || [];
  const paymentData = paymentModes?.payment_modes || [];
  const anomalyList = anomalies?.anomalies?.slice(0, 4) || [];

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Analytics Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {summary?.start_date && summary?.end_date 
                ? `Active Period: ${summary.start_date} to ${summary.end_date}`
                : 'Showing active transaction dataset'}
            </span>
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('prediction')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Forecast: {formatCurrency(prediction?.predicted_amount)}</span>
          </button>
          <button
            onClick={() => onNavigate('anomalies')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{anomalies?.total_anomalies || 0} Outliers</span>
          </button>
        </div>
      </div>

      {/* 1. Top 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spending"
          value={formatCurrency(summary?.total_spending)}
          subtitle={`${summary?.unique_categories || 0} active categories`}
          icon={DollarSign}
          trend={monthly?.monthly?.length ? `${monthly.monthly.length} Months Active` : null}
          color="indigo"
        />
        <StatCard
          title="Average Transaction"
          value={formatCurrency(summary?.average_transaction)}
          subtitle={`Median: ${formatCurrency(summary?.median_transaction)}`}
          icon={Receipt}
          trend={`σ = ${formatCurrency(summary?.std_deviation)}`}
          color="emerald"
        />
        <StatCard
          title="Transactions Processed"
          value={summary?.transaction_count?.toLocaleString() || '0'}
          subtitle={`Max single: ${formatCurrency(summary?.max_transaction)}`}
          icon={CreditCard}
          trend={`${summary?.unique_payment_methods || 0} Payment Modes`}
          color="cyan"
        />
        <StatCard
          title="Unusual Transactions"
          value={anomalies?.total_anomalies || '0'}
          subtitle={`${anomalies?.anomaly_percentage || 0}% of all records`}
          icon={AlertTriangle}
          trend="Isolation Forest"
          trendType={anomalies?.total_anomalies > 0 ? 'warning' : 'positive'}
          color="rose"
        />
      </div>

      {/* 2. Primary Charts Row: Monthly Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Trend (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Monthly Expenditure Trajectory</h2>
              <p className="text-xs text-slate-400">Total spending trend across months</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month_label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{label}</p>
                          <p className="text-indigo-400 font-semibold">Total: {formatCurrency(data.total_amount)}</p>
                          <p className="text-slate-400">{data.transaction_count} transactions (avg {formatCurrency(data.average_amount)})</p>
                          {data.mom_change_pct !== 0 && (
                            <p className={data.mom_change_pct > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                              MoM: {data.mom_change_pct > 0 ? '+' : ''}{data.mom_change_pct}%
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total_amount" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#spendGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (1 col) */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Category Distribution</h2>
              <p className="text-xs text-slate-400">Share of total expenditure</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Top: {categories?.highest_category || 'N/A'}
            </span>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.slice(0, 6)}
                  dataKey="total_amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {categoryData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs">
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

          {/* Mini Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            {categoryData.slice(0, 4).map((c, i) => (
              <div key={c.category} className="flex items-center space-x-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}></span>
                <span className="text-slate-300 truncate">{c.category}</span>
                <span className="text-slate-400 text-[10px] ml-auto">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. AI Insights & Prediction Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Highlights (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-900 border border-indigo-500/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">AI Financial Insights & Health Score</h2>
                <p className="text-xs text-slate-400">Automated synthesis of your spending patterns</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Health Score:</span>
              <span className={`px-2.5 py-1 rounded-lg font-bold text-sm ${
                (insights?.budget_health_score || 80) >= 80 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {insights?.budget_health_score || 85}/100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl leading-relaxed">
            {insights?.summary || "Analyzing expenditure velocity, category weights, and spending anomalies."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {insights?.key_findings?.slice(0, 2).map((finding, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">{finding}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Explore All Recommendations & Risk Alerts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spending Prediction Mini Card (1 col) */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-950/30 via-slate-900/60 to-slate-900 border border-violet-500/20 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">ML Forecast</h2>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Random Forest
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Projected {prediction?.target_period || 'Next Month'}
            </p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(prediction?.predicted_amount)}
            </h3>
            <p className={`text-xs font-medium ${
              (prediction?.percentage_change || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {(prediction?.percentage_change || 0) > 0 ? '▲ ' : '▼ '}
              {Math.abs(prediction?.percentage_change || 0)}% vs monthly avg ({formatCurrency(prediction?.historical_avg_amount)})
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
            {prediction?.message || "Supervised machine learning trained on historical monthly lag series."}
          </div>

          <button
            onClick={() => onNavigate('prediction')}
            className="w-full py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>View Prediction Model Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Payment Modes & Recent Anomalies Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Modes Chart */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Spending by Payment Channel</h2>
              <p className="text-xs text-slate-400">Preferred payment modes across transactions</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Primary: {paymentModes?.preferred_mode || 'UPI'}
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="payment_mode" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={85} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs space-y-0.5">
                          <p className="font-bold text-white">{data.payment_mode}</p>
                          <p className="text-indigo-400">Total: {formatCurrency(data.total_amount)} ({data.percentage}%)</p>
                          <p className="text-slate-400">{data.transaction_count} transactions (avg {formatCurrency(data.average_amount)})</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total_amount" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Unusual Transactions (Anomalies Preview) */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Flagged Unusual Transactions</h2>
              <p className="text-xs text-slate-400">Detected by Scikit-Learn Isolation Forest</p>
            </div>
            <button
              onClick={() => onNavigate('anomalies')}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <span>View All ({anomalies?.total_anomalies || 0})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {anomalyList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No unusual outliers detected.</p>
            ) : (
              anomalyList.map((anom, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white truncate">{anom.category}</span>
                      <span className="text-[10px] text-slate-400">{anom.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{anom.description || anom.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-rose-400">{formatCurrency(anom.amount)}</span>
                    <p className="text-[10px] text-rose-300/80">Score: {anom.anomaly_score}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            Note: Flagged as statistically unusual based on category z-scores; not an indicator of fraud.
          </p>
        </div>
      </div>
    </div>
  );
}
