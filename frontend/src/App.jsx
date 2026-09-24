import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AnomaliesPage from './pages/AnomaliesPage';
import PredictionPage from './pages/PredictionPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';

import { 
  getHealth, 
  getDatasets, 
  getSummary, 
  getCategories, 
  getMonthly, 
  getPaymentModes, 
  getDaily, 
  getAnomalies, 
  getPrediction, 
  getInsights 
} from './services/api';

import { 
  LayoutDashboard, 
  UploadCloud, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  BrainCircuit, 
  Info,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [datasets, setDatasets] = useState([]);
  
  // Analytics State
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [paymentModes, setPaymentModes] = useState(null);
  const [daily, setDaily] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [insights, setInsights] = useState(null);

  // Status State
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      const res = await getHealth();
      setApiHealthy(res.status === 'healthy');
    } catch {
      setApiHealthy(false);
    }
  }, []);

  // Fetch datasets list
  const fetchDatasetsList = useCallback(async () => {
    try {
      const list = await getDatasets();
      setDatasets(list);
      if (list.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(list[0].id);
      }
    } catch (err) {
      console.warn("Could not load datasets list:", err);
    }
  }, [selectedDatasetId]);

  // Load all analytics data for the active dataset
  const loadAnalyticsData = useCallback(async (datasetId = selectedDatasetId) => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const [
        sumData,
        catData,
        monthData,
        payData,
        dayData,
        anomData,
        predData,
        insData
      ] = await Promise.all([
        getSummary(datasetId),
        getCategories(datasetId),
        getMonthly(datasetId),
        getPaymentModes(datasetId),
        getDaily(datasetId),
        getAnomalies(datasetId, 0.03),
        getPrediction(datasetId),
        getInsights(datasetId)
      ]);

      setSummary(sumData);
      setCategories(catData);
      setMonthly(monthData);
      setPaymentModes(payData);
      setDaily(dayData);
      setAnomalies(anomData);
      setPrediction(predData);
      setInsights(insData);
      setApiHealthy(true);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedDatasetId]);

  // Initial mount
  useEffect(() => {
    checkHealth();
    fetchDatasetsList();
    loadAnalyticsData();
  }, []);

  // When selectedDatasetId changes
  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
    loadAnalyticsData(id);
  };

  // Upload handler
  const handleUploadSuccess = (newDatasetId) => {
    fetchDatasetsList();
    setSelectedDatasetId(newDatasetId);
    loadAnalyticsData(newDatasetId);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        datasets={datasets}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={handleSelectDataset}
        onNavigate={setActiveTab}
        onRefresh={() => loadAnalyticsData(selectedDatasetId)}
        isRefreshing={isRefreshing}
        apiHealthy={apiHealthy}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Notice: {errorMsg}</span>
              </div>
              <button
                onClick={() => loadAnalyticsData(selectedDatasetId)}
                className="underline hover:text-white ml-4 font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-300">
                Loading SmartSpend AI Analytics Engine...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
              {activeTab === 'dashboard' && (
                <DashboardPage
                  summary={summary}
                  categories={categories}
                  monthly={monthly}
                  paymentModes={paymentModes}
                  anomalies={anomalies}
                  prediction={prediction}
                  insights={insights}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'upload' && (
                <UploadPage
                  onUploadSuccess={handleUploadSuccess}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsPage
                  summary={summary}
                  categories={categories}
                  monthly={monthly}
                  paymentModes={paymentModes}
                  daily={daily}
                />
              )}
              {activeTab === 'anomalies' && <AnomaliesPage anomalies={anomalies} />}
              {activeTab === 'prediction' && <PredictionPage prediction={prediction} />}
              {activeTab === 'insights' && <InsightsPage insights={insights} />}
              {activeTab === 'about' && <AboutPage />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden border-t border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-2 flex items-center justify-around z-20 text-[10px]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'upload' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'anomalies' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Anomalies</span>
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'prediction' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Forecast</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'insights' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Insights</span>
        </button>
      </nav>
    </div>
  );
}
