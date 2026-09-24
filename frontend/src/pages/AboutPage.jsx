import React from 'react';
import { 
  Info, 
  Award, 
  GraduationCap, 
  Code, 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold uppercase">
          <Award className="w-3.5 h-3.5" />
          <span>Academic Internship Project Submission</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SmartSpend AI — Intelligent Personal Expense Analytics & Anomaly Detection
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          IBM SkillsBuild Data Analytics with AI Academic Internship Program.
        </p>
      </div>

      {/* Internship & Candidate Profile Card */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900 border border-indigo-500/20 p-6 md:p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Project Identity & Evaluation Metadata</h2>
            <p className="text-xs text-slate-400">Student & Program Documentation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-medium">Candidate Name</span>
            <span className="text-base font-bold text-white mt-0.5 block">Ashwini</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-medium">Program</span>
            <span className="text-base font-bold text-indigo-300 mt-0.5 block">IBM SkillsBuild Internship</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-medium">Domain</span>
            <span className="text-base font-bold text-emerald-300 mt-0.5 block">Data Analytics with AI</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-medium">Project Code</span>
            <span className="text-base font-bold text-violet-300 mt-0.5 block">SmartSpend-AI</span>
          </div>
        </div>
      </div>

      {/* Technical Architecture Overview */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-white">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold">End-to-End System Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Layer 1: Client */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Presentation Tier</h3>
            <p className="text-slate-400 leading-relaxed">
              <strong>React 19 + Vite:</strong> Ultra-fast responsive single-page application styled with Tailwind CSS.
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong>Recharts:</strong> Interactive SVG rendering for category distributions, monthly curves, payment modes, and prediction charts.
            </p>
          </div>

          {/* Layer 2: API & Analytics Core */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Application Core Tier</h3>
            <p className="text-slate-400 leading-relaxed">
              <strong>FastAPI + Pydantic:</strong> High-throughput asynchronous REST API with automatic schema validation and serialization.
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong>Pandas & NumPy:</strong> High-performance vector calculations for descriptive statistics, data cleaning, and temporal aggregations.
            </p>
          </div>

          {/* Layer 3: ML & Persistence */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. AI & Persistence Tier</h3>
            <p className="text-slate-400 leading-relaxed">
              <strong>Scikit-Learn:</strong> Isolation Forest for unsupervised outlier surveillance and Random Forest Regressor for spending forecasts.
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong>SQLAlchemy + PostgreSQL:</strong> Relational schema managing datasets, transactions, anomalies, and prediction records with automatic SQLite fallback.
            </p>
          </div>
        </div>
      </div>

      {/* Viva / Oral Defense Questions Cheat-Sheet */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-5">
        <div className="flex items-center space-x-2 text-white">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold">Key Viva Defense Concepts for Final-Year Evaluation</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-indigo-300">Q: Why did you choose Isolation Forest over basic standard deviation / Z-Score alone?</h4>
            <p className="text-slate-300 leading-relaxed">
              Standard deviation assumes normal Gaussian distribution, whereas financial expense transactions have heavy right-skewed tails and multi-modal clustering across different categories. Isolation Forest does not require parametric distribution assumptions; it recursively partitions the feature space, isolating sparse outliers with shorter tree path lengths.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-indigo-300">Q: Why use Random Forest Regression instead of Linear Regression for spending forecasting?</h4>
            <p className="text-slate-300 leading-relaxed">
              Personal expenses frequently exhibit non-linear shifts, seasonal variations, and category volatility. A Random Forest ensemble aggregates predictions across multiple de-correlated decision trees, reducing variance and maintaining resilience against single-month outlier events.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-indigo-300">Q: How does the system handle missing values, duplicates, and varied CSV column headers?</h4>
            <p className="text-slate-300 leading-relaxed">
              The preprocessing service implements canonical alias mapping (supporting variations like <code>Amount, transaction_amount, amt, spent</code>), parses multiple date formats, filters zero/negative amounts, imputes missing categorical fields, and drops duplicate transaction tuples.
            </p>
          </div>
        </div>
      </div>

      {/* Artifact Deliverables Information */}
      <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Project Deliverables & Artifacts</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-white block">Jupyter Notebook:</span>
            <code className="text-indigo-400 text-[11px] block mt-1">notebook/Ashwini_SmartSpendAI.ipynb</code>
            <p className="text-slate-400 mt-1 text-[11px]">23-section end-to-end EDA, model training, and evaluation notebook.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-white block">Project Report:</span>
            <code className="text-indigo-400 text-[11px] block mt-1">Ashwini_SmartSpendAI_ProjectReport.docx</code>
            <p className="text-slate-400 mt-1 text-[11px]">37-section comprehensive academic report formatted for IBM SkillsBuild evaluation.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-white block">Sample Dataset:</span>
            <code className="text-indigo-400 text-[11px] block mt-1">data/sample_transactions.csv</code>
            <p className="text-slate-400 mt-1 text-[11px]">370 transactions spanning 12 months with calibrated outlier injections.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
