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
  return <section className="page">
    <div className="page-head"><div><h2>Database / Supabase</h2><p>חיבור למסד נתונים משותף כדי שכל המשתמשים יראו את אותם נתונים</p></div><div className={supabaseEnabled?"admin-ok":"admin-lock"}>{supabaseEnabled?"Supabase מחובר":"מצב מקומי"}</div></div>
    <div className="panel">
      <div className="panel-title">סטטוס חיבור</div>
      {supabaseEnabled ? <p className="import-message">✅ Supabase מוגדר. ניתן לטעון ולשמור נתונים לענן.</p> : <p className="muted">Supabase עדיין לא מוגדר. המערכת ממשיכה לעבוד במצב מקומי. כדי לחבר: צור פרויקט Supabase, הרץ את supabase/schema.sql, והוסף ב־Netlify Environment Variables את VITE_SUPABASE_URL ואת VITE_SUPABASE_ANON_KEY.</p>}
      <div className="button-row">
        <button className="action-btn" disabled={!supabaseEnabled} onClick={saveCloud}>שמור לענן</button>
        <button className="secondary-btn" disabled={!supabaseEnabled} onClick={loadCloud}>טען מהענן</button>
      </div>
    </div>
    <div className="panel">
      <div className="panel-title">מה צריך לבצע ב־Supabase</div>
      <ol className="steps">
        <li>פתח פרויקט חדש ב־Supabase.</li>
        <li>פתח SQL Editor.</li>
        <li>הדבק והריץ את הקובץ <b>supabase/schema.sql</b>.</li>
        <li>ב־Netlify הוסף Environment Variables.</li>
        <li>בצע Deploy מחדש.</li>
      </ol>
    </div>
  </section>
}
