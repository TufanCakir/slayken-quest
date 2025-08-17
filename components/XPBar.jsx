import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function XPBar({ xp, maxXp, level, width = 200, height = 20 }) {
  const progress = Math.min(xp / maxXp, 1); // 0–1

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Hintergrund */}
      <View style={styles.barBackground} />

      {/* Fortschritt mit Gradient */}
      <LinearGradient
        colors={["#2196F3", "#64B5F6"]} // Blau → Hellblau
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.barFill, { width: `${progress * 100}%` }]}
      />

      {/* Text in der Mitte */}
      <Text style={styles.text}>
        {xp}/{maxXp} XP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#272b45",
    position: "relative",
  },
  barBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#222",
  },
  barFill: {
    height: "100%",
    borderRadius: 20,
  },
  text: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
