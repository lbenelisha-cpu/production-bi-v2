import { facilityTargets, packagingLineTargets, normalizeFacilityId } from "../data/defaults.js";

export const SETTINGS_KEY = "adama_production_bi_settings_v2";
export const ENTRIES_KEY = "adama_production_bi_entries_v1";
export const QUALITY_KEY = "adama_production_bi_quality_v1";
export const IMPORT_STATUS_KEY = "adama_production_bi_import_status_v1";

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const facilities = (saved.facilities || facilityTargets)
      .map(f => ({ ...f, id: normalizeFacilityId(f.id), name: f.id === "28" ? "מתקן 1528" : f.name }))
      .filter((f, index, arr) => arr.findIndex(x => x.id === f.id) === index);
    return { facilities, lines: saved.lines || packagingLineTargets, audit: saved.audit || [] };
  } catch {
    return { facilities: facilityTargets, lines: packagingLineTargets, audit: [] };
  }
}
export function saveSettings(settings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

export function loadEntries() {
  try { return JSON.parse(localStorage.getItem(ENTRIES_KEY) || "[]").map(e => ({ ...e, facility: normalizeFacilityId(e.facility) })); }
  catch { return []; }
}
export function saveEntries(entries) { localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries)); }

export function loadQuality() {
  try { return JSON.parse(localStorage.getItem(QUALITY_KEY) || "[]").map(e => ({ ...e, facility: normalizeFacilityId(e.facility) })); }
  catch { return []; }
}
export function saveQuality(rows) { localStorage.setItem(QUALITY_KEY, JSON.stringify(rows)); }

export function loadImportStatus() {
  try { return JSON.parse(localStorage.getItem(IMPORT_STATUS_KEY) || "{}"); }
  catch { return {}; }
}
export function saveImportStatus(status) { localStorage.setItem(IMPORT_STATUS_KEY, JSON.stringify(status)); }

export function fmt(n) { return Math.round(Number(n || 0)).toLocaleString("en-US"); }
export function todayISO() { return new Date().toISOString().slice(0, 10); }
