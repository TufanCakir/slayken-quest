// src/context/SelectedPlayerContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@selected_player";
const SelectedPlayerContext = createContext(null);

export const SelectedPlayerProvider = ({ children }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Laden beim App-Start
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSelectedPlayer(JSON.parse(stored));
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden des ausgewählten Charakters:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Nur im State setzen (ohne AsyncStorage)
  const setSelectedOnly = useCallback((player) => {
    setSelectedPlayer(player);
  }, []);

  // 🔹 Player setzen + speichern
  const updateSelectedPlayer = useCallback(async (player) => {
    try {
      setSelectedPlayer(player);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch (err) {
      console.error(
        "❌ Fehler beim Speichern des ausgewählten Charakters:",
        err
      );
    }
  }, []);

  // 🔹 Reset
  const resetSelectedPlayer = useCallback(async () => {
    try {
      setSelectedPlayer(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(
        "❌ Fehler beim Zurücksetzen des ausgewählten Charakters:",
        err
      );
    }
  }, []);

  return (
    <SelectedPlayerContext.Provider
      value={{
        selectedPlayer,
        setSelectedPlayer: updateSelectedPlayer, // speichert + setzt
        setSelectedOnly, // nur im RAM setzen
        resetSelectedPlayer,
        loading,
      }}
    >
      {children}
    </SelectedPlayerContext.Provider>
  );
};

// 🔹 Custom Hook
export const useSelectedPlayer = () => {
  const ctx = useContext(SelectedPlayerContext);
  if (!ctx) {
    throw new Error(
      "useSelectedPlayer muss innerhalb von SelectedPlayerProvider verwendet werden."
    );
  }
  return ctx;
};
