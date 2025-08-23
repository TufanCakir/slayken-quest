// src/screens/BattleScreen.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Button,
} from "react-native";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import enemiesData from "../data/enemies.json";
import backgrounds from "../data/battleBackgrounds.json";
import HPBar from "../components/HPBar";
import XPBar from "../components/XPBar";
import Header from "../components/Header";
import { useCoins } from "../context/CoinsContext";
import { useCrystals } from "../context/CrystalsContext";
import BattleBackground from "../components/BattleBackground";
import StageProgress from "../components/StageProgress";
import AutoPlay from "../components/AutoPlay";
import { usePlayers } from "../context/PlayerContext";
import { useQuests } from "../context/QuestContext";

const { width, height } = Dimensions.get("window");
const CENTER_X = width / 2;
const ENEMY_Y = height * 0.45;
const PLAYER_Y = height - 120;

const DEFAULT_REWARDS = { gold: 5, crystals: 1, xp: 10 };
const TOTAL_STAGES = 10;

export default function BattleScreen() {
  const { selectedPlayer } = useSelectedPlayer();
  const { addCoins } = useCoins();
  const { addCrystals } = useCrystals();
  const { players, addXp, resetPlayer } = usePlayers();
  const { incrementKill, incrementWin, addCrystalsFromBattle } = useQuests();

  // 🎯 Aktueller Spieler
  const activePlayer = players.find((p) => p.id === selectedPlayer?.id);

  const MAX_PLAYER_HP = activePlayer?.hp?.max ?? 100;
  const PLAYER_DAMAGE = activePlayer?.damage ?? 5;

  const [stage, setStage] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [enemy, setEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [backgroundId, setBackgroundId] = useState(backgrounds[0].id);

  // 🔹 Gegner + Hintergrund wählen
  const spawnEnemy = useCallback(() => {
    if (!enemiesData.length) return;
    const newEnemy =
      enemiesData[Math.floor(Math.random() * enemiesData.length)];
    const nextBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    setEnemy(newEnemy);
    setEnemyHp(newEnemy.hp);
    setBackgroundId(nextBg.id);
  }, []);

  // 🔹 Wenn Gegner besiegt wird → alles zentral hier
  const onEnemyDefeated = useCallback(() => {
    if (!enemy || !activePlayer) return;

    // Rewards
    addCoins(enemy.goldReward ?? DEFAULT_REWARDS.gold);
    addCrystals(enemy.crystalReward ?? DEFAULT_REWARDS.crystals);
    addXp(activePlayer.id, enemy.xpReward ?? DEFAULT_REWARDS.xp);

    // Quests
    incrementKill(enemy.id);
    incrementWin();
    addCrystalsFromBattle(enemy.crystalReward ?? 0);

    // 🔹 Einheitliche Rewards berechnen
    const goldEarned = enemy.goldReward ?? DEFAULT_REWARDS.gold;
    const crystalsEarned = enemy.crystalReward ?? DEFAULT_REWARDS.crystals;
    const xpEarned = enemy.xpReward ?? DEFAULT_REWARDS.xp;

    // Rewards an Spieler
    addCoins(goldEarned);
    addCrystals(crystalsEarned);
    addXp(activePlayer.id, xpEarned);

    // Quests updaten
    incrementKill(enemy.id);
    incrementWin();
    if (crystalsEarned > 0) {
      addCrystalsFromBattle(crystalsEarned);
    }

    // Stage & Reset
    setPlayerHp(MAX_PLAYER_HP);
    setStage((prev) => (prev < TOTAL_STAGES ? prev + 1 : 1));
    spawnEnemy();
  }, [
    enemy,
    activePlayer,
    addCoins,
    addCrystals,
    addXp,
    incrementKill,
    incrementWin,
    addCrystalsFromBattle,
    MAX_PLAYER_HP,
    spawnEnemy,
  ]);

  // 🔹 Trigger, wenn Gegner HP = 0
  useEffect(() => {
    if (enemy && enemyHp <= 0) {
      onEnemyDefeated();
    }
  }, [enemyHp, enemy, onEnemyDefeated]);

  // 🔹 Spieler lädt → ersten Gegner spawnen
  useEffect(() => {
    if (selectedPlayer) spawnEnemy();
  }, [selectedPlayer, spawnEnemy]);

  // 🔹 Kampf-Logik
  const handleStageTap = useCallback(() => {
    if (!enemy || enemyHp <= 0 || playerHp <= 0) return;

    setEnemyHp((prevHp) => Math.max(prevHp - PLAYER_DAMAGE, 0));
    setPlayerHp((prev) => Math.max(prev - (enemy?.damage ?? 1), 0));
  }, [enemy, enemyHp, playerHp, PLAYER_DAMAGE]);

  // 🔹 Kein Spieler ausgewählt
  if (!selectedPlayer || !activePlayer) {
    return (
      <View style={styles.center}>
        <Text style={styles.noPlayer}>❌ Kein Spieler ausgewählt!</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleStageTap}
    >
      {/* HUD */}
      <Header />
      <StageProgress current={stage} total={TOTAL_STAGES} />

      {/* AutoPlay Button */}
      <TouchableOpacity
        style={[
          styles.autoPlayBtn,
          { backgroundColor: autoPlay ? "#2ecc71" : "#e74c3c" },
        ]}
        onPress={() => setAutoPlay((prev) => !prev)}
      >
        <Text style={styles.autoPlayText}>
          {autoPlay ? "Auto: ON" : "Auto: OFF"}
        </Text>
      </TouchableOpacity>

      {/* AutoPlay */}
      <AutoPlay
        enabled={autoPlay && enemyHp > 0}
        interval={800}
        onAttack={handleStageTap}
      />

      {/* Hintergrund */}
      <BattleBackground
        width={width}
        height={height}
        backgroundId={backgroundId}
      />

      {/* Gegner */}
      {enemy && (
        <View style={styles.enemyWrap}>
          <Enemy
            size={Math.min(260, Math.max(180, width * 0.6))}
            {...enemy.sprite}
          />
          <HPBar current={enemyHp} max={enemy.hp} width={200} height={20} />
        </View>
      )}

      {/* Boden */}
      <View style={styles.groundShadow} />
      <View style={styles.ground} />

      {/* Spieler */}
      <View style={styles.playerWrap}>
        <XPBar
          xp={activePlayer.xp}
          maxXp={activePlayer.xpToNextLevel}
          level={activePlayer.level}
          width={220}
          height={22}
        />
        <Player
          size={130}
          sprite={activePlayer.sprite}
          position={[CENTER_X, PLAYER_Y]}
        />
      </View>

      {/* DEBUG XP / Reset */}
      {__DEV__ && (
        <View style={styles.debugBox}>
          <Text style={styles.debugText}>
            {activePlayer.name} (Lvl {activePlayer.level}) — {activePlayer.xp}/
            {activePlayer.xpToNextLevel}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title="+50 XP" onPress={() => addXp(activePlayer.id, 50)} />
            <Button
              title="Reset"
              onPress={() => resetPlayer(activePlayer.id)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noPlayer: { color: "#fff", fontSize: 18, fontWeight: "600" },

  enemyWrap: {
    position: "absolute",
    top: ENEMY_Y - 180,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
    transform: [{ scale: 1.5 }],
  },

  playerWrap: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 4,
    transform: [{ scale: 0.9 }],
  },

  ground: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    backgroundColor: "#444",
    borderTopWidth: 3,
    borderTopColor: "#222",
  },
  groundShadow: {
    position: "absolute",
    bottom: 52,
    left: -40,
    right: -40,
    height: 14,
    backgroundColor: "#00000033",
    zIndex: 0,
  },

  autoPlayBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    zIndex: 99,
  },
  autoPlayText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  debugBox: {
    position: "absolute",
    top: 120,
    left: 10,
    right: 10,
    backgroundColor: "#00000077",
    padding: 10,
    borderRadius: 8,
    zIndex: 99,
  },
  debugText: { color: "#fff", fontSize: 12 },
});
