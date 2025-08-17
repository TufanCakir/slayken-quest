import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import questsData from "../data/quests.json";

const QuestContext = createContext();

export function QuestProvider({ children }) {
  const [quests, setQuests] = useState([]);

  // Storage Key
  const STORAGE_KEY = "quests";

  // Laden aus Storage oder Default
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setQuests(JSON.parse(saved));
        } else {
          setQuests(questsData);
        }
      } catch (err) {
        console.log("❌ Fehler beim Laden der Quests:", err);
        setQuests(questsData);
      }
    })();
  }, []);

  // Speichern
  const saveQuests = async (newQuests) => {
    setQuests(newQuests);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newQuests));
  };

  // Fortschritt erhöhen
  const updateProgress = (questId, amount = 1) => {
    const updated = quests.map((q) => {
      if (q.id === questId && !q.completed) {
        const newProgress = Math.min(q.progress + amount, q.goal);
        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.goal,
        };
      }
      return q;
    });
    saveQuests(updated);
  };

  // Belohnung abholen
  const claimReward = (questId) => {
    const updated = quests.map((q) =>
      q.id === questId && q.completed && !q.claimed
        ? { ...q, claimed: true }
        : q
    );
    saveQuests(updated);
  };

  // Reset (z.B. für Debugging oder Daily Quests)
  const resetQuests = () => {
    saveQuests(questsData);
  };

  return (
    <QuestContext.Provider
      value={{ quests, updateProgress, claimReward, resetQuests }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export const useQuests = () => useContext(QuestContext);
