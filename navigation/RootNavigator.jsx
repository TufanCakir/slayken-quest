import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
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
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animationEnabled: true, // sanftere Navigation
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
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
