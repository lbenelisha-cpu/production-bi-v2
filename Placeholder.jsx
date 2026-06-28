export default function KpiCard({ label, value, sub, tone = "default", onClick }) {
  return <div className={`kpi-card ${tone}`} onClick={onClick}><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div>{sub && <div className="kpi-sub">{sub}</div>}</div>;
}
