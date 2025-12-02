import { useEffect, useState } from "react";
import '../styles/card.css';

export default function RiskCard({ risk, runway }) {
  const [displayRunway, setDisplayRunway] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = runway;
    const duration = 700;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const id = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(id);
      }
      setDisplayRunway(start);
    }, stepTime);

    return () => clearInterval(id);
  }, [runway]);

  const getColor = () => {
    if (risk === "Low") return "#22c55e";
    if (risk === "Medium") return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Risk Score</div>
        <div className="card-tag">Runway</div>
      </div>
      <div className="card-value" style={{ color: getColor() }}>
        {risk}
      </div>
      <p className="card-muted">
        Estimated runway: {displayRunway.toFixed(1)} months at current burn.
      </p>
    </div>
  );
}
