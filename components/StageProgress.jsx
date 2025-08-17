// src/components/StageProgress.jsx
import { View, Text, StyleSheet } from "react-native";

function StageProgress({ current, total }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Stage {current} / {total}
      </Text>
      <View style={styles.iconsRow}>
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i < current;
          return (
            <View
              key={i}
              style={[
                styles.icon,
                { backgroundColor: isActive ? "#ffd700" : "#555" },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

// Performance: Memoize StageProgress
import React from "react";
export default React.memo(StageProgress);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 6,
    zIndex: 1,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  iconsRow: {
    flexDirection: "row",
    gap: 6,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
