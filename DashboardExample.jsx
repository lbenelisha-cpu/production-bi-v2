import React, { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import DateRangeMenu from "./DateRangeMenu";
import { filterRowsByDateRange } from "./dateRangeUtils";

const demoRows = [
  { date: "2026-06-01", facility: "1542", production: 42000, packaging: 39000 },
  { date: "2026-06-10", facility: "1543", production: 61000, packaging: 58000 },
  { date: "2026-07-02", facility: "1519", production: 24000, packaging: 21000 },
];

export default function DashboardExample() {
  const [range, setRange] = useState(null);

  const filteredRows = useMemo(() => {
    if (!range) return demoRows;
    return filterRowsByDateRange(demoRows, range, "date");
  }, [range]);

  const totalProduction = filteredRows.reduce((sum, row) => sum + Number(row.production || 0), 0);
  const totalPackaging = filteredRows.reduce((sum, row) => sum + Number(row.packaging || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#111417", padding: 16 }}>
      <DateRangeMenu onChange={setRange} />

      <Text style={{ color: "#fff", marginTop: 18, textAlign: "right", fontWeight: "900" }}>
        נתונים מסוננים לפי התאריך שנבחר
      </Text>

      <Text style={{ color: "#36C2B4", marginTop: 8, textAlign: "right" }}>
        רשומות: {filteredRows.length} | ייצור: {totalProduction} | אריזה: {totalPackaging}
      </Text>

      <FlatList
        data={filteredRows}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        renderItem={({ item }) => (
          <Text style={{ color: "#fff", textAlign: "right", marginTop: 8 }}>
            {item.date} | מתקן {item.facility} | ייצור {item.production} | אריזה {item.packaging}
          </Text>
        )}
      />
    </View>
  );
}
