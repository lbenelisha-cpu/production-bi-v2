export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value)) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }

  const s = String(value).trim();

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
  }

  const t = Date.parse(s);
  if (!isNaN(t)) {
    const d = new Date(t);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  return null;
}

export function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function addDays(iso, delta) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function shiftMonth(ym, delta) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function getQuarterFromDate(date = new Date()) {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function calcDateRange(state) {
  if (state.viewMode === "day") {
    return {
      viewMode: "day",
      startDate: state.day,
      endDate: state.day,
      label: `יומי | ${state.day}`,
    };
  }

  if (state.viewMode === "month") {
    const [year, month] = state.month.split("-").map(Number);
    return {
      viewMode: "month",
      startDate: `${year}-${pad2(month)}-01`,
      endDate: `${year}-${pad2(month)}-${pad2(lastDayOfMonth(year, month))}`,
      label: `חודשי | ${state.month}`,
    };
  }

  if (state.viewMode === "quarter") {
    const startMonth = (state.quarter - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    return {
      viewMode: "quarter",
      startDate: `${state.quarterYear}-${pad2(startMonth)}-01`,
      endDate: `${state.quarterYear}-${pad2(endMonth)}-${pad2(lastDayOfMonth(state.quarterYear, endMonth))}`,
      label: `רבעוני | Q${state.quarter} ${state.quarterYear}`,
    };
  }

  if (state.viewMode === "year") {
    return {
      viewMode: "year",
      startDate: `${state.year}-01-01`,
      endDate: `${state.year}-12-31`,
      label: `שנתי | ${state.year}`,
    };
  }

  return {
    viewMode: "custom",
    startDate: state.startDate,
    endDate: state.endDate,
    label: `טווח חופשי | ${state.startDate} עד ${state.endDate}`,
  };
}

export function getRowDate(row, dateField) {
  return (
    parseDateOnly(row?.[dateField]) ||
    parseDateOnly(row?.date) ||
    parseDateOnly(row?.Date) ||
    parseDateOnly(row?.תאריך) ||
    parseDateOnly(row?.["תאריך דיווח"]) ||
    parseDateOnly(row?.report_date) ||
    parseDateOnly(row?.production_date) ||
    parseDateOnly(row?.createdAt)
  );
}

export function filterRowsByDateRange(rows, range, dateField = "date") {
  if (!Array.isArray(rows)) return [];
  if (!range || !range.startDate || !range.endDate) return rows;

  const start = parseDateOnly(range.startDate);
  const end = parseDateOnly(range.endDate);
  if (!start || !end) return rows;

  return rows.filter((row) => {
    const rowDate = getRowDate(row, dateField);
    if (!rowDate) return false;
    return rowDate >= start && rowDate <= end;
  });
}
