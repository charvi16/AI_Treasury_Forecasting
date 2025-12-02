import { useEffect, useState } from "react";
import { getForecastData } from "./api/api";
import CashflowChart from "./components/CashflowChart";
import BurnRateCard from "./components/BurnRateCard";
import RiskCard from "./components/RiskCard";
import Insights from "./components/Insights";
import MultiScenarioChart from "./components/MultiScenarioChart";
import './styles/global.css';
import './styles/layout.css';

export default function App() {
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    getForecastData().then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const reducedScenario =
    data?.cashflow_forecast?.map((d) => ({
      ...d,
      amount: d.amount * 0.9, // 10% cost reduction scenario
    })) || [];

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const isLoading = !data;

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          Treasury<span>AI</span>
        </div>
        <div>
          <div className="sidebar-section-title">Overview</div>
          <ul className="sidebar-nav">
            <li className="active">Dashboard</li>
            <li>Forecasts</li>
            <li>Scenarios</li>
            <li>Alerts</li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <div className="main-title">AI Treasury Forecasting</div>
            <div className="main-subtitle">
              Cashflow, burn, runway, and risk in one place.
            </div>
          </div>
          <button className="toggle-btn" onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        {/* KPI grid */}
        <div className="grid">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <RiskCard risk={data.risk_score} runway={data.runway_months} />
              <BurnRateCard burnRate={data.burn_rate} />
            </>
          )}
        </div>

        {/* Main chart */}
        {isLoading ? (
          <div style={{ marginTop: "3vh" }}>
            <SkeletonCard />
          </div>
        ) : (
          // <CashflowChart forecast={data.cashflow_forecast} />
          
          <CashflowChart forecast={data.cashflow_forecast.slice(0, 30)} />
        )}

        {/* Multi-scenario comparison chart */}
        {!isLoading && (
          <MultiScenarioChart
            base={data.cashflow_forecast}
            reduced={reducedScenario}
          />
        )}

        {/* Insights */}
        {isLoading ? (
          <div style={{ marginTop: "2vh" }}>
            <SkeletonCard />
          </div>
        ) : (
          <Insights messages={data.insights} />
        )}

        {/* Download PDF button */}
        <div style={{ marginTop: "3vh" }}>
          <a href="http://localhost:8000/report/pdf" target="_blank" rel="noreferrer">
            <button className="toggle-btn">📄 Download PDF Financial Report</button>
          </a>
        </div>
      </main>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
    </div>
  );
}
