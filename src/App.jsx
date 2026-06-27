import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import "./styles/main.css";

const pageMap = {
  dashboard: <Dashboard />,
  facilities: <Settings />,
  production: <Placeholder title="ייצור ואריזה" subtitle="יעדים, ניצולת, קווי אריזה ומגמות" />,
  quality: <Placeholder title="איכות" subtitle="מנות תקינות, חריגות, מותנה ואירועי איכות" />,
  orders: <Placeholder title="הזמנות" subtitle="פתוחות, סגורות ופער מתוכנן מול נמסר" />,
  analytics: <Placeholder title="מגמות וניתוח" subtitle="השוואות תקופה, תחזיות ו־OEE" />,
  reports: <Placeholder title="דוחות Excel" subtitle="ייצוא דוח הנהלה, Raw Data ותרשימים" />,
  whatsapp: <Placeholder title="WhatsApp" subtitle="טקסט מעוצב, תמונת הנהלה ושיתוף" />,
  settings: <Settings />,
  admin: <Placeholder title="ניהול והרשאות" subtitle="משתמשים, הרשאות ו־Audit Log" />
};

export default function App() {
  const [active, setActive] = useState(localStorage.getItem("adama_bi_active_page") || "dashboard");
  useEffect(() => localStorage.setItem("adama_bi_active_page", active), [active]);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }, []);
  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} />
      <main className="main-content">
        <header className="topbar">
          <div><strong>ADAMA Production BI</strong><span>מערכת ניהול ייצור, אריזה ואיכות</span></div>
          <button onClick={() => window.location.reload()}>רענן</button>
        </header>
        {pageMap[active] || pageMap.dashboard}
      </main>
    </div>
  );
}
