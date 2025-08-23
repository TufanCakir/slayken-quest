// src/screens/MainScreenWrapper.jsx
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import HomeScreen from "./HomeScreen";
import TutorialScreen from "./TutorialScreen";

export default function MainScreenWrapper({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [tutorialDone, setTutorialDone] = useState(false);

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem("tutorialDone");
      setTutorialDone(done === "true");
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f1220",
        }}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return tutorialDone ? (
    <HomeScreen navigation={navigation} />
  ) : (
    <TutorialScreen navigation={navigation} />
  );
}
