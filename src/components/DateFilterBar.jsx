import { buildRange, defaultDateFilter, moveDateFilter } from "../services/dateFilters.js";

const modes = [
  ["day", "יומי"],
  ["month", "חודשי"],
  ["quarter", "רבעוני"],
  ["year", "שנתי"],
  ["custom", "טווח חופשי"]
];

export default function DateFilterBar({
  dateFilter,
  setDateFilter,
  extraFilters,
  setExtraFilters,
  settings
}) {
  const range = buildRange(dateFilter);

  const update = patch => setDateFilter(prev => ({ ...prev, ...patch }));
  const reset = () => {
    setDateFilter(defaultDateFilter());
    setExtraFilters({ facility: "all", line: "all", shift: "all", order: "" });
  };

  return (
    <div className="date-filter-panel">
      <div className="date-filter-head">
        <div>
          <div className="date-filter-title">📅 תקופת תצוגה</div>
          <div className="date-filter-sub">כל הדשבורד מסתנן לפי התקופה והמסננים שנבחרו</div>
        </div>
        <div className="active-range">{range.label}<span>{range.start} - {range.end}</span></div>
      </div>

      <div className="date-mode-row">
        {modes.map(([key, label]) => (
          <button
            key={key}
            className={`date-mode-btn ${dateFilter.mode === key ? "active" : ""}`}
            onClick={() => update({ mode: key })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="date-fields-grid">
        {dateFilter.mode === "day" && (
          <label>תאריך<input type="date" value={dateFilter.day} onChange={e => update({ day: e.target.value })} /></label>
        )}

        {dateFilter.mode === "month" && (
          <label>חודש<input type="month" value={dateFilter.month} onChange={e => update({ month: e.target.value })} /></label>
        )}

        {dateFilter.mode === "quarter" && (
          <>
            <label>רבעון<select value={dateFilter.quarter} onChange={e => update({ quarter: Number(e.target.value) })}>
              <option value={1}>Q1</option>
              <option value={2}>Q2</option>
              <option value={3}>Q3</option>
              <option value={4}>Q4</option>
            </select></label>
            <label>שנה<input type="number" value={dateFilter.quarterYear} onChange={e => update({ quarterYear: Number(e.target.value) })} /></label>
          </>
        )}

        {dateFilter.mode === "year" && (
          <label>שנה<input type="number" value={dateFilter.year} onChange={e => update({ year: Number(e.target.value) })} /></label>
        )}

        {dateFilter.mode === "custom" && (
          <>
            <label>מתאריך<input type="date" value={dateFilter.startDate} onChange={e => update({ startDate: e.target.value })} /></label>
            <label>עד תאריך<input type="date" value={dateFilter.endDate} onChange={e => update({ endDate: e.target.value })} /></label>
          </>
        )}

        <label>מתקן
          <select value={extraFilters.facility} onChange={e => setExtraFilters(prev => ({ ...prev, facility: e.target.value }))}>
            <option value="all">כל המתקנים</option>
            {(settings.facilities || []).filter(f => f.active).map(f => <option key={f.id} value={f.id}>{f.id} - {f.name}</option>)}
          </select>
        </label>

        <label>קו אריזה
          <select value={extraFilters.line} onChange={e => setExtraFilters(prev => ({ ...prev, line: e.target.value }))}>
            <option value="all">כל הקווים</option>
            {(settings.lines || []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </label>

        <label>משמרת
          <select value={extraFilters.shift} onChange={e => setExtraFilters(prev => ({ ...prev, shift: e.target.value }))}>
            <option value="all">כל המשמרות</option>
            <option>בוקר</option>
            <option>ערב</option>
            <option>לילה</option>
            <option>יממה</option>
          </select>
        </label>

        <label>פקודת ייצור
          <input value={extraFilters.order} onChange={e => setExtraFilters(prev => ({ ...prev, order: e.target.value }))} placeholder="חיפוש פקודה" />
        </label>
      </div>

      <div className="date-nav-row">
        <button className="secondary-btn" onClick={() => setDateFilter(prev => moveDateFilter(prev, -1))}>◀ תקופה קודמת</button>
        <button className="secondary-btn" onClick={() => setDateFilter(defaultDateFilter())}>תקופה נוכחית</button>
        <button className="secondary-btn" onClick={() => setDateFilter(prev => moveDateFilter(prev, 1))}>תקופה הבאה ▶</button>
        <button className="action-btn" onClick={reset}>איפוס סינון</button>
      </div>
    </div>
  );
}
