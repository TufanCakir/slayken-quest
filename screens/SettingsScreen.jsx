// src/screens/SettingsScreen.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates"; // ⬅️ wichtig für reload()

export default function SettingsScreen() {
  // 🔹 Alles löschen + Reload
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert(
        "✅ Erfolgreich",
        "Alle gespeicherten Daten wurden gelöscht.",
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                // App reloaden (Context/States neu initialisieren)
                await Updates.reloadAsync();
              } catch (reloadErr) {
                console.warn("Fehler beim Reload:", reloadErr);
              }
            },
          },
        ]
      );
    } catch (err) {
      console.warn("Fehler beim Löschen von AsyncStorage:", err);
      Alert.alert("⚠️ Fehler", "Die Daten konnten nicht gelöscht werden.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Einstellungen</Text>

      <TouchableOpacity style={styles.button} onPress={handleClearStorage}>
        <Text style={styles.buttonText}>🗑 Alles zurücksetzen</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Drücke den Button, um alle gespeicherten Daten (Spielstände, Coins,
        Quests, Einstellungen) zu löschen. Danach wird die App neu geladen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
