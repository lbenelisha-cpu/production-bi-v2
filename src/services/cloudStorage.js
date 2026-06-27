import { supabase, supabaseEnabled } from "./supabaseClient.js";

function toFacilityApp(row) {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    targetType: row.target_type,
    productionTarget: Number(row.production_target || 0),
    packagingTarget: Number(row.packaging_target || 0),
    active: Boolean(row.active)
  };
}
function toFacilityDb(row) {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    target_type: row.targetType,
    production_target: row.productionTarget,
    packaging_target: row.packagingTarget,
    active: row.active
  };
}
function toLineApp(row) {
  return { id: row.id, name: row.name, dailyTarget: Number(row.daily_target || 0), unit: row.unit, active: row.active };
}
function toLineDb(row) {
  return { id: row.id, name: row.name, daily_target: row.dailyTarget, unit: row.unit, active: row.active ?? true };
}
function toEntryApp(row) {
  return {
    id: row.id, date: row.date, facility: row.facility, packagingLine: row.packaging_line, shift: row.shift,
    production: Number(row.production || 0), packaging: Number(row.packaging || 0),
    order: row.order_no || "", batch: row.batch || "", note: row.note || "", source: row.source || ""
  };
}
function toEntryDb(row) {
  return {
    id: row.id, date: row.date || null, facility: row.facility || null, packaging_line: row.packagingLine || null, shift: row.shift || null,
    production: Number(row.production || 0), packaging: Number(row.packaging || 0),
    order_no: row.order || null, batch: row.batch || null, note: row.note || null, source: row.source || null
  };
}
function toQualityApp(row) {
  return {
    id: row.id, date: row.date, facility: row.facility, order: row.order_no || "", batch: row.batch || "",
    material: row.material || "", inspectionLot: row.inspection_lot || "", status: row.status || "ok", source: row.source || ""
  };
}
function toQualityDb(row) {
  return {
    id: row.id, date: row.date || null, facility: row.facility || null, order_no: row.order || null, batch: row.batch || null,
    material: row.material || null, inspection_lot: row.inspectionLot || null, status: row.status || "ok", source: row.source || null
  };
}

export async function cloudLoadAll() {
  if (!supabaseEnabled) throw new Error("Supabase לא מוגדר");
  const [facilities, lines, entries, quality] = await Promise.all([
    supabase.from("facilities").select("*").order("id", { ascending: false }),
    supabase.from("packaging_lines").select("*").order("id"),
    supabase.from("production_entries").select("*").order("date", { ascending: false }),
    supabase.from("quality_entries").select("*").order("date", { ascending: false })
  ]);
  for (const res of [facilities, lines, entries, quality]) if (res.error) throw res.error;
  return {
    settings: {
      facilities: facilities.data.map(toFacilityApp),
      lines: lines.data.map(toLineApp),
      audit: []
    },
    entries: entries.data.map(toEntryApp),
    quality: quality.data.map(toQualityApp)
  };
}

export async function cloudSaveSettings(settings) {
  if (!supabaseEnabled) throw new Error("Supabase לא מוגדר");
  const { error: fErr } = await supabase.from("facilities").upsert(settings.facilities.map(toFacilityDb));
  if (fErr) throw fErr;
  const { error: lErr } = await supabase.from("packaging_lines").upsert(settings.lines.map(toLineDb));
  if (lErr) throw lErr;
}

export async function cloudReplaceEntries(entries) {
  if (!supabaseEnabled) throw new Error("Supabase לא מוגדר");
  const { error: delErr } = await supabase.from("production_entries").delete().neq("id", "__never__");
  if (delErr) throw delErr;
  if (!entries.length) return;
  const { error } = await supabase.from("production_entries").upsert(entries.map(toEntryDb));
  if (error) throw error;
}

export async function cloudReplaceQuality(rows) {
  if (!supabaseEnabled) throw new Error("Supabase לא מוגדר");
  const { error: delErr } = await supabase.from("quality_entries").delete().neq("id", "__never__");
  if (delErr) throw delErr;
  if (!rows.length) return;
  const { error } = await supabase.from("quality_entries").upsert(rows.map(toQualityDb));
  if (error) throw error;
}
