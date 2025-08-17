import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectedPlayerContext = createContext();
const STORAGE_KEY = "@selected_player";

export const SelectedPlayerProvider = ({ children }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 🔹 Beim App-Start gespeicherten Player laden
  useEffect(() => {
    (async () => {
      try {
        const storedPlayer = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedPlayer) {
          setSelectedPlayer(JSON.parse(storedPlayer));
        }
      } catch (err) {
        console.warn("Fehler beim Laden des ausgewählten Charakters:", err);
      }
    })();
  }, []);

  // 🔹 Player setzen + speichern
  const updateSelectedPlayer = async (player) => {
    try {
      setSelectedPlayer(player);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch (err) {
      console.warn("Fehler beim Speichern des ausgewählten Charakters:", err);
    }
  };

  return (
    <SelectedPlayerContext.Provider
      value={{ selectedPlayer, setSelectedPlayer: updateSelectedPlayer }}
    >
      {children}
    </SelectedPlayerContext.Provider>
  );
};

export const useSelectedPlayer = () => useContext(SelectedPlayerContext);
