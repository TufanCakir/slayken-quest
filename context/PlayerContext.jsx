// src/context/PlayerContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gainXp } from "../utils/levelSystem";
import initialPlayers from "../data/players.json";

const STORAGE_KEY = "@players"; // 🔑 Einheitlicher Key
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState(initialPlayers);

  // === Laden beim Start ===
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPlayers(JSON.parse(saved));
        } else {
          setPlayers(initialPlayers);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der Spieler:", err);
      }
    })();
  }, []);

  // === Speichern bei Änderung ===
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      } catch (err) {
        console.error("❌ Fehler beim Speichern der Spieler:", err);
      }
    })();
  }, [players]);

  // === Spieler hinzufügen ===
  const addPlayer = useCallback(
    (player) => {
      setPlayers((prev) => [...prev, player]);
    },
    [setPlayers]
  );

  // === XP hinzufügen ===
  const addXp = useCallback(
    (id, amount) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? gainXp(p, amount) : p))
      );
    },
    [setPlayers]
  );

  // === Spieler zurücksetzen ===
  const resetPlayer = useCallback(
    (id) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                gold: 0,
                hp: { current: 100, max: 100 },
              }
            : p
        )
      );
    },
    [setPlayers]
  );

  return (
    <PlayerContext.Provider
      value={{ players, setPlayers, addPlayer, addXp, resetPlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// 🔧 Custom Hook
export function usePlayers() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error(
      "usePlayers muss innerhalb von PlayerProvider verwendet werden."
    );
  }
  return ctx;
}
