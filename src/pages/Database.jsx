import { supabaseEnabled } from "../services/supabaseClient.js";
import { cloudLoadAll, cloudReplaceEntries, cloudReplaceQuality, cloudSaveSettings } from "../services/cloudStorage.js";

export default function Database({ settings, entries, quality, setSettings, setEntries, setQuality }) {
  const loadCloud = async () => {
    try {
      const data = await cloudLoadAll();
      setSettings(data.settings);
      setEntries(data.entries);
      setQuality(data.quality);
      alert("הנתונים נטענו מ־Supabase בהצלחה");
    } catch (e) { alert("שגיאה בטעינה: " + e.message); }
  };
  const saveCloud = async () => {
    try {
      await cloudSaveSettings(settings);
      await cloudReplaceEntries(entries);
      await cloudReplaceQuality(quality);
      alert("הנתונים נשמרו ל־Supabase בהצלחה");
    } catch (e) { alert("שגיאה בשמירה: " + e.message); }
  };

  return (
    <section className="page">
      <div className="page-head">
        <div><h2>Database / Supabase</h2><p>חיבור למסד נתונים משותף</p></div>
        <div className={supabaseEnabled ? "admin-ok" : "admin-lock"}>{supabaseEnabled ? "Supabase מחובר" : "מצב מקומי"}</div>
      </div>

      <div className="panel">
        <div className="panel-title">פעולות ענן</div>
        <p className="muted">לפני שמירה לענן יש להריץ את הקובץ <b>supabase/schema.sql</b> ולהגדיר ב־Netlify את VITE_SUPABASE_URL ואת VITE_SUPABASE_ANON_KEY.</p>
        <div className="button-row">
          <button className="action-btn" disabled={!supabaseEnabled} onClick={saveCloud}>שמור הכל לענן</button>
          <button className="secondary-btn" disabled={!supabaseEnabled} onClick={loadCloud}>טען הכל מהענן</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">סטטוס מקומי</div>
        <div className="source-grid">
          <div className="source-card"><strong>ייצור/אריזה</strong><span>{entries.length.toLocaleString("en-US")} רשומות</span></div>
          <div className="source-card"><strong>איכות</strong><span>{quality.length.toLocaleString("en-US")} רשומות</span></div>
        </div>
      </div>
    </section>
  );
}
