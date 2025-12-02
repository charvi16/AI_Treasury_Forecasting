import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function CashflowChart({ forecast }) {
  console.log("Forecast data:", forecast);

  if (!forecast || forecast.length === 0) {
    return <div className="card">No forecast data available</div>;
  }

  return (
    <div
      className="card"
      style={{
        marginTop: "3vh",
        minWidth: 0,
        minHeight: 0,
        border: "1px solid #ccc",
      }}
    >
      <div className="card-header">
        <div className="card-title">Cashflow Forecast (Next 30 Days)</div>
        <div className="card-tag">Baseline</div>
      </div>

      {/* 🔥 FIX: use plain LineChart with explicit width & height */}
      <LineChart
        width={800}        // you can tweak these
        height={400}
        data={forecast}
        style={{ marginTop: "2vh" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#4f46e5"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </div>
  );
}
