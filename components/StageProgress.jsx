import React from "react";
import { View, Text, StyleSheet } from "react-native";

function StageProgress({
  current,
  total,
  showLabel = true,
  activeColor = "#ffd700",
  inactiveColor = "#555",
  size = 12,
}) {
  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          Stage {current} / {total}
        </Text>
      )}
      <View style={styles.dotsRow}>
        {new Array(total).fill(null).map((_, i) => {
          const isActive = i < current;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: isActive ? activeColor : inactiveColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

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
    fontWeight: "600",
    marginBottom: 4,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    // Größe und Farbe kommen dynamisch
  },
});
