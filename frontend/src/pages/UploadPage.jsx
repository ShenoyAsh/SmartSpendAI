import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Info,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { uploadDataset } from '../services/api';

export default function UploadPage({ onUploadSuccess, onNavigate }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setErrorMsg(null);
      } else {
        setErrorMsg('Please select a valid CSV (.csv) file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setErrorMsg(null);
      } else {
        setErrorMsg('Please select a valid CSV (.csv) file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('Please choose a CSV file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const data = await uploadDataset(file);
      setUploadResult(data);
      if (onUploadSuccess) {
        onUploadSuccess(data.dataset_id);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to process CSV file.';
      setErrorMsg(detail);
    } finally {
      setIsUploading(false);
    }
  };

  // One-click demo loader uses a generated client-side file representation of sample_transactions
  const handleLoadSampleData = async () => {
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const sampleCsv = `Date,Category,Amount,Payment_Mode,Description
2025-01-02,Food & Dining,280.00,UPI,Office Cafeteria Lunch
2025-01-03,Transportation,95.00,UPI,Metro Smartcard Recharge
2025-01-05,Groceries,1450.00,Debit Card,Supermarket Weekly Groceries
2025-01-08,Bills & Utilities,2200.00,Net Banking,Electricity Power Bill
2025-01-12,Shopping,3200.00,Credit Card,Amazon Online Shopping
2025-01-18,Entertainment,450.00,UPI,BookMyShow Cinema Tickets
2025-01-22,Healthcare,750.00,UPI,Apollo Pharmacy Medicines
2025-02-02,Food & Dining,350.00,UPI,Swiggy Dinner Order
2025-02-05,Groceries,1890.00,Debit Card,Fresh Vegetables & Dairy
2025-02-14,Entertainment,1200.00,Credit Card,Weekend Restaurant Dinner
2025-02-18,Transportation,350.00,UPI,Uber Ride to City
2025-03-01,Bills & Utilities,1499.00,UPI,Broadband Wi-Fi Bill
2025-03-08,Shopping,2100.00,Credit Card,Apparel & Clothing Store
2025-03-15,Healthcare,500.00,Cash,Doctor Consultation Clinic
2025-04-18,Shopping,48500.00,Credit Card,Luxury Flagship Smartphone & Earbuds Purchase
2025-05-02,Food & Dining,410.00,UPI,Zomato Food Order
2025-05-10,Groceries,2150.00,Debit Card,Monthly Provision Supplies
2025-06-05,Transportation,120.00,UPI,Ola Auto Ride
2025-06-15,Bills & Utilities,2800.00,Net Banking,Summer AC Electricity Bill
2025-07-22,Healthcare,34500.00,Net Banking,Emergency Hospitalization Dental Root Canal & Surgery
2025-08-04,Groceries,1680.00,UPI,Supermarket Provisions
2025-09-02,Education,1850.00,UPI,Udemy Technical Certification Course
2025-10-12,Entertainment,26800.00,Credit Card,VIP Music Festival International Weekend Passes
2025-11-28,Shopping,41200.00,Credit Card,Black Friday Mega Deal 4K Smart OLED Television
2025-12-24,Food & Dining,18900.00,Credit Card,Year-End Corporate Family Celebration Banquet Party`;

      const blob = new Blob([sampleCsv], { type: 'text/csv' });
      const sampleFile = new File([blob], 'sample_transactions_demo.csv', { type: 'text/csv' });
      const data = await uploadDataset(sampleFile);
      setUploadResult(data);
      if (onUploadSuccess) {
        onUploadSuccess(data.dataset_id);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Failed to load sample dataset.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Upload Expense Dataset</h1>
        <p className="text-sm text-slate-400">
          Upload any personal expense transaction CSV. The system automatically standardizes headers, 
          cleans formatting, eliminates duplicates, and prepares data for AI models.
        </p>
      </div>

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]' 
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {file ? file.name : 'Choose CSV file or drag and drop here'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {file 
                ? `${(file.size / 1024).toFixed(1)} KB — Ready to process` 
                : 'Supports files with Date, Category, Amount, Payment_Mode, and Description'}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 pt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              CSV Format
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              Max 5 MB
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              Auto-Cleaning
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
        >
          {isUploading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing & Cleaning...</span>
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4" />
              <span>Upload & Process Dataset</span>
            </>
          )}
        </button>

        <button
          onClick={handleLoadSampleData}
          disabled={isUploading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-sm font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Load Curated Demo Data</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-200">Validation Notice</p>
            <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Preprocessing Summary Result */}
      {uploadResult && (
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Dataset Successfully Preprocessed & Ingested</h3>
              <p className="text-xs text-emerald-300/80">{uploadResult.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">Valid Transactions</span>
              <p className="text-lg font-bold text-white mt-0.5">{uploadResult.valid_rows}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">Duplicates Removed</span>
              <p className="text-lg font-bold text-white mt-0.5">{uploadResult.duplicates_removed}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">Missing Cleaned</span>
              <p className="text-lg font-bold text-white mt-0.5">{uploadResult.missing_handled}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">Total Expenditure</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">
                ₹{uploadResult.total_amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
            >
              <span>View In Analytics Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* CSV Column Mapping Guide */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Info className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Intelligent Flexible Column Mapping
          </h4>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The preprocessing engine automatically resolves headers with different naming conventions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-indigo-300">Date Header:</span>
            <p className="text-slate-400">Recognizes: <code className="text-slate-300">Date, transaction_date, tx_date, timestamp</code></p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-indigo-300">Amount Header:</span>
            <p className="text-slate-400">Recognizes: <code className="text-slate-300">Amount, transaction_amount, amt, spent, cost</code></p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-indigo-300">Category Header:</span>
            <p className="text-slate-400">Recognizes: <code className="text-slate-300">Category, expense_category, cat, type</code></p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-indigo-300">Payment Mode Header:</span>
            <p className="text-slate-400">Recognizes: <code className="text-slate-300">Payment_Mode, mode, channel, payment_method</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
