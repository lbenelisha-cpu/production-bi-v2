import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import {
  todayISO,
  addDays,
  shiftMonth,
  getQuarterFromDate,
  calcDateRange,
} from "./dateRangeUtils";

const MODES = [
  { key: "day", label: "יומי" },
  { key: "month", label: "חודשי" },
  { key: "quarter", label: "רבעוני" },
  { key: "year", label: "שנתי" },
  { key: "custom", label: "טווח חופשי" },
];

export default function DateFilterBar({ onRangeChange }) {
  const today = todayISO();
  const now = new Date();

  const [state, setState] = useState({
    viewMode: "month",
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
    const nextState = { ...state, ...next };
    setState(nextState);
    const nextRange = calcDateRange(nextState);
    if (onRangeChange) onRangeChange(nextRange);
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

    if (state.viewMode === "year") update({ year: Number(state.year) + delta });

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
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.title}>📅 תקופת תצוגה</Text>
        <Text style={styles.rangeLabel}>{range.label}</Text>
      </View>

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

      <View style={styles.inputRow}>
        {state.viewMode === "day" && (
          <Input label="תאריך" value={state.day} onChangeText={(v) => update({ day: v })} />
        )}

        {state.viewMode === "month" && (
          <Input label="חודש" value={state.month} onChangeText={(v) => update({ month: v })} />
        )}

        {state.viewMode === "quarter" && (
          <>
            <Input label="רבעון" value={String(state.quarter)} onChangeText={(v) => update({ quarter: Number(v) })} />
            <Input label="שנה" value={String(state.quarterYear)} onChangeText={(v) => update({ quarterYear: Number(v) })} />
          </>
        )}

        {state.viewMode === "year" && (
          <Input label="שנה" value={String(state.year)} onChangeText={(v) => update({ year: Number(v) })} />
        )}

        {state.viewMode === "custom" && (
          <>
            <Input label="מתאריך" value={state.startDate} onChangeText={(v) => update({ startDate: v })} />
            <Input label="עד תאריך" value={state.endDate} onChangeText={(v) => update({ endDate: v })} />
          </>
        )}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => movePeriod(-1)}>
          <Text style={styles.navText}>◀ תקופה קודמת</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={setCurrentPeriod}>
          <Text style={styles.navText}>נוכחי</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => movePeriod(1)}>
          <Text style={styles.navText}>תקופה הבאה ▶</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rangeText}>טווח פעיל: {range.startDate} - {range.endDate}</Text>
    </View>
  );
}

function Input({ label, value, onChangeText }) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#141A20",
    borderColor: "#2F3B46",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    marginBottom: 18,
  },
  topRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: "#F2F4F6",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
  },
  rangeLabel: {
    color: "#36C2B4",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "left",
  },
  tabs: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    backgroundColor: "#202832",
    borderColor: "#344151",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  activeTab: {
    backgroundColor: "rgba(244,166,35,.16)",
    borderColor: "#F4A623",
  },
  tabText: {
    color: "#B8C4D6",
    fontWeight: "800",
  },
  activeTabText: {
    color: "#F4A623",
  },
  inputRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  inputBox: {
    minWidth: 150,
    flex: 1,
  },
  inputLabel: {
    color: "#A8B0B8",
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    backgroundColor: "#0E1318",
    borderColor: "#344151",
    borderWidth: 1,
    borderRadius: 10,
    color: "#F2F4F6",
    padding: 10,
    textAlign: "right",
  },
  navRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  navBtn: {
    backgroundColor: "#202832",
    borderColor: "#344151",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  navText: {
    color: "#F2F4F6",
    fontWeight: "800",
  },
  rangeText: {
    color: "#9FC6FF",
    textAlign: "right",
    fontWeight: "800",
  },
});
