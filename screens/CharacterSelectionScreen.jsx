// src/screens/CharacterSelectionScreen.jsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import { usePlayers } from "../context/PlayersContext"; // ⬅️ globaler Context
import Player from "../components/Player";

export default function CharacterSelectionScreen() {
  const navigation = useNavigation();
  const { setSelectedPlayer } = useSelectedPlayer();
  const { players } = usePlayers(); // ⬅️ direkt aus Context
  const [selectedId, setSelectedId] = useState(null);

  // ✅ "Enter World"
  const handleStart = () => {
    const player = players.find((p) => p.id === selectedId);
    if (!player) {
      return Alert.alert(
        "❌ Kein Charakter",
        "Bitte wähle zuerst einen Charakter aus."
      );
    }
    setSelectedPlayer(player);
    navigation.navigate("BattleScreen");
  };

  // ✅ "Neuer Charakter"
  const handleCreateNew = () => navigation.navigate("CreateCharacterScreen");

  // ✅ Player Card
  const renderPlayerCard = useCallback(
    ({ item }) => {
      const isActive = item.id === selectedId;
      return (
        <TouchableOpacity
          style={[styles.card, isActive && styles.cardActive]}
          onPress={() => setSelectedId(item.id)}
          activeOpacity={0.85}
        >
          {/* Dynamisches Sprite */}
          <Player size={100} playerClass={item.class} sprite={item.sprite} />

          {/* Infos */}
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            {item.class} | Level {item.level}
          </Text>
          <Text style={styles.stats}>
            ❤️ {item.hp.current}/{item.hp.max} | 💰 {item.gold}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedId]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charakter auswählen</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayerCard}
        horizontal
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Keine Charaktere gefunden</Text>
            <TouchableOpacity
              style={[styles.mainBtn, { backgroundColor: "#2196F3" }]}
              onPress={handleCreateNew}
              activeOpacity={0.9}
            >
              <Text style={styles.mainBtnText}>
                + Neuen Charakter erstellen
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Buttons */}
      {players.length > 0 && (
        <>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: "#4CAF50" }]}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <Text style={styles.mainBtnText}>Enter World</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: "#2196F3" }]}
            onPress={handleCreateNew}
            activeOpacity={0.9}
          >
            <Text style={styles.mainBtnText}>+ Neuer Charakter</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220", paddingTop: 40 },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  listContent: { paddingHorizontal: 10 },
  card: {
    backgroundColor: "#1a1d2e",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    width: 160,
    transform: [{ scale: 0.96 }],
  },
  cardActive: {
    borderColor: "#FFD700",
    transform: [{ scale: 1 }],
  },
  name: { color: "#fff", fontSize: 16, marginTop: 8, fontWeight: "600" },
  details: { color: "#aaa", fontSize: 14 },
  stats: { color: "#888", fontSize: 13, marginTop: 4 },
  mainBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 95,
    marginTop: 20,
  },
  mainBtnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#aaa", fontSize: 16, marginBottom: 20 },
});
