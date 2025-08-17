import React from "react";
import { View, Text as RNText, StyleSheet, Pressable } from "react-native";

export default function MapSelector({
  maps = [],
  onSelect = () => {},
  currentMap = null,
}) {
  return (
    <View style={styles.container}>
      <RNText style={styles.title}>Karte wählen</RNText>
      <View style={styles.maps}>
        {maps.length > 0 ? (
          maps.map((map, idx) => {
            const isSelected = currentMap === map.name;
            return (
              <Pressable
                key={idx}
                style={[styles.mapBtn, isSelected && styles.selected]}
                onPress={() => onSelect(map.name)}
                android_ripple={{ color: "#FFD70033" }}
              >
                <RNText
                  style={[styles.mapName, isSelected && styles.mapNameSelected]}
                >
                  {map.icon} {map.name}
                </RNText>
              </Pressable>
            );
          })
        ) : (
          <RNText style={styles.empty}>Keine Karten verfügbar</RNText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  title: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  maps: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mapBtn: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#FFD700",
    backgroundColor: "#444",
  },
  mapName: {
    color: "#fff",
    fontSize: 16,
  },
  mapNameSelected: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  empty: {
    color: "#aaa",
    fontStyle: "italic",
    fontSize: 14,
  },
});
