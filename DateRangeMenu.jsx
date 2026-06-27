import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { calcDateRange, todayISO } from "./dateRangeUtils";

const MODES = [
  { key: "day", label: "יומי" },
  { key: "month", label: "חודשי" },
  { key: "quarter", label: "רבעוני" },
  { key: "year", label: "שנתי" },
  { key: "custom", label: "טווח חופשי" },
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function addDays(iso, delta) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function shiftMonth(ym, delta) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function getQuarterFromDate(date = new Date()) {
  return Math.floor(date.getMonth() / 3) + 1;
}

export default function DateRangeMenu({ onChange }) {
  const today = todayISO();
  const now = new Date();

  const [state, setState] = useState({
    viewMode: "day",
    day: today,
    month: today.slice(0, 7),
    quarter: getQuarterFromDate(now),
    quarterYear: now.getFullYear(),
    year: now.getFullYear(),
    startDate: today,
    endDate: today,
  });

  const range = useMemo(() => calcDateRange(state), [state]);

  function update(next) {
    const newState = { ...state, ...next };
    setState(newState);
    const newRange = calcDateRange(newState);
    if (onChange) onChange(newRange);
  }

  function movePeriod(delta) {
    if (state.viewMode === "day") update({ day: addDays(state.day, delta) });
    if (state.viewMode === "month") update({ month: shiftMonth(state.month, delta) });

    if (state.viewMode === "quarter") {
      let q = state.quarter + delta;
      let y = state.quarterYear;
      if (q < 1) { q = 4; y -= 1; }
      if (q > 4) { q = 1; y += 1; }
      update({ quarter: q, quarterYear: y });
    }

    if (state.viewMode === "year") update({ year: state.year + delta });

    if (state.viewMode === "custom") {
      const start = new Date(state.startDate);
      const end = new Date(state.endDate);
      const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
      update({
        startDate: addDays(state.startDate, delta * days),
        endDate: addDays(state.endDate, delta * days),
      });
    }
  }

  function setCurrentPeriod() {
    const d = new Date();
    update({
      day: todayISO(),
      month: todayISO().slice(0, 7),
      quarter: getQuarterFromDate(d),
      quarterYear: d.getFullYear(),
      year: d.getFullYear(),
      startDate: todayISO(),
      endDate: todayISO(),
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 תקופת תצוגה</Text>

      <View style={styles.tabs}>
        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            style={[styles.tab, state.viewMode === mode.key && styles.activeTab]}
            onPress={() => update({ viewMode: mode.key })}
          >
            <Text style={[styles.tabText, state.viewMode === mode.key && styles.activeTabText]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.fields}>
        {state.viewMode === "day" && (
          <Field label="תאריך YYYY-MM-DD" value={state.day} onChangeText={(v) => update({ day: v })} />
        )}

        {state.viewMode === "month" && (
          <Field label="חודש YYYY-MM" value={state.month} onChangeText={(v) => update({ month: v })} />
        )}

        {state.viewMode === "quarter" && (
          <>
            <Field label="רבעון 1-4" value={String(state.quarter)} onChangeText={(v) => update({ quarter: Number(v) })} />
            <Field label="שנה" value={String(state.quarterYear)} onChangeText={(v) => update({ quarterYear: Number(v) })} />
          </>
        )}

        {state.viewMode === "year" && (
          <Field label="שנה" value={String(state.year)} onChangeText={(v) => update({ year: Number(v) })} />
        )}

        {state.viewMode === "custom" && (
          <>
            <Field label="מתאריך YYYY-MM-DD" value={state.startDate} onChangeText={(v) => update({ startDate: v })} />
            <Field label="עד תאריך YYYY-MM-DD" value={state.endDate} onChangeText={(v) => update({ endDate: v })} />
          </>
        )}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => movePeriod(-1)}>
          <Text style={styles.navText}>◀ תקופה קודמת</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={setCurrentPeriod}>
          <Text style={styles.navText}>תקופה נוכחית</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => movePeriod(1)}>
          <Text style={styles.navText}>תקופה הבאה ▶</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.summary}>תצוגה: {range.label}</Text>
      <Text style={styles.summary}>טווח: {range.startDate} - {range.endDate}</Text>
    </View>
  );
}

function Field({ label, value, onChangeText }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#1B2025", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#323B43" },
  title: { color: "#F2F4F6", fontSize: 20, fontWeight: "900", marginBottom: 12, textAlign: "right" },
  tabs: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  tab: { backgroundColor: "#242B31", borderColor: "#323B43", borderWidth: 1, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 13 },
  activeTab: { backgroundColor: "rgba(244,166,35,.16)", borderColor: "#F4A623" },
  tabText: { color: "#A8B0B8", fontWeight: "800" },
  activeTabText: { color: "#F4A623" },
  fields: { gap: 10, marginBottom: 14 },
  field: { gap: 6 },
  label: { color: "#A8B0B8", fontWeight: "800", textAlign: "right" },
  input: { backgroundColor: "#111417", borderColor: "#323B43", borderWidth: 1, borderRadius: 10, color: "#F2F4F6", padding: 10, textAlign: "right" },
  navRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  navButton: { backgroundColor: "#242B31", borderColor: "#323B43", borderWidth: 1, borderRadius: 10, padding: 10 },
  navText: { color: "#F2F4F6", fontWeight: "800" },
  summary: { color: "#36C2B4", backgroundColor: "rgba(54,194,180,.10)", borderColor: "rgba(54,194,180,.42)", borderWidth: 1, borderRadius: 12, padding: 10, marginTop: 6, textAlign: "right", fontWeight: "900" },
});
