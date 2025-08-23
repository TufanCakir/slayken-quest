import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TutorialScreen() {
  const navigation = useNavigation();

  const steps = [
    {
      id: "1",
      title: "Charakter erstellen",
      text: "Gehe zu 'Charakter erstellen', wähle eine Klasse, passe Farben an und gib deinem Helden einen Namen.",
    },
    {
      id: "2",
      title: "Charakter auswählen",
      text: "Öffne die 'Charakter Auswahl', um deinen Helden als aktiven Spieler festzulegen.",
    },
    {
      id: "3",
      title: "Kampf starten",
      text: "Wähle im Menü 'Kampf', um mit deinem Helden gegen Gegner anzutreten und Erfahrung, Gold und Kristalle zu sammeln.",
    },
    {
      id: "4",
      title: "Quests & Fortschritt",
      text: "Erfülle Quests wie 'Besiege 10 Gegner' oder 'Sammle 20 Kristalle', um zusätzliche Belohnungen zu erhalten.",
    },
    {
      id: "5",
      title: "Einstellungen",
      text: "Falls du neu anfangen willst, kannst du im Menü 'Einstellungen' alle Daten zurücksetzen.",
    },
  ];

  // ✅ Tutorial abschließen
  const handleFinishTutorial = async () => {
    await AsyncStorage.setItem("tutorialDone", "true");
    navigation.replace("HomeScreen"); // ersetzt Stack, kein zurück mehr
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📖 Tutorial</Text>
        <Text style={styles.subtitle}>So funktioniert dein Abenteuer:</Text>

        {steps.map((step) => (
          <View key={step.id} style={styles.step}>
            <Text style={styles.stepTitle}>
              {step.id}. {step.title}
            </Text>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}

        {/* Abbrechen-Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>⬅️ Zurück zum Hauptmenü</Text>
        </TouchableOpacity>

        {/* ✅ Abenteuer starten-Button */}
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={handleFinishTutorial}
        >
          <Text style={styles.finishBtnText}>✅ Abenteuer starten</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1220" },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  step: {
    marginBottom: 18,
    backgroundColor: "#1a1d2e",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#272b45",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 20,
  },
  backBtn: {
    backgroundColor: "#444",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  backBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  finishBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  finishBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
  },
});
