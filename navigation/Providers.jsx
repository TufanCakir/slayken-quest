import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// 👉 Context-Provider
import { CoinsProvider } from "../context/CoinsContext";
import { CrystalsProvider } from "../context/CrystalsContext";
import { PlayerProvider } from "../context/PlayerContext";
import { SelectedPlayerProvider } from "../context/SelectedPlayerContext";
import { AccountLevelProvider } from "../context/AccountLevelContext";
import { QuestProvider } from "../context/QuestContext";

// 👉 Dein Navigator
import RootNavigator from "./RootNavigator";

export default function Providers() {
  return (
    <SafeAreaProvider>
      <CoinsProvider>
        <CrystalsProvider>
          <PlayerProvider>
            <SelectedPlayerProvider>
              <AccountLevelProvider>
                <QuestProvider>
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: "#0f1220" }}
                    edges={["top", "bottom"]}
                  >
                    <NavigationContainer>
                      <RootNavigator />
                    </NavigationContainer>
                  </SafeAreaView>
                </QuestProvider>
              </AccountLevelProvider>
            </SelectedPlayerProvider>
          </PlayerProvider>
        </CrystalsProvider>
      </CoinsProvider>
    </SafeAreaProvider>
  );
}
