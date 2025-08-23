// src/context/BattleContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import enemiesData from "../data/enemies.json";
import backgrounds from "../data/battleBackgrounds.json";

const BattleContext = createContext(null);

const DEFAULT_REWARDS = { gold: 5, crystals: 1, xp: 10 };
const TOTAL_STAGES = 10;
const RESPAWN_DELAY = 600; // ms

export function BattleProvider({ children }) {
  const [stage, setStage] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [enemy, setEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [backgroundId, setBackgroundId] = useState("default");
  const [respawning, setRespawning] = useState(false);

  const defeatedRef = useRef(false);
  const pendingRewardRef = useRef(null);
  const [rewardTrigger, setRewardTrigger] = useState(0);

  const spawnLockRef = useRef(false);
  const respawnTimerRef = useRef(null);

  const flatEnemies = useMemo(
    () => enemiesData.flat?.(Infinity).filter(Boolean) ?? [],
    []
  );

  // 🎲 Neuen Gegner auswählen
  const spawnEnemy = useCallback(() => {
    if (spawnLockRef.current) return;
    spawnLockRef.current = true;

    if (!flatEnemies.length) {
      console.warn("⚠️ Keine Gegner gefunden!");
      spawnLockRef.current = false;
      return;
    }

    const newEnemy =
      flatEnemies[Math.floor(Math.random() * flatEnemies.length)];
    if (!newEnemy?.hp) {
      console.warn("⚠️ Ungültiger Gegner:", newEnemy);
      spawnLockRef.current = false;
      return;
    }

    const nextBg = backgrounds[
      Math.floor(Math.random() * backgrounds.length)
    ] ?? {
      id: "default",
    };

    setEnemy(newEnemy);
    setEnemyHp(newEnemy.hp);
    setBackgroundId(nextBg.id);
    setRespawning(false);

    defeatedRef.current = false;

    if (__DEV__) {
      console.log(
        `👾 Neuer Gegner: ${newEnemy.name} (${newEnemy.hp} HP) | BG: ${nextBg.id}`
      );
    }

    // ✅ Lock nach kleinem Delay freigeben
    setTimeout(() => {
      spawnLockRef.current = false;
    }, 50);
  }, [flatEnemies]);

  // 🏆 Rewards vormerken
  const rewardEnemyDefeat = useCallback(
    (defeatedEnemy, activePlayer, rewards = {}) => {
      if (!defeatedEnemy || !activePlayer) return;
      if (defeatedRef.current) return;

      defeatedRef.current = true;
      pendingRewardRef.current = { defeatedEnemy, activePlayer, rewards };
      setRewardTrigger((c) => c + 1);
    },
    []
  );

  // 🚀 Rewards anwenden + Respawn starten
  useEffect(() => {
    if (!pendingRewardRef.current) return;

    const { defeatedEnemy, activePlayer, rewards } = pendingRewardRef.current;
    const {
      addCoins,
      addCrystals,
      addXp,
      incrementKill,
      incrementWin,
      addCrystalsFromBattle,
    } = rewards;

    const gold = defeatedEnemy.goldReward ?? DEFAULT_REWARDS.gold;
    const crystals = defeatedEnemy.crystalReward ?? DEFAULT_REWARDS.crystals;
    const xp = defeatedEnemy.xpReward ?? DEFAULT_REWARDS.xp;

    addCoins?.(gold);
    addCrystals?.(crystals);
    addXp?.(activePlayer.id, xp);
    incrementKill?.(defeatedEnemy.id);
    incrementWin?.();
    if (crystals > 0) addCrystalsFromBattle?.(crystals);

    setStage((prev) => {
      const next = prev < TOTAL_STAGES ? prev + 1 : 1;
      if (__DEV__)
        console.log(`🏆 ${defeatedEnemy.name} besiegt → Stage ${next}`);
      return next;
    });

    // Respawn
    setRespawning(true);
    respawnTimerRef.current = setTimeout(spawnEnemy, RESPAWN_DELAY);

    pendingRewardRef.current = null;
  }, [rewardTrigger, spawnEnemy]);

  const handleAttack = useCallback(
    (damage, activePlayer, rewards) => {
      if (!enemy || respawning) return;

      setEnemyHp((prevHp) => {
        const newHp = Math.max(prevHp - damage, 0);

        if (__DEV__)
          console.log(`⚔️ Hit: ${enemy.name} -${damage} (HP: ${newHp})`);

        if (newHp === 0) {
          rewardEnemyDefeat(enemy, activePlayer, rewards);
        }
        return newHp;
      });
    },
    [enemy, respawning, rewardEnemyDefeat]
  );

  useEffect(() => {
    return () => {
      if (respawnTimerRef.current) clearTimeout(respawnTimerRef.current);
    };
  }, []);

  return (
    <BattleContext.Provider
      value={{
        stage,
        autoPlay,
        setAutoPlay,
        enemy,
        enemyHp,
        backgroundId,
        respawning,
        spawnEnemy,
        handleAttack,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const ctx = useContext(BattleContext);
  if (!ctx) {
    throw new Error(
      "useBattle muss innerhalb von BattleProvider verwendet werden."
    );
  }
  return ctx;
}
