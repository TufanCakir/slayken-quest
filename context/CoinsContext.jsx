import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CoinsContext = createContext();

const STORAGE_KEY = "@player_coins";

export function CoinsProvider({ children }) {
  const [coins, setCoins] = useState(0);

  // Coins aus Storage laden
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setCoins(parseInt(saved, 10));
      } catch (err) {
        console.warn("Fehler beim Laden der Coins:", err);
      }
    })();
  }, []);

  // Coins speichern, wenn sich Wert ändert
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, coins.toString()).catch((err) =>
      console.warn("Fehler beim Speichern der Coins:", err)
    );
  }, [coins]);

  // Coin-Funktionen
  const addCoins = useCallback((amount) => {
    setCoins((prev) => Math.max(prev + amount, 0));
  }, []);

  const removeCoins = useCallback((amount) => {
    setCoins((prev) => Math.max(prev - amount, 0));
  }, []);

  const resetCoins = useCallback(() => {
    setCoins(0);
  }, []);

  return (
    <CoinsContext.Provider value={{ coins, addCoins, removeCoins, resetCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error(
      "useCoins muss innerhalb von CoinsProvider verwendet werden"
    );
  }
  return context;
}
