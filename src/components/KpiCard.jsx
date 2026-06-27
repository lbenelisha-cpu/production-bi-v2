export default function KpiCard({ label, value, sub, tone = "" }) {
  return (
    <div className={`kpi-card ${tone || ""}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}
