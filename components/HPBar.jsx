// src/components/HPBar.jsx
import React from "react";
import { View, StyleSheet } from "react-native";

export default function HPBar({ current, max, width = 150, height = 16 }) {
  const percentage = Math.max(0, current / max);

  return (
    <View style={[styles.container, { width, height }]}>
      <View
        style={[
          styles.fill,
          {
            width: width * percentage,
            backgroundColor:
              percentage > 0.6
                ? "#4CAF50"
                : percentage > 0.3
                ? "#FF9800"
                : "#F44336",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
