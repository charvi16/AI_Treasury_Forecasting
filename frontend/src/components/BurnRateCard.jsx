import { useEffect, useState } from "react";
import '../styles/card.css';


export default function BurnRateCard({ burnRate }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = burnRate;
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
      setValue(start);
    }, stepTime);

    return () => clearInterval(id);
  }, [burnRate]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Burn Rate</div>
        <div className="card-tag">Monthly</div>
      </div>
      <div className="card-value">
        {value.toFixed(0)} <span style={{ fontSize: "2vh" }}>INR / month</span>
      </div>
      <p className="card-muted">
        Average net cash outflow based on historical data.
      </p>
    </div>
  );
}
