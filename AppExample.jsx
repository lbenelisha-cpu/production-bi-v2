import React from "react";
import DashboardScreen from "./DashboardScreen";

const productionRows = [
  { date: "2026-06-01", facility: "1542", production: 42000, packaging: 39000, targetPackaging: 60000 },
  { date: "2026-06-10", facility: "1543", production: 61000, packaging: 58000, targetPackaging: 80000 },
  { date: "2026-07-02", facility: "1519", production: 24000, packaging: 21000, targetPackaging: 50000 },
  { date: "2026-04-15", facility: "1528", production: 76000, packaging: 0, targetPackaging: 0 },
];

const qualityRows = [
  { date: "2026-06-01", lot: "A100", status: "תקין" },
  { date: "2026-07-02", lot: "B200", status: "חריג" },
];

const eventRows = [
  { date: "2026-06-10", type: "איכות", text: "בדיקת איכות" },
  { date: "2026-05-20", type: "סביבה", text: "אירוע סביבתי" },
];

export default function AppExample() {
  return (
    <DashboardScreen
      productionRows={productionRows}
      qualityRows={qualityRows}
      eventRows={eventRows}
    />
  );
}
