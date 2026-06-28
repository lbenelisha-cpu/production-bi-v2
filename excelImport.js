const items = [
  ["dashboard", "📊", "דשבורד"],
  ["data", "📂", "טעינת נתונים"],
  ["database", "☁️", "Database"],
  ["facilities", "🏭", "הגדרות מתקנים"],
  ["production", "🏷️", "ייצור ואריזה"],
  ["quality", "✅", "איכות"],
  ["orders", "📋", "הזמנות"],
  ["analytics", "📈", "מגמות"],
  ["reports", "📄", "דוחות Excel"],
  ["whatsapp", "💬", "WhatsApp"],
  ["settings", "⚙️", "הגדרות"],
  ["admin", "🔐", "ניהול"]
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div>
          <h1>ADAMA</h1>
          <p>Production BI</p>
        </div>
        <div className="brand-mark">BI</div>
      </div>
      <nav>
        {items.map(([key, icon, label]) => (
          <button
            key={key}
            className={`nav-item ${active === key ? "active" : ""}`}
            onClick={() => setActive(key)}
          >
            <span>{icon}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </nav>
    </aside>
  );
}
