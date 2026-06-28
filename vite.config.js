export const facilityTargets = [
  { id: "1542", name: "מתקן 1542 / אריזה 42", unit: "ליטר", targetType: "packagingLines", productionTarget: 0, packagingTarget: 0, active: true },
  { id: "1543", name: "מתקן 1543 / אריזה 43", unit: "ליטר", targetType: "daily", productionTarget: 0, packagingTarget: 80000, active: true },
  { id: "1519", name: "מתקן 1519 / אריזה 19", unit: "ק״ג", targetType: "daily", productionTarget: 0, packagingTarget: 50000, active: true },
  { id: "1528", name: "מתקן 1528", unit: "ליטר", targetType: "daily", productionTarget: 80000, packagingTarget: 0, active: true },
  { id: "1524", name: "מתקן 1524", unit: "ליטר", targetType: "daily", productionTarget: 25000, packagingTarget: 0, active: true },
  { id: "1523", name: "מתקן 1523", unit: "ליטר", targetType: "daily", productionTarget: 60000, packagingTarget: 0, active: true }
];

export const packagingLineTargets = [
  { id: "1L", name: "קו אריזה 1 ליטר", dailyTarget: 20000, unit: "ליטר", active: true },
  { id: "5L", name: "קו אריזה 5 ליטר", dailyTarget: 60000, unit: "ליטר", active: true },
  { id: "10_20L", name: "קו אריזה 10/20 ליטר", dailyTarget: 60000, unit: "ליטר", active: true }
];

export function normalizeFacilityId(value) {
  const s = String(value || "").trim();
  if (!s) return "";
  const digits = s.replace(/[^\d]/g, "");
  const map = {
    "42": "1542",
    "43": "1543",
    "19": "1519",
    "28": "1528",
    "24": "1524",
    "23": "1523",
  };
  return map[digits] || digits || s;
}
