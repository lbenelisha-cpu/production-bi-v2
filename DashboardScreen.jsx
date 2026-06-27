import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import DateFilterBar from "./DateFilterBar";
import { filterRowsByDateRange, todayISO, calcDateRange, getQuarterFromDate } from "./dateRangeUtils";

/**
 * DashboardScreen — Sprint 6
 *
 * כאן תפריט התאריכים כבר משובץ במסך הדשבורד עצמו.
 * המיקום:
 * כותרת דשבורד ראשי
 * ↓
 * DateFilterBar
 * ↓
 * כרטיסי KPI וגרפים
 *
 * props:
 * productionRows — נתוני ייצור ואריזה
 * qualityRows — נתוני איכות
 * eventRows — אירועים / חריגות
 */

export default function DashboardScreen({
  productionRows = [],
  qualityRows = [],
  eventRows = [],
}) {
  const today = todayISO();
  const now = new Date();

  const defaultRange = calcDateRange({
    viewMode: "month",
    day: today,
    month: today.slice(0, 7),
    quarter: getQuarterFromDate(now),
    quarterYear: now.getFullYear(),
    year: now.getFullYear(),
    startDate: today,
    endDate: today,
  });

  const [range, setRange] = useState(defaultRange);

  const filteredProduction = useMemo(
    () => filterRowsByDateRange(productionRows, range, "date"),
    [productionRows, range]
  );

  const filteredQuality = useMemo(
    () => filterRowsByDateRange(qualityRows, range, "date"),
    [qualityRows, range]
  );

  const filteredEvents = useMemo(
    () => filterRowsByDateRange(eventRows, range, "date"),
    [eventRows, range]
  );

  const totals = useMemo(() => {
    const totalPackaging = filteredProduction.reduce((s, r) => s + Number(r.packaging || r.packaging_qty || r["אריזה"] || 0), 0);
    const totalProduction = filteredProduction.reduce((s, r) => s + Number(r.production || r.production_qty || r["ייצור"] || 0), 0);
    const targetPackaging = filteredProduction.reduce((s, r) => s + Number(r.targetPackaging || r.target_packaging || r["יעד אריזה"] || 0), 0);
    const targetProduction = filteredProduction.reduce((s, r) => s + Number(r.targetProduction || r.target_production || r["יעד ייצור"] || 0), 0);

    return {
      totalPackaging,
      totalProduction,
      targetPackaging,
      targetProduction,
      packagingAchievement: targetPackaging > 0 ? Math.round((totalPackaging / targetPackaging) * 100) : 0,
      productionAchievement: targetProduction > 0 ? Math.round((totalProduction / targetProduction) * 100) : 0,
      qualityLots: filteredQuality.length,
      events: filteredEvents.length,
      rows: filteredProduction.length,
    };
  }, [filteredProduction, filteredQuality, filteredEvents]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>דשבורד ראשי</Text>
        <Text style={styles.subtitle}>תמונת מצב ייצור, אריזה, איכות והזמנות</Text>
      </View>

      <DateFilterBar onRangeChange={setRange} />

      <View style={styles.kpiGrid}>
        <KpiCard title="סה״כ אריזה" value={formatNumber(totals.totalPackaging)} sub="ליטר / ק״ג לפי התקן" color="#36C2B4" />
        <KpiCard title="יעד אריזה" value={formatNumber(totals.targetPackaging)} sub="מחושב מהגדרות המתקנים" color="#F4A623" />
        <KpiCard title="עמידה ביעד" value={`${totals.packagingAchievement}%`} sub="לפי נתונים בפועל" color={totals.packagingAchievement >= 90 ? "#36C2B4" : "#FF4D57"} />
        <KpiCard title="מנות איכות" value={formatNumber(totals.qualityLots)} sub={`אירועים בטווח: ${totals.events}`} color="#8AB4FF" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>סינון פעיל</Text>
        <Text style={styles.panelText}>תצוגה: {range.label}</Text>
        <Text style={styles.panelText}>טווח: {range.startDate} - {range.endDate}</Text>
        <Text style={styles.panelText}>רשומות ייצור/אריזה לאחר סינון: {totals.rows}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>כאן ממשיכים הגרפים</Text>
        <Text style={styles.panelText}>כל גרף צריך לקבל את `filteredProduction` במקום `productionRows`.</Text>
        <Text style={styles.panelText}>דוחות Excel ו־WhatsApp צריכים להשתמש באותו `range` ובאותם נתונים מסוננים.</Text>
      </View>
    </ScrollView>
  );
}

function KpiCard({ title, value, sub, color }) {
  return (
    <View style={[styles.kpiCard, { borderTopColor: color }]}>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiSub}>{sub}</Text>
    </View>
  );
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString("he-IL");
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0D1217",
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: "flex-end",
  },
  title: {
    color: "#F2F4F6",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "right",
  },
  subtitle: {
    color: "#9FC6FF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "right",
  },
  kpiGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 14,
  },
  kpiCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: "#182028",
    borderColor: "#314052",
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: 16,
    padding: 18,
  },
  kpiTitle: {
    color: "#B8C4D6",
    fontWeight: "900",
    textAlign: "right",
  },
  kpiValue: {
    color: "#F2F4F6",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "right",
    marginTop: 12,
  },
  kpiSub: {
    color: "#A8B0B8",
    textAlign: "right",
    marginTop: 8,
  },
  panel: {
    backgroundColor: "#182028",
    borderColor: "#314052",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 18,
  },
  panelTitle: {
    color: "#F2F4F6",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 10,
  },
  panelText: {
    color: "#B8C4D6",
    textAlign: "right",
    marginTop: 6,
    fontWeight: "700",
  },
});
