import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SelectedPlayerProvider } from "./context/SelectedPlayerContext";
import SettingsScreen from "./screens/SettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import { AccountLevelProvider } from "./context/AccountLevelContext";
import { CoinsProvider } from "./context/CoinsContext";
import { CrystalsProvider } from "./context/CrystalsContext";
import { PlayerProvider } from "./context/PlayerContext";
import { QuestProvider } from "./context/QuestContext";

// Screens
import CharacterSelectionScreen from "./screens/CharacterSelectionScreen";
import BattleScreen from "./screens/BattleScreen";
import CreateCharacterScreen from "./screens/CreateCharacterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <QuestProvider>
          <AccountLevelProvider>
            <CoinsProvider>
              <CrystalsProvider>
                <SelectedPlayerProvider>
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: "#0f1220" }} // Hintergrund wie im Game
                    edges={["top", "bottom"]}
                  >
                    <NavigationContainer>
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
                        <Stack.Screen
                          name="BattleScreen"
                          component={BattleScreen}
                        />
                        <Stack.Screen
                          name="CreateCharacterScreen"
                          component={CreateCharacterScreen}
                        />
                        <Stack.Screen
                          name="SettingsScreen"
                          component={SettingsScreen}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </SafeAreaView>
                </SelectedPlayerProvider>
              </CrystalsProvider>
            </CoinsProvider>
          </AccountLevelProvider>
        </QuestProvider>
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
