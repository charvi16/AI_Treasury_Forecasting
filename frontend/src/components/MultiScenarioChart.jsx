import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function MultiScenarioChart({ base, reduced }) {
  if (!base || base.length === 0) return null;

  const merged = base.map((b, i) => ({
    day: b.day,
    base: b.amount,
    reduced: reduced?.[i]?.amount ?? b.amount * 0.9,
  }));

  console.log("Multi-scenario data:", merged);

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
        <div className="card-title">A/B Scenario: Spend -10%</div>
        <div className="card-tag">What-if</div>
      </div>

      <LineChart
        width={800}
        height={400}
        data={merged}
        style={{ marginTop: "2vh" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="base"
          name="Baseline"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="reduced"
          name="Spend -10%"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </div>
  );
}
