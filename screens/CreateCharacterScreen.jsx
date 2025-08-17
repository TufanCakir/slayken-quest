// src/screens/CreateCharacterScreen.jsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import Player from "../components/Player";
import playersData from "../data/players.json";
import { usePlayers } from "../context/PlayerContext";

// 🎨 Farbsets
import berserkerColors from "../data/berserkerColors";
import demonHunterColors from "../data/demonHunterColors";
import paladinColors from "../data/paladinColors";
import assassinColors from "../data/assassinColors";
import mageColors from "../data/mageColors";
import necromancerColors from "../data/necromancerColors";
import rangerColors from "../data/rangerColors";
import deathKnightColors from "../data/deathKnightColors";

// 🔑 Mapping → Klasse → Farbset
const CLASS_COLORS = {
  Berserker: berserkerColors,
  DemonHunter: demonHunterColors,
  DeathKnight: deathKnightColors,
  Paladin: paladinColors,
  Assassin: assassinColors,
  Mage: mageColors,
  Necromancer: necromancerColors,
  Ranger: rangerColors,
};

// 🔑 Utils
const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uniq = (arr) => [...new Set(arr)].filter(Boolean);

const RANDOM_NAMES = [
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
const ColorSwatch = React.memo(function ColorSwatch({
  color,
  selected,
  onPress,
}) {
  const [bg, border] = Array.isArray(color)
    ? [color[0], color[color.length - 1]]
    : [color, "#444"];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.colorBox,
        { backgroundColor: bg, borderColor: border },
        selected && styles.colorBoxSelected,
      ]}
    />
  );
});

// 🔧 Accordion-Section
const ColorSection = React.memo(function ColorSection({
  label,
  colors,
  selected,
  onSelect,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{label}</Text>
        <Text style={styles.sectionToggle}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <FlatList
          data={colors}
          keyExtractor={(_, idx) => `${label}-${idx}`}
          numColumns={8}
          scrollEnabled={false}
          contentContainerStyle={styles.colorGrid}
          renderItem={({ item }) => (
            <ColorSwatch
              color={item}
              selected={selected === item}
              onPress={() => onSelect(item)}
            />
          )}
        />
      )}
    </View>
  );
});

// 🔧 Klassen-Button
function ClassButton({ cls, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.classBtn, active && styles.classBtnActive]}
      onPress={onPress}
    >
      <Text style={[styles.classBtnText, active && styles.classBtnTextActive]}>
        {cls}
      </Text>
    </TouchableOpacity>
  );
}

export default function CreateCharacterScreen({ navigation }) {
  const { players, addPlayer } = usePlayers();
  const allClasses = useMemo(() => uniq(playersData.map((p) => p.class)), []);

  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState(allClasses[0]);

  // Defaults für Sprite
  const buildSpriteDefaults = useCallback((cls) => {
    const base = CLASS_COLORS[cls] || {};
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );
  }, []);

  const [sprite, setSprite] = useState(() =>
    buildSpriteDefaults(selectedClass)
  );

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSprite(buildSpriteDefaults(cls));
  };

  // 🎲 Zufallsgenerator
  const handleRandomize = () => {
    const cls = randomOf(allClasses);
    const base = CLASS_COLORS[cls] || {};
    const randomSprite = Object.fromEntries(
      Object.entries(base).map(([k, v]) => [
        k,
        Array.isArray(v) ? randomOf(v) : v,
      ])
    );

    setSelectedClass(cls);
    setSprite(randomSprite);
    setName(randomOf(RANDOM_NAMES));
  };

  // Verfügbare Farben
  const availableColors = useMemo(() => {
    const base = CLASS_COLORS[selectedClass] || {};
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Array.isArray(v) ? v : [v]])
    );
  }, [selectedClass]);

  const updateSprite = useCallback(
    (k, v) => setSprite((prev) => ({ ...prev, [k]: v })),
    []
  );

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

      {/* 🎲 Zufällig */}
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
        {allClasses.map((cls) => (
          <ClassButton
            key={cls}
            cls={cls}
            active={selectedClass === cls}
            onPress={() => handleClassChange(cls)}
          />
        ))}
      </View>

      {/* Farbauswahl */}
      {Object.entries(availableColors).map(([key, colors]) =>
        colors?.length ? (
          <ColorSection
            key={key}
            label={key}
            colors={colors}
            selected={sprite[key]}
            onSelect={(c) => updateSprite(key, c)}
          />
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

  // Accordion
  section: { marginTop: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#1a1d2e",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#272b45",
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sectionToggle: { color: "#aaa", fontSize: 14 },

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

  colorGrid: { marginTop: 8, justifyContent: "flex-start" },
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
