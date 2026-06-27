export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseDateOnly(value) {
  if (!value) return "";
  if (value instanceof Date && !isNaN(value)) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }
  const s = String(value).trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(s)) {
    const [y, m, d] = s.slice(0, 10).split("-");
    return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
  }
  const m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
  if (m) {
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    return `${y}-${pad2(Number(m[2]))}-${pad2(Number(m[1]))}`;
  }
  const t = Date.parse(s);
  if (!isNaN(t)) {
    const d = new Date(t);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
  return "";
}

export function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function addDays(iso, delta) {
  const [y, m, d] = parseDateOnly(iso || todayISO()).split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function shiftMonth(ym, delta) {
  const [y, m] = String(ym || todayISO().slice(0, 7)).split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function currentQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function buildRange(filter) {
  const mode = filter.mode || "month";

  if (mode === "day") {
    return { mode, start: filter.day, end: filter.day, label: `יומי | ${filter.day}` };
  }

  if (mode === "month") {
    const [y, m] = filter.month.split("-").map(Number);
    return {
      mode,
      start: `${y}-${pad2(m)}-01`,
      end: `${y}-${pad2(m)}-${pad2(lastDayOfMonth(y, m))}`,
      label: `חודשי | ${filter.month}`
    };
  }

  if (mode === "quarter") {
    const startMonth = (Number(filter.quarter) - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    return {
      mode,
      start: `${filter.quarterYear}-${pad2(startMonth)}-01`,
      end: `${filter.quarterYear}-${pad2(endMonth)}-${pad2(lastDayOfMonth(filter.quarterYear, endMonth))}`,
      label: `רבעוני | Q${filter.quarter} ${filter.quarterYear}`
    };
  }

  if (mode === "year") {
    return { mode, start: `${filter.year}-01-01`, end: `${filter.year}-12-31`, label: `שנתי | ${filter.year}` };
  }

  return {
    mode,
    start: filter.startDate,
    end: filter.endDate,
    label: `טווח חופשי | ${filter.startDate} עד ${filter.endDate}`
  };
}

export function defaultDateFilter() {
  const t = todayISO();
  const d = new Date();
  return {
    mode: "month",
    day: t,
    month: t.slice(0, 7),
    quarter: currentQuarter(d),
    quarterYear: d.getFullYear(),
    year: d.getFullYear(),
    startDate: t,
    endDate: t
  };
}

export function moveDateFilter(filter, delta) {
  const next = { ...filter };
  if (next.mode === "day") next.day = addDays(next.day, delta);
  else if (next.mode === "month") next.month = shiftMonth(next.month, delta);
  else if (next.mode === "quarter") {
    next.quarter += delta;
    if (next.quarter < 1) { next.quarter = 4; next.quarterYear -= 1; }
    if (next.quarter > 4) { next.quarter = 1; next.quarterYear += 1; }
  } else if (next.mode === "year") {
    next.year = Number(next.year) + delta;
  } else {
    const start = new Date(next.startDate);
    const end = new Date(next.endDate);
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    next.startDate = addDays(next.startDate, delta * days);
    next.endDate = addDays(next.endDate, delta * days);
  }
  return next;
}

export function rowDate(row) {
  return (
    parseDateOnly(row?.date) ||
    parseDateOnly(row?.Date) ||
    parseDateOnly(row?.תאריך) ||
    parseDateOnly(row?.["תאריך דיווח"]) ||
    parseDateOnly(row?.report_date) ||
    parseDateOnly(row?.production_date) ||
    parseDateOnly(row?.createdAt)
  );
}

export function filterByDateRange(rows, range) {
  if (!Array.isArray(rows)) return [];
  if (!range?.start || !range?.end) return rows || [];
  return rows.filter(row => {
    const d = rowDate(row);
    return d && d >= range.start && d <= range.end;
  });
}

export function filterByDashboardFilters(rows, range, filters = {}) {
  return filterByDateRange(rows, range).filter(row => {
    if (filters.facility !== "all" && row.facility !== filters.facility) return false;
    if (filters.line !== "all" && row.packagingLine !== filters.line) return false;
    if (filters.shift !== "all" && row.shift !== filters.shift) return false;
    if (filters.order && !String(row.order || "").includes(filters.order)) return false;
    return true;
  });
}
