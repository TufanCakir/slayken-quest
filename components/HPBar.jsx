// src/components/HPBar.jsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function HPBar({
  current = 0,
  max = 100,
  width = 150,
  height = 16,
  showText = true,
  colors = { high: "#4CAF50", mid: "#FF9800", low: "#F44336" },
}) {
  // Sicherheit: Division durch 0 verhindern
  const safeMax = Math.max(1, max);
  const percentage = Math.max(0, current / safeMax);

  // 🔹 Animierter Wert
  const animatedWidth = useRef(new Animated.Value(width * percentage)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: width * percentage,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [percentage, width]);

  // 🔹 Farbe je nach HP
  const barColor =
    percentage > 0.6 ? colors.high : percentage > 0.3 ? colors.mid : colors.low;

  return (
    <View
      style={[styles.container, { width, height }]}
      accessible
      accessibilityLabel={`HP ${current} von ${max}`}
    >
      <Animated.View
        style={[
          styles.fill,
          { width: animatedWidth, backgroundColor: barColor },
        ]}
      />
      {showText && (
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            {current}/{max}
          </Text>
        </View>
      )}
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
    justifyContent: "center",
  },
  fill: {
    height: "100%",
  },
  textWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
