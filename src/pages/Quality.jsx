import { useState } from "react";
import { fmt } from "../services/storage.js";
import { summarizeQuality } from "../services/calculations.js";

export default function Quality({ quality }) {
  const [mode, setMode] = useState(null);
  const q = summarizeQuality(quality);
  const rows = mode ? quality.filter(x => mode === "all" || x.status === mode) : [];

  return (
    <section className="page">
      <div className="page-head"><div><h2>איכות</h2><p>סיכום מנות איכות לפי קובץ איכות שנטען</p></div><div className="version-badge">טעינת איכות פעילה</div></div>
      <div className="kpi-grid">
        <div className="kpi-card" onClick={()=>setMode(mode==="all"?null:"all")}><div className="kpi-label">מנות איכות בטווח</div><div className="kpi-value">{fmt(q.total)}</div><div className="kpi-sub">לחץ להצגה</div></div>
        <div className="kpi-card green" onClick={()=>setMode(mode==="ok"?null:"ok")}><div className="kpi-label">מנות תקינות</div><div className="kpi-value">{fmt(q.ok)}</div><div className="kpi-sub">לחץ להצגה</div></div>
        <div className="kpi-card amber" onClick={()=>setMode(mode==="pending"?null:"pending")}><div className="kpi-label">מותנה / ממתין</div><div className="kpi-value">{fmt(q.pending)}</div><div className="kpi-sub">לחץ להצגה</div></div>
        <div className="kpi-card red" onClick={()=>setMode(mode==="bad"?null:"bad")}><div className="kpi-label">מנות חורגות</div><div className="kpi-value">{fmt(q.bad)}</div><div className="kpi-sub">לחץ להצגה</div></div>
      </div>
      <div className="panel">
        <div className="panel-title">פירוט איכות</div>
        {!mode ? <div className="empty-mini">לחץ על כרטיס כדי להציג רשומות</div> : rows.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>תאריך</th><th>מתקן</th><th>פקודה</th><th>Batch</th><th>חומר</th><th>Inspection Lot</th><th>סטטוס</th><th>מקור</th></tr></thead>
              <tbody>{rows.slice(0, 1000).map(r => <tr key={r.id}><td>{r.date}</td><td>{r.facility}</td><td>{r.order}</td><td>{r.batch}</td><td>{r.material}</td><td>{r.inspectionLot}</td><td>{r.status==="ok"?"תקין":r.status==="bad"?"חריג":"ממתין"}</td><td>{r.source}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <div className="empty-mini">אין רשומות להצגה</div>}
      </div>
    </section>
  );
}
