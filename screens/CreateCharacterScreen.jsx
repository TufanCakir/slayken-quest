// src/screens/CreateCharacterScreen.jsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Player from "../components/Player";
import classColors from "../data/classColors";
import playersData from "../data/players.json";
import { usePlayers } from "../context/PlayersContext";

// 🔑 Hilfsfunktionen
const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uniq = (arr) => [...new Set(arr)].filter(Boolean);

const randomNames = [
  "Thorgar",
  "Elyra",
  "Varok",
  "Kaelen",
  "Nyx",
  "Ravnar",
  "Zyra",
  "Aldor",
  "Xylen",
  "Morrik",
];

// 🔧 Farb-Swatch
function ColorSwatch({ color, selected, onPress }) {
  const [bg, border] = Array.isArray(color)
    ? [color[0], color[color.length - 1]]
    : [color, "#444"];

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.colorBox,
        { backgroundColor: bg, borderColor: border },
        selected && styles.colorBoxSelected,
      ]}
    />
  );
}

export default function CreateCharacterScreen({ navigation }) {
  const { players, addPlayer } = usePlayers();
  const allClasses = useMemo(() => uniq(playersData.map((p) => p.class)), []);

  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState(allClasses[0]);

  // 🎨 Standard-Sprite nach Klasse
  const buildSpriteDefaults = useCallback((cls) => {
    const base = classColors[cls] || {};
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );
  }, []);

  const [sprite, setSprite] = useState(() =>
    buildSpriteDefaults(selectedClass)
  );

  // Klasse wechseln
  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSprite(buildSpriteDefaults(cls));
  };

  // 🎲 Zufallsgenerator
  const handleRandomize = () => {
    const cls = randomOf(allClasses);
    const base = classColors[cls] || {};
    const randomSprite = Object.fromEntries(
      Object.entries(base).map(([k, v]) => [
        k,
        Array.isArray(v) ? randomOf(v) : v,
      ])
    );

    setSelectedClass(cls);
    setSprite(randomSprite);
    setName(randomOf(randomNames));
  };

  // Verfügbare Farben für aktuelle Klasse
  const availableColors = useMemo(() => {
    const base = classColors[selectedClass] || {};
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [
        k,
        Array.isArray(v)
          ? v
          : uniq(
              Object.values(classColors)
                .map((cls) => cls[k])
                .filter(Boolean)
            ),
      ])
    );
  }, [selectedClass]);

  const updateSprite = (k, v) => setSprite((prev) => ({ ...prev, [k]: v }));

  // ✅ Speichern
  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2)
      return Alert.alert("❌ Fehler", "Name muss mindestens 2 Zeichen haben.");

    if (players.some((p) => p.name?.toLowerCase() === trimmed.toLowerCase()))
      return Alert.alert("⚠️ Name belegt", "Bitte wähle einen anderen Namen.");

    try {
      const newPlayer = {
        id: `player_${Date.now()}`,
        name: trimmed,
        class: selectedClass,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        gold: 0,
        hp: { current: 100, max: 100 },
        sprite,
      };

      await addPlayer(newPlayer);
      Alert.alert("✅ Erfolg", `${trimmed} wurde erstellt!`);
      navigation.goBack();
    } catch (err) {
      console.warn("Fehler beim Speichern:", err);
      Alert.alert(
        "❌ Fehler",
        "Der Charakter konnte nicht gespeichert werden."
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Neuen Charakter erstellen</Text>

      {/* 🎲 Zufälliger Button */}
      <TouchableOpacity style={styles.randomBtn} onPress={handleRandomize}>
        <Text style={styles.randomText}>🎲 Zufälliger Charakter</Text>
      </TouchableOpacity>

      {/* Vorschau */}
      <View style={styles.preview}>
        <Player size={120} sprite={sprite} playerClass={selectedClass} />
      </View>

      {/* Name */}
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Charaktername"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        maxLength={20}
      />

      {/* Klassen-Auswahl */}
      <Text style={styles.label}>Klasse:</Text>
      <View style={styles.classList}>
        {allClasses.map((cls) => {
          const active = selectedClass === cls;
          return (
            <TouchableOpacity
              key={cls}
              style={[styles.classBtn, active && styles.classBtnActive]}
              onPress={() => handleClassChange(cls)}
            >
              <Text
                style={[
                  styles.classBtnText,
                  active && styles.classBtnTextActive,
                ]}
              >
                {cls}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Farbauswahl */}
      {Object.entries(availableColors).map(([key, colors]) =>
        colors?.length ? (
          <View key={key} style={{ marginTop: 12 }}>
            <Text style={styles.label}>{key}:</Text>
            <View style={styles.colorRow}>
              {colors.map((color, idx) => (
                <ColorSwatch
                  key={`${key}-${idx}`}
                  color={color}
                  selected={sprite[key] === color}
                  onPress={() => updateSprite(key, color)}
                />
              ))}
            </View>
          </View>
        ) : null
      )}

      {/* Speichern */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Charakter erstellen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  preview: { alignItems: "center", marginVertical: 20 },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  label: { color: "#fff", marginTop: 16, marginBottom: 6, fontSize: 16 },
  input: {
    backgroundColor: "#1a1d2e",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#272b45",
  },
  classList: { flexDirection: "row", flexWrap: "wrap" },
  classBtn: {
    backgroundColor: "#1a1d2e",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#272b45",
  },
  classBtnActive: { backgroundColor: "#FFD700", borderColor: "#FFD700" },
  classBtnText: { color: "#fff", fontWeight: "600" },
  classBtnTextActive: { color: "#222" },
  colorRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  colorBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    margin: 5,
    borderWidth: 2,
  },
  colorBoxSelected: {
    borderColor: "#fff",
    transform: [{ scale: 1.15 }],
    shadowColor: "#fff",
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 28,
  },
  saveText: {
    color: "#0f1220",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "800",
  },
  randomBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  randomText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
