// src/screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePlayers } from "../context/PlayerContext";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { players } = usePlayers();
  const { selectedPlayer } = useSelectedPlayer();

  const [tutorialStep, setTutorialStep] = useState(1);

  // 🔹 Tutorial-State laden
  useEffect(() => {
    (async () => {
      const savedStep = await AsyncStorage.getItem("tutorialStep");
      if (savedStep) {
        setTutorialStep(parseInt(savedStep, 10));
      }
    })();
  }, []);

  // 🔹 Fortschritt prüfen und Step updaten
  useEffect(() => {
    if (tutorialStep === 1 && players.length > 0) {
      setTutorialStep(2);
      AsyncStorage.setItem("tutorialStep", "2");
    }
    if (tutorialStep === 2 && selectedPlayer) {
      setTutorialStep(3);
      AsyncStorage.setItem("tutorialStep", "3");
    }
  }, [players, selectedPlayer, tutorialStep]);

  // 🔹 Buttons je nach Fortschritt
  let buttons = [];
  if (tutorialStep === 1) {
    buttons = [
      {
        id: "create",
        title: "Charakter erstellen",
        screen: "CreateCharacterScreen",
      },
    ];
  } else if (tutorialStep === 2) {
    buttons = [
      {
        id: "select",
        title: "Charakter Auswahl",
        screen: "CharacterSelectionScreen",
      },
    ];
  } else {
    buttons = [
      {
        id: "1",
        title: "Charakter Auswahl",
        screen: "CharacterSelectionScreen",
      },
      {
        id: "2",
        title: "Charakter erstellen",
        screen: "CreateCharacterScreen",
      },
      { id: "3", title: "Einstellungen", screen: "SettingsScreen" },
      { id: "4", title: "Kampf", screen: "BattleScreen" },
    ];
  }

  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.tutorialHint}>
        {tutorialStep === 1 && "👉 Erstelle zuerst deinen Charakter!"}
        {tutorialStep === 2 && "👉 Wähle deinen Charakter aus!"}
        {tutorialStep === 3 && "✅ Tutorial abgeschlossen! Viel Spaß 🎉"}
      </Text>

      <FlatList
        data={buttons}
        keyExtractor={(item) => item.id}
        renderItem={renderButton}
        contentContainerStyle={styles.buttonContainer}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220" },
  buttonContainer: { paddingVertical: 10 },
  button: {
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#272b45",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  tutorialHint: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
});
