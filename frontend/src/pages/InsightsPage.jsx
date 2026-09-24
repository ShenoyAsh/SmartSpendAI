import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Cpu,
  Layers
} from 'lucide-react';

export default function InsightsPage({ insights }) {
  const healthScore = insights?.budget_health_score || 85;
  const keyFindings = insights?.key_findings || [];
  const recommendations = insights?.recommendations || [];
  const riskAlerts = insights?.risk_alerts || [];
  const provider = insights?.provider || "SmartSpend Financial AI Engine";

  const getScoreColor = (score) => {
    if (score >= 85) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Healthy & Disciplined' };
    if (score >= 70) return { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', label: 'Stable with Moderate Variance' };
    return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Elevated Spending Volatility' };
  };

  const scoreStyle = getScoreColor(healthScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            <span>AI Spending Insights & Financial Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized natural-language analytical observations and rule-based budget recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">Engine: {provider}</span>
          </div>
        </div>
      </div>

      {/* Financial Health Score & Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Card (1 col) */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Budget Health Score
          </span>

          <div className={`relative w-36 h-36 rounded-full flex items-center justify-center border-4 ${scoreStyle.border} ${scoreStyle.bg} shadow-2xl`}>
            <div className="text-center">
              <span className={`text-4xl font-black ${scoreStyle.text}`}>
                {healthScore}
              </span>
              <span className="text-xs text-slate-400 block font-medium">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${scoreStyle.bg} ${scoreStyle.text} border ${scoreStyle.border}`}>
              {scoreStyle.label}
            </span>
            <p className="text-[11px] text-slate-400 pt-1">
              Computed from volatility, outlier frequency, and category concentration ratios.
            </p>
          </div>
        </div>

        {/* Executive Synthesis (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-900 border border-indigo-500/20 p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Executive Financial Summary</h3>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            {insights?.summary || "Analyzing expenditure velocity, category weights, and spending anomalies."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <span className="font-semibold text-indigo-400 block mb-1">Deterministic Independence:</span>
              Runs 100% locally with zero requirement for paid API keys or external subscriptions.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <span className="font-semibold text-emerald-400 block mb-1">Explainable Governance:</span>
              Every insight is mathematically derived from your uploaded transaction data.
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings Grid */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-white">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold">Key Analytical Findings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {keyFindings.map((finding, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alerts & Budget Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Alerts */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Identified Risk Alerts</h3>
          </div>

          <div className="space-y-3">
            {riskAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No critical expenditure risks or velocity warnings detected.</p>
            ) : (
              riskAlerts.map((alert, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/25 flex items-start space-x-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                  <p className="text-amber-200/90 leading-relaxed font-medium">{alert}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Actionable Budget Recommendations</h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-emerald-200/90 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
