import React, { useState } from "react";
import { View, Text } from "react-native";
import DateRangeMenu from "./DateRangeMenu";

export default function AppExample() {
  const [range, setRange] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#111417", padding: 16 }}>
      <DateRangeMenu onChange={setRange} />

      <Text style={{ color: "#fff", marginTop: 20, textAlign: "right" }}>
        כאן הדשבורד יקבל את הטווח:
      </Text>

      <Text style={{ color: "#36C2B4", marginTop: 8, textAlign: "right" }}>
        {range ? JSON.stringify(range, null, 2) : "בחר תקופה"}
      </Text>
    </View>
  );
}
