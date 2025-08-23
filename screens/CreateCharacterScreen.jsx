// src/screens/CreateCharacterScreen.jsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import Player from "../components/Player";
import { usePlayers } from "../context/PlayerContext";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";

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

// 🎭 Verfügbare Klassen (manuell festgelegt → keine Default-Chars)
const ALL_CLASSES = [
  "Berserker",
  "DemonHunter",
  "DeathKnight",
  "Paladin",
  "Assassin",
  "Mage",
  "Necromancer",
  "Ranger",
];

// Utils
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

// 🟩 Farb-Swatch
const ColorSwatch = React.memo(({ color, selected, onPress }) => {
  const [bg, border] = Array.isArray(color)
    ? [color[0], color[color.length - 1]]
    : [color, "#444"];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.colorBox,
        { backgroundColor: bg, borderColor: border },
        selected === color && styles.colorBoxSelected,
      ]}
    />
  );
});

// 🎨 Farb-Section (Accordion)
const ColorSection = React.memo(({ label, colors, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const numColumns = 8;
  const itemSize = 42;
  const rows = Math.ceil(colors.length / numColumns);
  const gridHeight = Math.min(rows * itemSize, 240);

  const renderItem = useCallback(
    ({ item }) => (
      <ColorSwatch
        color={item}
        selected={selected}
        onPress={() => onSelect(item)}
      />
    ),
    [onSelect, selected]
  );

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
        <View style={{ height: gridHeight }}>
          <FlashList
            data={colors}
            keyExtractor={(item, idx) => `${label}-${idx}`}
            renderItem={renderItem}
            estimatedItemSize={itemSize}
            numColumns={numColumns}
            contentContainerStyle={styles.colorGrid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
});

// 🛡️ Klassen-Button
const ClassButton = React.memo(({ cls, active, onPress }) => (
  <TouchableOpacity
    style={[styles.classBtn, active && styles.classBtnActive]}
    onPress={onPress}
  >
    <Text style={[styles.classBtnText, active && styles.classBtnTextActive]}>
      {cls}
    </Text>
  </TouchableOpacity>
));

export default function CreateCharacterScreen({ navigation }) {
  const { players, addPlayer } = usePlayers();
  const { setSelectedPlayer } = useSelectedPlayer();

  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState(ALL_CLASSES[0]);

  // Defaults
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

  // Zufallsbutton
  const handleRandomize = () => {
    const cls = randomOf(ALL_CLASSES);
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

  // Farben je Klasse
  const availableColors = useMemo(() => {
    const base = CLASS_COLORS[selectedClass] || {};
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Array.isArray(v) ? v : [v]])
    );
  }, [selectedClass]);

  const updateSprite = (k, v) =>
    setSprite((prev) => (prev[k] === v ? prev : { ...prev, [k]: v }));

  // Speichern
  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      Alert.alert("❌ Fehler", "Name muss mindestens 2 Zeichen haben.");
      return;
    }

    if (players.some((p) => p.name?.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("⚠️ Name belegt", "Bitte wähle einen anderen Namen.");
      return;
    }

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
      await setSelectedPlayer(newPlayer);

      Alert.alert("✅ Erfolg", `${trimmed} wurde erstellt!`);
      navigation.goBack();
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      Alert.alert(
        "❌ Fehler",
        "Der Charakter konnte nicht gespeichert werden."
      );
    }
  };

  return (
    <FlashList
      data={[
        { type: "header" },
        { type: "random" },
        { type: "preview" },
        { type: "name" },
        { type: "classes" },
        ...Object.entries(availableColors).map(([key, colors]) => ({
          type: "colors",
          key,
          colors,
        })),
        { type: "save" },
      ]}
      estimatedItemSize={120}
      keyExtractor={(item, idx) =>
        item.type === "colors" ? `sec-${item.key}` : `${item.type}-${idx}`
      }
      renderItem={({ item }) => {
        switch (item.type) {
          case "header":
            return <Text style={styles.title}>Neuen Charakter erstellen</Text>;
          case "random":
            return (
              <TouchableOpacity
                style={styles.randomBtn}
                onPress={handleRandomize}
              >
                <Text style={styles.randomText}>🎲 Zufälliger Charakter</Text>
              </TouchableOpacity>
            );
          case "preview":
            return (
              <View style={styles.preview}>
                <Player
                  size={120}
                  sprite={sprite}
                  playerClass={selectedClass}
                />
              </View>
            );
          case "name":
            return (
              <View>
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
              </View>
            );
          case "classes":
            return (
              <View>
                <Text style={styles.label}>Klasse:</Text>
                <FlashList
                  data={ALL_CLASSES}
                  keyExtractor={(item) => `cls-${item}`}
                  renderItem={({ item }) => (
                    <ClassButton
                      cls={item}
                      active={selectedClass === item}
                      onPress={() => handleClassChange(item)}
                    />
                  )}
                  estimatedItemSize={44}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.classList}
                />
              </View>
            );
          case "colors":
            return (
              <ColorSection
                label={item.key}
                colors={item.colors}
                selected={sprite[item.key]}
                onSelect={(c) => updateSprite(item.key, c)}
              />
            );
          case "save":
            return (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Charakter erstellen</Text>
              </TouchableOpacity>
            );
          default:
            return null;
        }
      }}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 20, paddingBottom: 40, backgroundColor: "#0f1220" },
  preview: { alignItems: "center", marginVertical: 20 },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  label: { color: "#fff", marginTop: 16, marginBottom: 6, fontSize: 16 },
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
  classList: { paddingVertical: 4 },
  classBtn: {
    backgroundColor: "#1a1d2e",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#272b45",
  },
  classBtnActive: { backgroundColor: "#FFD700", borderColor: "#FFD700" },
  classBtnText: { color: "#fff", fontWeight: "600" },
  classBtnTextActive: { color: "#222" },
  colorGrid: { paddingTop: 8 },
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
