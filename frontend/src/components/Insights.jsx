import "../styles/card.css";
export default function Insights({ messages }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Insights</h2>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
