// src/navigation/RootNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import MainScreenWrapper from "../screens/MainScreenWrapper"; // ✅ Wichtig: importiert
import HomeScreen from "../screens/HomeScreen";
import CharacterSelectionScreen from "../screens/CharacterSelectionScreen";
import BattleScreen from "../screens/BattleScreen";
import CreateCharacterScreen from "../screens/CreateCharacterScreen";
import SettingsScreen from "../screens/SettingsScreen";
import QuestScreen from "../screens/QuestScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade", // sanftere Navigation (statt deprecated animationEnabled)
      }}
    >
      {/* Wrapper entscheidet ob Tutorial oder Home zuerst */}
      <Stack.Screen name="MainScreenWrapper" component={MainScreenWrapper} />

      {/* Standard Screens */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="CharacterSelectionScreen"
        component={CharacterSelectionScreen}
      />
      <Stack.Screen name="BattleScreen" component={BattleScreen} />
      <Stack.Screen
        name="CreateCharacterScreen"
        component={CreateCharacterScreen}
      />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="QuestScreen" component={QuestScreen} />
    </Stack.Navigator>
  );
}
