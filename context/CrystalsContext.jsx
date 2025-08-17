import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CrystalsContext = createContext();

const STORAGE_KEY = "@player_crystals";

export function CrystalsProvider({ children }) {
  const [crystals, setCrystals] = useState(0);

  // Kristalle aus Storage laden
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setCrystals(parseInt(saved, 10));
      } catch (err) {
        console.warn("Fehler beim Laden der Crystals:", err);
      }
    })();
  }, []);

  // Kristalle speichern, wenn sich Wert ändert
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, crystals.toString()).catch((err) =>
      console.warn("Fehler beim Speichern der Crystals:", err)
    );
  }, [crystals]);

  // Crystal-Funktionen
  const addCrystals = useCallback((amount) => {
    setCrystals((prev) => Math.max(prev + amount, 0));
  }, []);

  const removeCrystals = useCallback((amount) => {
    setCrystals((prev) => Math.max(prev - amount, 0));
  }, []);

  const resetCrystals = useCallback(() => {
    setCrystals(0);
  }, []);

  return (
    <CrystalsContext.Provider
      value={{ crystals, addCrystals, removeCrystals, resetCrystals }}
    >
      {children}
    </CrystalsContext.Provider>
  );
}

export function useCrystals() {
  const context = useContext(CrystalsContext);
  if (!context) {
    throw new Error(
      "useCrystals muss innerhalb von CrystalsProvider verwendet werden"
    );
  }
  return context;
}
