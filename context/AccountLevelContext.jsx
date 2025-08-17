import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@account_level_data";

const AccountLevelContext = createContext();

export const AccountLevelProvider = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  // Accountdaten laden
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setLevel(data.level || 1);
          setXp(data.xp || 0);
        }
      } catch (err) {
        console.warn("AccountLevelContext: Laden fehlgeschlagen", err);
      }
    })();
  }, []);

  // Speichern
  const saveData = async (newLevel, newXp) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ level: newLevel, xp: newXp })
      );
    } catch (err) {
      console.warn("AccountLevelContext: Speichern fehlgeschlagen", err);
    }
  };

  // XP hinzufügen
  const gainXp = useCallback(
    (amount) => {
      setXp((currentXp) => {
        let totalXp = currentXp + amount;
        let currentLevel = level;
        let maxXp = currentLevel * 100; // XP pro Level

        // Level-Up Schleife
        while (totalXp >= maxXp) {
          totalXp -= maxXp;
          currentLevel += 1;
          maxXp = currentLevel * 100;
        }

        setLevel(currentLevel);
        saveData(currentLevel, totalXp);
        return totalXp;
      });
    },
    [level]
  );

  // XP zurücksetzen (optional)
  const resetAccount = useCallback(() => {
    setLevel(1);
    setXp(0);
    saveData(1, 0);
  }, []);

  return (
    <AccountLevelContext.Provider
      value={{
        level,
        xp,
        gainXp,
        resetAccount,
      }}
    >
      {children}
    </AccountLevelContext.Provider>
  );
};

// Hook für einfachen Zugriff
export const useAccountLevel = () => useContext(AccountLevelContext);
