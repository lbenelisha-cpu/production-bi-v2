import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import KpiCard from "../components/KpiCard.jsx";
import { demoKpis, trendData, facilityTargets } from "../data/defaults.js";

export default function Dashboard() {
  const achievement = Math.round((demoKpis.packaging / demoKpis.target) * 100);
  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h2>דשבורד ראשי</h2>
          <p>תמונת מצב ייצור, אריזה, איכות והזמנות</p>
        </div>
        <div className="version-badge">V2 Sprint 1</div>
      </div>

      <div className="kpi-grid">
        <KpiCard label="סה״כ אריזה" value={demoKpis.packaging.toLocaleString("en-US")} sub="ליטר / ק״ג לפי מתקן" tone="teal" />
        <KpiCard label="יעד" value={demoKpis.target.toLocaleString("en-US")} sub="יעד דינמי לפי הגדרות" tone="amber" />
        <KpiCard label="עמידה ביעד" value={`${achievement}%`} sub={achievement >= 100 ? "מעל יעד" : "מתחת ליעד"} tone={achievement >= 100 ? "green" : "red"} />
        <KpiCard label="הזמנות פתוחות" value={demoKpis.openOrders} sub={`סגורות: ${demoKpis.closedOrders}`} />
      </div>

      <div className="dashboard-grid">
        <div className="panel large">
          <div className="panel-title">מגמת ייצור ואריזה</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="packaging" name="אריזה" stroke="#36c2b4" strokeWidth={3} />
              <Line type="monotone" dataKey="production" name="ייצור" stroke="#f4a623" strokeWidth={3} />
              <Line type="monotone" dataKey="target" name="יעד" stroke="#94a3b8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-title">איכות</div>
          <div className="quality-stack">
            <KpiCard label="מנות תקינות" value={demoKpis.qualityOk} tone="green" />
            <KpiCard label="ממתינות / מוגבל" value={demoKpis.qualityPending} tone="amber" />
            <KpiCard label="מנות בליקוי" value={demoKpis.qualityBad} tone="red" />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">מחווני מתקנים</div>
        <div className="facility-mini-grid">
          {facilityTargets.filter(f => f.active).map(f => (
            <div className="facility-chip-card" key={f.id}>
              <strong>{f.id}</strong>
              <span>{f.targetType === "monthly" ? "חודשי" : f.targetType === "packagingLines" ? "לפי קווים" : "יומי"}</span>
              <small>{f.packagingTarget ? f.packagingTarget.toLocaleString("en-US") + " " + f.unit : "הגדר יעד"}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
