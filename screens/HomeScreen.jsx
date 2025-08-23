// src/screens/HomeScreen.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeScreen() {
  const navigation = useNavigation();

  // 🔹 Hier definierst du deine Buttons
  const buttons = [
    { id: "1", title: "Charakter Auswahl", screen: "CharacterSelectionScreen" },
    { id: "2", title: "Charakter erstellen", screen: "CreateCharacterScreen" },
    { id: "3", title: "Einstellungen", screen: "SettingsScreen" },
    { id: "4", title: "Kampf", screen: "BattleScreen" },
    // Weitere Buttons einfach hier hinzufügen...
    // { id: "4", title: "Game Start", screen: "GameScreen" },
  ];

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
  buttonContainer: {
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 5,
    borderColor: "#272b45",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
