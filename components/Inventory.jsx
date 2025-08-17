import React from "react";
import {
  View,
  Text as RNText,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

export default function Inventory({ items = [], onItemPress }) {
  return (
    <View style={styles.container}>
      <RNText style={styles.title}>Inventar</RNText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.length > 0 ? (
          items.map((item, idx) => (
            <Pressable
              key={idx}
              style={styles.item}
              onPress={() => onItemPress?.(item)}
              accessibilityLabel={`Inventargegenstand: ${item.name}`}
              accessibilityHint="Tippe, um Details zu sehen"
            >
              <RNText style={styles.icon}>{item.icon}</RNText>
              <RNText style={styles.name}>{item.name}</RNText>
            </Pressable>
          ))
        ) : (
          <RNText style={styles.empty}>Inventar ist leer</RNText>
        )}
      </ScrollView>
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
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  empty: {
    color: "#aaa",
    fontSize: 14,
    fontStyle: "italic",
  },
});
