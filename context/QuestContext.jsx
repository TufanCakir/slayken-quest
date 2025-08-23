import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import questsData from "../data/quests.json";
import { usePlayers } from "./PlayerContext";
import { useCoins } from "./CoinsContext";
import { useCrystals } from "./CrystalsContext";

/**
 * Quest Status:
 * - "available": erfüllbar, aber noch nicht angenommen
 * - "active": angenommen, Fortschritt wird getrackt
 * - "completed": Ziel erreicht, Belohnung noch nicht abgeholt
 * - "claimed": abgeschlossen + Belohnung eingesammelt
 *
 * Progress-Schema pro Quest (abhängig vom Typ):
 * - kills: { countByEnemy: { [enemyId]: number }, total: number }
 * - wins: { total: number }
 * - reach_level: { level: number }
 * - collect_crystals: { total: number }
 */

const STORAGE_KEY = "quests_v1";

const QuestContext = createContext(null);
export const useQuests = () => useContext(QuestContext);

// ---------- Utils
const byId = (list) =>
  list.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {});

function initialProgressFor(q) {
  switch (q.type) {
    case "kills":
      return { total: 0, countByEnemy: {} };
    case "wins":
      return { total: 0 };
    case "reach_level":
      return { level: 1 };
    case "collect_crystals":
      return { total: 0 };
    default:
      return {};
  }
}

function isQuestCompletable(q, progress, playerLevel) {
  switch (q.type) {
    case "kills": {
      const need = q.target?.count ?? 0;
      const onlyId = q.target?.enemyId;
      if (onlyId) {
        const have = progress?.countByEnemy?.[onlyId] ?? 0;
        return have >= need;
      }
      return (progress?.total ?? 0) >= need;
    }
    case "wins": {
      const need = q.target?.count ?? 0;
      return (progress?.total ?? 0) >= need;
    }
    case "reach_level": {
      const need = q.target?.level ?? 1;
      return (progress?.level ?? playerLevel) >= need;
    }
    case "collect_crystals": {
      const need = q.target?.count ?? 0;
      return (progress?.total ?? 0) >= need;
    }
    default:
      return false;
  }
}

// ---------- Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload;

    case "ACCEPT_QUEST": {
      const { questId } = action;
      const qState = state.questState[questId] ?? {
        status: "active",
        progress: initialProgressFor(state.catalog[questId]),
        claimedAt: null,
      };
      return {
        ...state,
        questState: {
          ...state.questState,
          [questId]: { ...qState, status: "active" },
        },
      };
    }

    case "ABANDON_QUEST": {
      const { questId } = action;
      const current = state.questState[questId];
      if (!current) return state;
      // zurück zu available mit Progress-Reset
      const newState = { ...state.questState };
      newState[questId] = {
        status: "available",
        progress: initialProgressFor(state.catalog[questId]),
        claimedAt: null,
      };
      return { ...state, questState: newState };
    }

    case "UPDATE_PROGRESS": {
      const { questId, updater } = action;
      const current = state.questState[questId];
      if (!current) return state;
      const updated = updater(current);
      return {
        ...state,
        questState: { ...state.questState, [questId]: updated },
      };
    }

    case "MARK_COMPLETED": {
      const { questId } = action;
      const current = state.questState[questId];
      if (!current) return state;
      return {
        ...state,
        questState: {
          ...state.questState,
          [questId]: { ...current, status: "completed" },
        },
      };
    }

    case "CLAIM_REWARDS": {
      const { questId } = action;
      const current = state.questState[questId];
      if (!current) return state;
      return {
        ...state,
        questState: {
          ...state.questState,
          [questId]: { ...current, status: "claimed", claimedAt: Date.now() },
        },
      };
    }

    default:
      return state;
  }
};

// ---------- Provider
export function QuestProvider({ children }) {
  const { players, addXp } = usePlayers();
  const { addCoins } = useCoins();
  const { addCrystals } = useCrystals();

  const catalog = useMemo(() => byId(questsData), []);

  const [state, dispatch] = useReducer(reducer, {
    catalog, // { [id]: questDef }
    questState: {}, // { [id]: { status, progress, claimedAt } }
  });

  // Beim ersten Start alle Quests auf "available" setzen
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Falls neue Quests hinzugekommen sind
          const mergedQuestState = { ...parsed.questState };
          Object.keys(catalog).forEach((id) => {
            if (!mergedQuestState[id]) {
              mergedQuestState[id] = {
                status: "available",
                progress: initialProgressFor(catalog[id]),
                claimedAt: null,
              };
            }
          });
          dispatch({
            type: "LOAD_STATE",
            payload: { catalog, questState: mergedQuestState },
          });
        } else {
          const init = {};
          Object.keys(catalog).forEach((id) => {
            init[id] = {
              status: "available",
              progress: initialProgressFor(catalog[id]),
              claimedAt: null,
            };
          });
          dispatch({
            type: "LOAD_STATE",
            payload: { catalog, questState: init },
          });
        }
      } catch (e) {
        console.warn("Quest load failed", e);
      }
    })();
  }, [catalog]);

  // Persist
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  // Aktiver Spieler (für Level-Quests)
  const activePlayer = players?.[0]; // oder aus SelectedPlayerContext lesen, wenn dort zentral
  const activeLevel = activePlayer?.level ?? 1;

  // ---------- API
  const acceptQuest = useCallback((questId) => {
    dispatch({ type: "ACCEPT_QUEST", questId });
  }, []);

  const abandonQuest = useCallback((questId) => {
    dispatch({ type: "ABANDON_QUEST", questId });
  }, []);

  const claimRewards = useCallback(
    (questId) => {
      const qDef = state.catalog[questId];
      const qEntry = state.questState[questId];
      if (!qDef || !qEntry || qEntry.status !== "completed") return;

      const { xp = 0, gold = 0, crystals = 0 } = qDef.rewards || {};
      if (activePlayer?.id && xp > 0) addXp(activePlayer.id, xp);
      if (gold > 0) addCoins(gold);
      if (crystals > 0) addCrystals(crystals);

      dispatch({ type: "CLAIM_REWARDS", questId });
    },
    [state, addCoins, addCrystals, addXp, activePlayer?.id]
  );

  /**
   * Hook/Call aus dem Spiel:
   * - incrementKill(enemyId)
   * - incrementWin()
   * - addCrystalsFromBattle(amount)
   * - syncLevel(level)  (oder automatisch durch useEffect)
   *
   * Diese Funktionen aktualisieren alle aktiven Quests
   * und markieren sie bei Erreichen als "completed".
   */

  const checkAndMaybeComplete = useCallback(
    (questId, nextProgress) => {
      const qDef = state.catalog[questId];
      const done = isQuestCompletable(qDef, nextProgress, activeLevel);
      if (done) dispatch({ type: "MARK_COMPLETED", questId });
    },
    [state.catalog, activeLevel]
  );

  const incrementKill = useCallback(
    (enemyId) => {
      Object.values(state.catalog).forEach((q) => {
        if (q.type !== "kills") return;
        const entry = state.questState[q.id];
        if (!entry || entry.status !== "active") return;

        dispatch({
          type: "UPDATE_PROGRESS",
          questId: q.id,
          updater: (cur) => {
            const next = { ...cur };
            const p = { ...(next.progress || { total: 0, countByEnemy: {} }) };
            p.total = (p.total || 0) + 1;
            if (enemyId) {
              p.countByEnemy = { ...(p.countByEnemy || {}) };
              p.countByEnemy[enemyId] = (p.countByEnemy[enemyId] || 0) + 1;
            }
            next.progress = p;
            // nach Update prüfen
            checkAndMaybeComplete(q.id, p);
            return next;
          },
        });
      });
    },
    [state.catalog, state.questState, checkAndMaybeComplete]
  );

  const incrementWin = useCallback(() => {
    Object.values(state.catalog).forEach((q) => {
      if (q.type !== "wins") return;
      const entry = state.questState[q.id];
      if (!entry || entry.status !== "active") return;

      dispatch({
        type: "UPDATE_PROGRESS",
        questId: q.id,
        updater: (cur) => {
          const next = { ...cur };
          const p = { ...(next.progress || { total: 0 }) };
          p.total = (p.total || 0) + 1;
          next.progress = p;
          checkAndMaybeComplete(q.id, p);
          return next;
        },
      });
    });
  }, [state.catalog, state.questState, checkAndMaybeComplete]);

  const addCrystalsFromBattle = useCallback(
    (amount) => {
      if (!amount) return;
      Object.values(state.catalog).forEach((q) => {
        if (q.type !== "collect_crystals") return;
        const entry = state.questState[q.id];
        if (!entry || entry.status !== "active") return;
        dispatch({
          type: "UPDATE_PROGRESS",
          questId: q.id,
          updater: (cur) => {
            const next = { ...cur };
            const p = { ...(next.progress || { total: 0 }) };
            p.total = (p.total || 0) + amount;
            next.progress = p;
            checkAndMaybeComplete(q.id, p);
            return next;
          },
        });
      });
    },
    [state.catalog, state.questState, checkAndMaybeComplete]
  );

  // Level-Sync (falls Level steigt)
  useEffect(() => {
    Object.values(state.catalog).forEach((q) => {
      if (q.type !== "reach_level") return;
      const entry = state.questState[q.id];
      if (!entry || entry.status !== "active") return;

      const p = { ...(entry.progress || { level: 1 }), level: activeLevel };
      if (isQuestCompletable(q, p, activeLevel)) {
        dispatch({ type: "MARK_COMPLETED", questId: q.id });
        dispatch({
          type: "UPDATE_PROGRESS",
          questId: q.id,
          updater: (cur) => ({ ...cur, progress: p }),
        });
      } else {
        // nur Fortschritt mitschreiben
        dispatch({
          type: "UPDATE_PROGRESS",
          questId: q.id,
          updater: (cur) => ({ ...cur, progress: p }),
        });
      }
    });
  }, [activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => {
    const list = Object.keys(state.catalog).map((id) => {
      const def = state.catalog[id];
      const st = state.questState[id];
      return { ...def, state: st };
    });

    return {
      quests: list,
      acceptQuest,
      abandonQuest,
      claimRewards,
      // Progress Triggers (aus Kampf etc.)
      incrementKill,
      incrementWin,
      addCrystalsFromBattle,
    };
  }, [
    state,
    acceptQuest,
    abandonQuest,
    claimRewards,
    incrementKill,
    incrementWin,
    addCrystalsFromBattle,
  ]);

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
}
