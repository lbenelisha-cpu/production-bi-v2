export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function calcDateRange(state) {
  if (state.viewMode === "day") {
    return { viewMode: "day", startDate: state.day, endDate: state.day, label: `יומי | ${state.day}` };
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
