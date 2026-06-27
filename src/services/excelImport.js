import * as XLSX from "xlsx";
import { normalizeFacilityId } from "../data/defaults.js";

function norm(s) { return String(s || "").trim().toLowerCase(); }
function get(row, keys) {
  for (const k of keys) {
    const hit = Object.keys(row).find(h => norm(h) === norm(k) || norm(h).includes(norm(k)));
    if (hit !== undefined) return row[hit];
  }
  return "";
}
function dateToISO(v) {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number") {
    const d = XLSX.SSF.parse_date_code(v);
    if (d) return `${d.y}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
  }
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0,10);
  const m = s.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    return `${y}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  }
  return s;
}
function detectPackagingLine(row) {
  const raw = String(get(row, ["packaging line", "line", "קו", "קו אריזה", "resource", "work center", "packaging type"]) || "").toLowerCase();
  if (raw.includes("1") || raw.includes("1l") || raw.includes("1 ליטר")) return "1L";
  if (raw.includes("5") || raw.includes("5l") || raw.includes("5 ליטר")) return "5L";
  if (raw.includes("10") || raw.includes("20") || raw.includes("10/20")) return "10_20L";
  return "";
}
function classifyQuality(row) {
  const text = [
    get(row, ["result status", "status", "qa approval", "approval", "ud code", "usage decision", "סטטוס", "אישור"])
  ].join(" ").toLowerCase();
  const rejected = Number(get(row, ["rejected characteristics", "rejected", "חריגות"]) || 0);
  if (text.includes("reject") || text.includes("פסול") || text.includes("contamin") || rejected > 0) return "bad";
  if (text.includes("restrict") || text.includes("condition") || text.includes("pending") || text.includes("מותנה") || text.includes("ממתין") || text.includes("מוגבל")) return "pending";
  return "ok";
}
function isQualityFile(headers) {
  const h = headers.map(norm).join(" | ");
  return h.includes("inspection") || h.includes("qa") || h.includes("ud code") || h.includes("result status") || h.includes("rejected characteristics");
}
function isProductionFile(headers) {
  const h = headers.map(norm).join(" | ");
  return h.includes("packaging") || h.includes("production") || h.includes("yield") || h.includes("process order") || h.includes("פקודת");
}

export async function parseExcelFile(file) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  let allRows = [];
  wb.SheetNames.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    rows.forEach(r => allRows.push({ ...r, __sheet: sheetName }));
  });
  if (!allRows.length) return { type: "unknown", rows: [], message: "לא נמצאו שורות בקובץ" };
  const headers = Object.keys(allRows[0] || {});
  const type = isQualityFile(headers) ? "quality" : (isProductionFile(headers) ? "production" : "unknown");

  if (type === "quality") {
    const rows = allRows.map((r, i) => ({
      id: "q_" + Date.now() + "_" + i,
      date: dateToISO(get(r, ["date", "inspection date", "sample date", "created on", "תאריך"])),
      facility: normalizeFacilityId(get(r, ["facility", "storage location", "site", "מתקן"])),
      order: String(get(r, ["process order", "process order #", "order", "פקודת עבודה"]) || ""),
      batch: String(get(r, ["batch", "batch number", "אצווה"]) || ""),
      material: String(get(r, ["material description", "material", "שם חומר"]) || ""),
      inspectionLot: String(get(r, ["inspection lot", "inspection lot #"]) || ""),
      status: classifyQuality(r),
      source: file.name
    })).filter(r => r.order || r.batch || r.inspectionLot);
    return { type, rows, message: `נטענו ${rows.length} רשומות איכות` };
  }

  const rows = allRows.map((r, i) => ({
    id: "e_" + Date.now() + "_" + i,
    date: dateToISO(get(r, ["date", "posting date", "actual finish date", "תאריך"])),
    facility: normalizeFacilityId(get(r, ["facility", "storage location", "site", "מתקן"])),
    packagingLine: detectPackagingLine(r),
    shift: String(get(r, ["shift", "משמרת"]) || ""),
    production: Number(get(r, ["production", "produced", "yield", "confirmed yield", "ייצור"]) || 0),
    packaging: Number(get(r, ["packaging", "packed", "delivered", "process order delivered", "אריזה", "נמסר"]) || 0),
    order: String(get(r, ["process order", "process order #", "order", "פקודת עבודה"]) || ""),
    batch: String(get(r, ["batch", "batch number", "אצווה"]) || ""),
    note: String(get(r, ["remarks", "note", "הערות"]) || ""),
    source: file.name
  })).filter(r => r.date || r.facility || r.order || r.batch || r.production || r.packaging);
  return { type, rows, message: `נטענו ${rows.length} רשומות ייצור/אריזה` };
}
