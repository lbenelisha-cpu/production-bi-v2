import { useRef, useState } from "react";
import { parseExcelFile } from "../services/excelImport.js";
import { fmt } from "../services/storage.js";
import { supabaseEnabled } from "../services/supabaseClient.js";
import { cloudReplaceEntries, cloudReplaceQuality } from "../services/cloudStorage.js";

export default function DataImport({ entries, setEntries, quality, setQuality, importStatus, setImportStatus }) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");

  const onFile = async (file) => {
    if (!file) return;
    try {
      const result = await parseExcelFile(file);
      if (result.type === "production") {
        setEntries(result.rows);
        if (supabaseEnabled) await cloudReplaceEntries(result.rows);
        setImportStatus({ ...importStatus, production: { file: file.name, at: new Date().toLocaleString("he-IL"), rows: result.rows.length } });
      } else if (result.type === "quality") {
        setQuality(result.rows);
        if (supabaseEnabled) await cloudReplaceQuality(result.rows);
        setImportStatus({ ...importStatus, quality: { file: file.name, at: new Date().toLocaleString("he-IL"), rows: result.rows.length } });
      } else {
        setMessage("לא הצלחתי לזהות אם זה קובץ ייצור/אריזה או איכות.");
        return;
      }
      setMessage(result.message + (supabaseEnabled ? " | נשמר גם בענן" : " | נשמר מקומית"));
    } catch (e) {
      setMessage("שגיאה בקריאת הקובץ: " + e.message);
    }
  };

  return (
    <section className="page">
      <div className="page-head">
        <div><h2>טעינת נתונים</h2><p>טעינת Excel אחד לייצור/אריזה או לקובץ איכות</p></div>
        <div className="version-badge">{supabaseEnabled ? "Cloud" : "Local"}</div>
      </div>

      <div className="panel import-panel">
        <div className="panel-title">בחירת קובץ Excel</div>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e => onFile(e.target.files?.[0])} />
        <button className="action-btn" onClick={() => inputRef.current?.click()}>📂 בחר קובץ Excel</button>
        {message && <p className="import-message">{message}</p>}
      </div>

      <div className="panel">
        <div className="panel-title">מרכז מקורות נתונים</div>
        <div className="source-grid">
          <div className="source-card">
            <strong>ייצור / אריזה</strong>
            <span>{importStatus.production ? "✅ נטען" : "❌ לא נטען"}</span>
            <small>{importStatus.production ? `${importStatus.production.file} | ${importStatus.production.at}` : "—"}</small>
            <small>רשומות במערכת: {fmt(entries.length)}</small>
          </div>
          <div className="source-card">
            <strong>איכות</strong>
            <span>{importStatus.quality ? "✅ נטען" : "❌ לא נטען"}</span>
            <small>{importStatus.quality ? `${importStatus.quality.file} | ${importStatus.quality.at}` : "—"}</small>
            <small>רשומות במערכת: {fmt(quality.length)}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
