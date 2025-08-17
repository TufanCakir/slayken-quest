import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gainXp } from "../utils/levelSystem";
import initialPlayers from "../data/players.json";

// 🔥 Context erstellen
const PlayerContext = createContext();

// 🧩 Provider
export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState(initialPlayers);

  // === Laden beim Start ===
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("players");
        if (saved) setPlayers(JSON.parse(saved));
      } catch (err) {
        console.error("❌ Fehler beim Laden der Spieler:", err);
      }
    })();
  }, []);

  // === Speichern bei Änderung ===
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("players", JSON.stringify(players));
      } catch (err) {
        console.error("❌ Fehler beim Speichern der Spieler:", err);
      }
    })();
  }, [players]);

  // === Character XP geben ===
  const addXp = (id, amount) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? gainXp(p, amount) : p))
    );
  };

  // === Character zurücksetzen ===
  const resetPlayer = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, level: 1, xp: 0, xpToNextLevel: 100 } : p
      )
    );
  };

  return (
    <PlayerContext.Provider value={{ players, setPlayers, addXp, resetPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

// 🔧 Custom Hook
export function usePlayers() {
  return useContext(PlayerContext);
}
