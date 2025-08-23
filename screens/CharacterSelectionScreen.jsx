// src/screens/CharacterSelectionScreen.jsx
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../context/PlayerContext";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import Player from "../components/Player";

export default function CharacterSelectionScreen({ navigation }) {
  const { players, setPlayers } = usePlayers();
  const { selectedPlayer, setSelectedPlayer } = useSelectedPlayer();

  // Spieler auswählen
  const handleSelect = useCallback(
    async (player) => {
      await setSelectedPlayer(player);
      Alert.alert("✅ Ausgewählt", `${player.name} ist jetzt aktiv!`);
      navigation.goBack(); // zurück, z. B. ins Hauptmenü
    },
    [setSelectedPlayer, navigation]
  );

  // Spieler löschen
  const handleDelete = useCallback(
    (id) => {
      Alert.alert(
        "⚠️ Spieler löschen",
        "Willst du diesen Charakter wirklich löschen?",
        [
          { text: "Abbrechen", style: "cancel" },
          {
            text: "Löschen",
            style: "destructive",
            onPress: () => {
              setPlayers((prev) => prev.filter((p) => p.id !== id));
            },
          },
        ]
      );
    },
    [setPlayers]
  );

  // Render Item
  const renderItem = useCallback(
    ({ item }) => {
      const isActive = selectedPlayer?.id === item.id;

      return (
        <View style={[styles.card, isActive && styles.cardActive]}>
          <Player size={100} sprite={item.sprite} playerClass={item.class} />
          <Text style={styles.name}>
            {item.name} (Lvl {item.level})
          </Text>
          <Text style={styles.class}>{item.class}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSelect]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.btnText}>
                {isActive ? "Aktiv" : "Auswählen"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnDelete]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.btnText}>Löschen</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [selectedPlayer, handleSelect, handleDelete]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charakterauswahl</Text>
      <FlashList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        estimatedItemSize={150}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>⚠️ Noch keine Charaktere erstellt.</Text>
        }
      />

      {/* Button: Neuen Charakter erstellen */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate("CreateCharacterScreen")}
      >
        <Text style={styles.createText}>➕ Neuen Charakter erstellen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 12,
  },
  list: { paddingBottom: 100 },

  card: {
    backgroundColor: "#1a1d2e",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#272b45",
  },
  cardActive: {
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "600", marginTop: 8 },
  class: { color: "#aaa", fontSize: 14, marginBottom: 8 },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnSelect: { backgroundColor: "#4CAF50" },
  btnDelete: { backgroundColor: "#e74c3c" },
  btnText: { color: "#fff", fontWeight: "700" },

  createBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  createText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  empty: { color: "#aaa", textAlign: "center", marginTop: 40, fontSize: 16 },
});
