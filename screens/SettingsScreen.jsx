// src/screens/SettingsScreen.jsx
import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Alle deine Kontexte importieren
import { usePlayers } from "../context/PlayersContext";
import { useCoins } from "../context/CoinsContext";
import { useCrystals } from "../context/CrystalsContext";
import { useAccountLevel } from "../context/AccountLevelContext";
// ggf. weitere: Missions, Settings, etc.

export default function SettingsScreen() {
  const { clearPlayers } = usePlayers();
  const { resetCoins } = useCoins();
  const { resetCrystals } = useCrystals();
  const { resetAccount } = useAccountLevel();

  // ✅ Globaler Reset
  const handleClearAccount = useCallback(() => {
    Alert.alert(
      "⚠️ Account zurücksetzen?",
      "Das wird ALLES löschen: Charaktere, Fortschritt, Level, Währung und Inventar!",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Ja, löschen",
          style: "destructive",
          onPress: async () => {
            try {
              // Zuerst alle Contexts zurücksetzen
              clearPlayers();
              resetCoins();
              resetCrystals();
              resetAccount();
              // ggf. weitere Context-Resets

              // Dann kompletten AsyncStorage leeren
              await AsyncStorage.clear();

              Alert.alert(
                "✅ Erfolgreich",
                "Dein Account wurde vollständig gelöscht!"
              );
            } catch (err) {
              console.error("Fehler beim Reset:", err);
              Alert.alert(
                "❌ Fehler",
                "Der Account konnte nicht vollständig gelöscht werden. Bitte versuche es erneut."
              );
            }
          },
        },
      ]
    );
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>⚙️ Einstellungen</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAccount}>
          <Text style={styles.clearText}>🗑️ Gesamten Account löschen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220" },
  content: { padding: 20, paddingBottom: 40 },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  section: { marginBottom: 30 },
  sectionTitle: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  clearBtn: {
    backgroundColor: "#B71C1C",
    paddingVertical: 14,
    borderRadius: 10,
  },
  clearText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
