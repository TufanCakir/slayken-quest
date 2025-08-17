import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "players";

// Context erzeugen
const PlayersContext = createContext();

// Provider
export function PlayersProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Laden beim Start
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setPlayers(stored ? JSON.parse(stored) : []);
      } catch (err) {
        console.warn("Fehler beim Laden:", err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Save Helper
  const savePlayers = async (list) => {
    try {
      setPlayers(list);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn("Fehler beim Speichern:", err);
    }
  };

  // 🔹 API Methoden
  const addPlayer = async (player) => {
    await savePlayers([...players, player]);
  };

  const removePlayer = async (id) => {
    await savePlayers(players.filter((p) => p.id !== id));
  };

  const clearPlayers = async () => {
    await savePlayers([]);
  };

  return (
    <PlayersContext.Provider
      value={{
        players,
        loading,
        addPlayer,
        removePlayer,
        clearPlayers,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}

// Custom Hook
export const usePlayers = () => useContext(PlayersContext);
