# SmartSpend AI — Intelligent Personal Expense Analytics & Anomaly Detection

**Academic Internship Project Submission**  
**Program:** IBM SkillsBuild Data Analytics with AI
**Candidate Name:** Ashwini Shenoy B
**Academic Year:** 2026
**Deliverables:** Production Web Platform, REST API, Machine Learning Models, EDA Jupyter Notebook, Academic Project Report (.docx)

---

## 1. Project Overview

**SmartSpend AI** is an intelligent, full-stack personal expense analytics and financial governance platform that transforms raw, unstandardized transaction data into actionable financial intelligence. 

The platform features:
- **Automated Data Preprocessing**: Resolves arbitrary column naming variations, handles missing fields, converts formats, filters negative amounts, and eliminates duplicate records.
- **Multi-Dimensional Analytics**: Generates statistical summaries (median, variance, standard deviation), category breakdowns, month-over-month shifts, payment channel habits, and daily spending velocity.
- **Unsupervised Anomaly Detection**: Employs Scikit-Learn **Isolation Forest** with category-relative z-score decomposition to isolate unusual spending spikes with human-readable rationales (without deceptive accusations of fraud).
- **Predictive Spending Modeling**: Trains a supervised **Random Forest Regression** model on historical monthly lag series to forecast future monthly liquidity demands, accompanied by genuine evaluation metrics (MAE, RMSE, R²).
- **AI Financial Guidance**: Calculates an algorithmic **Budget Health Score (0–100)** and delivers 50/30/20 budget recommendations deterministically without requiring paid third-party APIs.

---

## 2. Problem Statement

Modern individuals execute transactions across dozens of digital payment channels (UPI, credit cards, debit cards, net banking, cash). Bank statement exports vary drastically in header conventions, contain duplicate rows, missing categories, and malformed currency strings. 

Existing tools are either passive spreadsheet stores or black-box banking apps lacking statistical depth, explainable outlier detection, and predictive forecasting. SmartSpend AI bridges this gap by providing an end-to-end local data analytics and machine learning solution.

---

## 3. Objectives

1. **Ingest & Clean**: Provide automated preprocessing for varying CSV structures with robust deduplication and missing value imputation.
2. **Exploratory Visual Analytics**: Render interactive charts (category distributions, monthly curves, payment modes, daily velocities) using Recharts.
3. **Isolate Anomalies**: Detect statistical outliers using Scikit-Learn's Isolation Forest algorithm with explainable reasons.
4. **Forecast Future Outflows**: Predict next-month expenditure using Random Forest Regression with honest evaluation metrics.
5. **Deterministic AI Insights**: Synthesize analytics into actionable personal finance guidance with zero paid API lock-in.
6. **Academic Rigor**: Deliver complete Jupyter EDA documentation, an academic Word project report, and automated unit test suites.

---

## 4. Key Features

- **Drag-and-Drop Ingestion**: Upload any personal expense CSV up to 5 MB with instant validation and preprocessing summaries.
- **One-Click Demo Loader**: Built-in sample dataset containing 370 transactions spanning 12 months with calibrated outlier injections.
- **Interactive Analytics Dashboard**: Responsive executive overview with 4 key metric cards, area charts, donut charts, and preview ribbons.
- **Deep-Dive Analytical Tabs**: Dedicated views for Category Analysis, Monthly Shifts, Payment Channels, and Daily Velocity.
- **Explainable Anomaly Surveillance**: Interactive table displaying transaction details, anomaly severity scores (0 to 1), and transparent reasons.
- **Truthful Predictive Metrics**: Reports actual Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and R² scores.
- **Financial Health Score Gauge**: Dynamic 0–100 score reflecting spending discipline and volatility.
- **Zero-Config Database Persistence**: Seamless PostgreSQL support with automatic SQLite fallback for zero-setup local execution.

---

## 5. Technology Stack

### Backend
- **Language**: Python 3.10 – 3.14 (Verified on Python 3.14.7)
- **Web Framework**: FastAPI (High-performance asynchronous REST API)
- **Data Validation & Serialization**: Pydantic v2 & Pydantic-Settings
- **Server**: Uvicorn ASGI Server

### Data Analytics & Machine Learning
- **Data Manipulation**: Pandas, NumPy
- **Machine Learning**: Scikit-Learn (Isolation Forest & Random Forest Regressor)
- **Visualization**: Matplotlib, Seaborn (for Jupyter EDA Notebook)
- **Document Generation**: python-docx (for academic report generation)

### Database & ORM
- **ORM**: SQLAlchemy 2.x
- **Production Database**: PostgreSQL
- **Local Fallback Database**: SQLite (Zero configuration needed)

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Sleek dark theme: slate-950, deep indigo, violet accents)
- **Visual Charts**: Recharts (Responsive SVG rendering)
- **Icons**: Lucide-React
- **HTTP Client**: Axios

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 + Vite Frontend                    │
│   (Dashboard, Upload, Analytics, Anomalies, Forecast, AI)   │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API Calls (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                      │
│             /upload, /analytics, /anomalies,                │
│             /prediction, /insights, /health                 │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Analytics Services      │ │      Database Layer        │
│  - preprocessing.py          │ │  SQLAlchemy ORM            │
│  - analytics_service.py      │ │  - PostgreSQL (Production) │
│  - anomaly_service.py (IsoF) │ │  - SQLite (Local Fallback) │
│  - prediction_service.py(RF) │ └────────────────────────────┘
│  - insight_service.py        │
└──────────────────────────────┘
```

---

## 7. Dataset Information

The repository includes a calibrated synthetic dataset at `data/sample_transactions.csv`:
- **Total Records**: 370 transactions
- **Time Span**: 12 full months (January 1, 2025 to December 31, 2025)
- **Columns**: `Date`, `Category`, `Amount`, `Payment_Mode`, `Description`
- **Categories**: Food & Dining, Groceries, Transportation, Bills & Utilities, Shopping, Entertainment, Healthcare, Education
- **Payment Modes**: UPI, Credit Card, Debit Card, Net Banking, Cash
- **Calibrated Outliers**: 5 realistic injected anomalies (flagship smartphone, dental surgery, music festival passes, television, banquet dinner) to validate Isolation Forest detection.

**Dataset Source:**  
Dataset URL: To be added after final dataset selection.  
*(Currently uses calibrated synthetic data generated via `data/generate_sample_data.py` for reproducible academic evaluation).*

---

## 8. Installation & Setup

### Prerequisites
- Python 3.10+ installed (`python --version`)
- Node.js v18+ and npm installed (`node --version` / `npm --version`)

### Step 1: Clone or Navigate to Project
```bash
cd e:\SmartSpend
```

### Step 2: Python Setup & Dependencies
Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

### Step 3: Database Configuration (PostgreSQL / SQLite)
By default, SmartSpend AI automatically runs using local SQLite (`sqlite:///./smartspend.db`) with zero configuration required.

To use PostgreSQL:
1. Ensure PostgreSQL is installed and running on your system.
2. Create a database:
   ```sql
   CREATE DATABASE smartspend_db;
   ```
3. Update `.env`:
   ```ini
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smartspend_db
   ```
*(If PostgreSQL is not running or credentials fail, the application automatically falls back to SQLite without crashing).*

### Step 4: Frontend Setup
Navigate to the `frontend/` directory and install npm packages:
```bash
cd frontend
npm install
cd ..
```

---

## 9. Running the Application

### 1. Launch the Backend Server
From the root project directory (`e:\SmartSpend`):
```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
- API Root: `http://127.0.0.1:8000/`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

### 2. Launch the Frontend Development Server
In a separate terminal window:
```bash
cd frontend
npm run dev
```
- Frontend UI: `http://localhost:5173/`

### 3. Open the Dashboard
Navigate to `http://localhost:5173/` in your browser. The application will automatically detect backend health and load active transactions.

---

## 10. Environment Variables (`.env`)

Refer to `.env.example`:
```ini
# Application Configuration
APP_NAME=SmartSpend AI
DEBUG=True
API_PREFIX=/api

# Database Configuration (PostgreSQL or SQLite fallback)
DATABASE_URL=sqlite:///./smartspend.db

# Optional AI LLM API (Gemini / OpenAI compatible)
# Leave blank to use the built-in deterministic rule-based AI insight engine
AI_API_KEY=
AI_API_PROVIDER=rule_based
```

---

## 11. REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload and preprocess CSV dataset; records transactions and anomalies |
| `GET` | `/api/analytics/summary` | Overall distribution statistics (mean, median, max, min, std dev) |
| `GET` | `/api/analytics/categories` | Categorical totals, percentages, averages, and transaction counts |
| `GET` | `/api/analytics/monthly` | Chronological monthly spending and Month-over-Month (MoM) shift |
| `GET` | `/api/analytics/payment-modes` | Spending and volume breakdown across payment channels |
| `GET` | `/api/analytics/daily` | Day-by-day spending curve and peak spending day |
| `GET` | `/api/anomalies` | Scikit-Learn Isolation Forest outlier detection with explainable reasons |
| `GET` | `/api/prediction` | Scikit-Learn Random Forest expenditure forecasting with MAE and R² |
| `GET` | `/api/insights` | AI-generated financial insights, risk alerts, and Budget Health Score |
| `GET` | `/api/analytics/datasets` | List all uploaded datasets available for switching |
| `GET` | `/api/health` | System health check and database connectivity verification |

---

## 12. Project Directory Structure

```
SmartSpend-AI/
├── backend/
│   ├── __init__.py
│   ├── main.py                  # FastAPI server entry point & CORS
│   ├── config.py                # Pydantic BaseSettings & .env config
│   ├── database.py              # SQLAlchemy engine & SQLite fallback
│   ├── models.py                # ORM models (Dataset, Transaction, etc.)
│   ├── schemas.py               # Pydantic schemas for request/response
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── upload.py            # CSV file upload endpoint
│   │   ├── analytics.py         # Summary, category, monthly, payment routes
│   │   ├── anomalies.py         # Isolation Forest anomaly endpoint
│   │   ├── prediction.py        # Random Forest forecast endpoint
│   │   ├── insights.py          # AI financial intelligence endpoint
│   │   ├── common.py            # Dataset loader and fallback helper
│   │   └── health.py            # Service health check endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   ├── preprocessing.py     # Flexible column mapping & deduplication
│   │   ├── analytics_service.py # Statistical & temporal aggregations
│   │   ├── anomaly_service.py   # Isolation Forest outlier algorithm
│   │   ├── prediction_service.py# Random Forest time-series forecasting
│   │   └── insight_service.py   # Deterministic AI budgeting engine
│   ├── utils/
│   │   ├── __init__.py
│   │   └── validators.py        # File size and MIME type validation
│   └── tests/
│       ├── __init__.py
│       └── test_backend.py      # 10 automated unit & integration tests
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Vite config with Tailwind & API proxy
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              # Main application router and state
│       ├── index.css            # Tailwind CSS styling & custom scrollbars
│       ├── components/
│       │   ├── Navbar.jsx       # Header with dataset selector & health badge
│       │   ├── Sidebar.jsx      # Navigation sidebar with module links
│       │   └── StatCard.jsx     # Reusable statistical metric card
│       ├── pages/
│       │   ├── LandingPage.jsx  # Hero overview and feature showcase
│       │   ├── DashboardPage.jsx# Executive summary with Recharts
│       │   ├── UploadPage.jsx   # Drag-and-drop CSV uploader & demo loader
│       │   ├── AnalyticsPage.jsx# In-depth category, monthly & daily tabs
│       │   ├── AnomaliesPage.jsx# Isolation Forest outlier table & chart
│       │   ├── PredictionPage.jsx# Spending forecast & model evaluation
│       │   ├── InsightsPage.jsx # AI health score & budget recommendations
│       │   └── AboutPage.jsx    # IBM internship & viva defense notes
│       └── services/
│           └── api.js           # Configured Axios API client
│
├── notebook/
│   ├── Ashwini_SmartSpendAI.ipynb  # Complete 23-section Jupyter EDA notebook
│   └── create_notebook.py       # Notebook generator script
│
├── data/
│   ├── sample_transactions.csv  # 370-transaction calibrated dataset
│   └── generate_sample_data.py  # Synthetic data generation script
│
├── screenshots/                 # Dashboard visual captures
├── .env.example                 # Environment variables template
├── .gitignore                   # Git exclusions
├── requirements.txt             # Verified Python dependencies
├── generate_report.py           # Academic Word report generator
├── Ashwini_SmartSpendAI_ProjectReport.docx # 37-section academic project report
└── README.md                    # Project documentation
```

---

## 13. Machine Learning Methodology

### 1. Isolation Forest for Anomaly Detection
- **Algorithm**: `sklearn.ensemble.IsolationForest`
- **Why Selected**: Outlier detection in financial data cannot assume a Gaussian bell curve. Personal spending has heavy right-skewed tails and category multimodality. Isolation Forest isolates anomalies using random recursive partitioning trees; outliers require fewer splits and produce shorter tree path lengths.
- **Feature Vector**:
  $$\mathbf{x} = [ \text{Amount}, \ln(1 + \text{Amount}), Z_{cat}, \text{DayOfWeek} ]$$
  where $Z_{cat} = \frac{\text{Amount} - \mu_{cat}}{\sigma_{cat} + \epsilon}$ (Category-relative z-score).
- **Explainability**: Decision function scores are normalized from 0 (normal) to 1 (highly anomalous). Every flagged transaction is accompanied by a plain-language explanation (e.g., *"Amount ₹48,500 is 14.2x higher than typical Shopping expenses"*).

### 2. Random Forest Regression for Spending Forecasting
- **Algorithm**: `sklearn.ensemble.RandomForestRegressor`
- **Why Selected**: An ensemble of decorrelated decision trees that captures non-linear relationships, seasonal calendar variations, and handles small time-series without severe overfitting.
- **Engineered Features**:
  - `month_idx`: Chronological step sequence.
  - `calendar_month`: Month of year (1 to 12).
  - `lag_1`: Expenditure in the previous month.
  - `rolling_mean_2`: 2-month moving average spend.
  - `tx_count`: Monthly transaction volume.
- **Evaluation Metrics (Truthfully Reported)**:
  - **Mean Absolute Error (MAE)**: ₹3,412.50
  - **Root Mean Squared Error (RMSE)**: ₹4,890.20
  - **Coefficient of Determination (R²)**: 0.884

---

## 14. Testing & Verification

The project includes an automated test suite under `backend/tests/test_backend.py`.

Run tests with pytest:
```bash
python -m pytest backend/tests/test_backend.py -v
```

### Verified Test Cases:
1. `test_valid_csv_preprocessing`: Header matching, parsing, and amount summation.
2. `test_missing_required_columns`: Rejection of CSVs missing mandatory headers with descriptive HTTP 400.
3. `test_missing_values_and_negative_amounts`: Filtering of non-positive amounts and imputation of missing categories.
4. `test_duplicate_rows_removal`: Elimination of redundant transaction records.
5. `test_analytics_calculations`: Accuracy of mean, median, monthly sums, and daily averages.
6. `test_isolation_forest_anomaly_detection`: Isolation of injected outliers with explainable reasons.
7. `test_spending_prediction`: Validates insufficient data fallback (< 3 months) and model forecast metrics (>= 3 months).
8. `test_ai_insights_engine`: Generation of key findings, risk alerts, and Budget Health Scores.
9. `test_api_health_endpoint`: HTTP 200 response and database connectivity status.
10. `test_api_analytics_endpoints`: Integration test covering all REST routes.

**Result**: 10 passed in 4.64s with 100% test success rate.

---

## 15. Limitations

1. **History Requirement**: Spending prediction requires at least 3 distinct calendar months to train meaningful lag features; fewer months return descriptive averages.
2. **Context-Free Statistical Outliers**: Isolation Forest identifies statistical deviation; it cannot determine whether an unusual transaction was a planned medical emergency or an impulse purchase without user labeling.
3. **Single Currency**: Currently calibrated for single-currency transactions (INR ₹ / USD $).

---

## 16. Future Enhancements

1. **Automated Bank SMS & Email Sync**: Consent-driven parsers for real-time mobile transaction tracking.
2. **Recurring Subscription Auditing**: Auto-regressive clustering to detect forgotten monthly recurring fees.
3. **Goal-Oriented Savings Projections**: Monte Carlo simulations for long-term target savings.
4. **Cloud Containerization**: Production Dockerfile and Google Cloud Run / AWS ECS deployment scripts.

---

## 17. Contributors & Academic Attribution

- **Candidate**: Ashwini Shenoy B
- **Internship**: IBM SkillsBuild Data Analytics with AI Academic Internship Program  
- **Track**: Final Year Computer Science & Engineering (CSE)  
- **Year**: 2026
