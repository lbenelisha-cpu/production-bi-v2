import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import KpiCard from "../components/KpiCard.jsx";
import { fmt } from "../services/storage.js";
import { byFacility, summarizeEntries, summarizeQuality, trendByDate } from "../services/calculations.js";
export default function Dashboard({ entries, quality, settings }) {
  const summary = summarizeEntries(entries, settings);
  const q = summarizeQuality(quality);
  const trend = trendByDate(entries, settings);
  const facilityRows = byFacility(entries, settings);
  return <section className="page">
    <div className="page-head"><div><h2>דשבורד ראשי</h2><p>תמונת מצב ייצור, אריזה, איכות והזמנות</p></div><div className="version-badge">Sprint 3</div></div>
    <div className="kpi-grid">
      <KpiCard label="סה״כ אריזה" value={fmt(summary.packaging)} sub="ליטר / ק״ג לפי מתקן" tone="teal" />
      <KpiCard label="יעד אריזה" value={fmt(summary.target)} sub="מחושב מהגדרות המתקנים" tone="amber" />
      <KpiCard label="עמידה ביעד" value={`${summary.achievement}%`} sub={summary.target ? "לפי נתונים בפועל" : "לא הוגדר יעד"} tone={summary.achievement >= 100 ? "green" : "red"} />
      <KpiCard label="מנות איכות" value={q.total} sub={`תקין ${q.ok} | ממתין ${q.pending} | חריג ${q.bad}`} />
    </div>
    <div className="dashboard-grid">
      <div className="panel large"><div className="panel-title">מגמת ייצור ואריזה</div>{trend.length ? <ResponsiveContainer width="100%" height={300}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="date" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip/><Legend/><Line type="monotone" dataKey="packaging" name="אריזה" stroke="#36c2b4" strokeWidth={3}/><Line type="monotone" dataKey="production" name="ייצור" stroke="#f4a623" strokeWidth={3}/><Line type="monotone" dataKey="target" name="יעד" stroke="#94a3b8" strokeWidth={2}/></LineChart></ResponsiveContainer> : <div className="empty-mini">אין עדיין נתונים. עבור לטעינת נתונים או ייצור ואריזה.</div>}</div>
      <div className="panel"><div className="panel-title">ביצועים לפי מתקן</div>{facilityRows.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={facilityRows}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="facility" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip/><Bar dataKey="packaging" name="אריזה" fill="#36c2b4"/><Bar dataKey="target" name="יעד" fill="#f4a623"/></BarChart></ResponsiveContainer> : <div className="empty-mini">אין נתונים לפי מתקן</div>}</div>
    </div>
  </section>
}
