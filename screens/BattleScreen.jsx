// src/screens/BattleScreen.jsx
import React, { useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Button,
  Animated,
} from "react-native";

import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import { useBattle } from "../context/BattleContext";
import { useCoins } from "../context/CoinsContext";
import { useCrystals } from "../context/CrystalsContext";
import { usePlayers } from "../context/PlayerContext";
import { useQuests } from "../context/QuestContext";

// Komponenten
import Player from "../components/Player";
import HPBar from "../components/HPBar";
import XPBar from "../components/XPBar";
import Header from "../components/Header";
import BattleBackground from "../components/BattleBackground";
import StageProgress from "../components/StageProgress";
import AutoPlay from "../components/AutoPlay";
import EnemyFactory from "../enemies/EnemyFactory";

const { width, height } = Dimensions.get("window");
const CENTER_X = width / 2;
const ENEMY_Y = height * 0.45;
const PLAYER_Y = height - 120;

const TOTAL_STAGES = 10;
const AUTO_PLAY_INTERVAL = 800;

export default function BattleScreen() {
  const { selectedPlayer } = useSelectedPlayer();
  const { players, addXp, resetPlayer } = usePlayers();

  // ✅ Hooks hier oben
  const { addCoins } = useCoins();
  const { addCrystals } = useCrystals();
  const { incrementKill, incrementWin, addCrystalsFromBattle } = useQuests();

  // 🎯 BattleContext
  const {
    stage,
    autoPlay,
    setAutoPlay,
    enemy,
    enemyHp,
    backgroundId,
    respawning,
    spawnEnemy,
    handleAttack,
  } = useBattle();

  // 🎯 Aktiver Spieler
  const activePlayer = useMemo(
    () => players.find((p) => p.id === selectedPlayer?.id),
    [players, selectedPlayer]
  );

  const PLAYER_DAMAGE = activePlayer?.damage ?? 5;

  // ⚡ Rewards bündeln
  const battleRewards = useMemo(
    () => ({
      addCoins,
      addCrystals,
      addXp,
      incrementKill,
      incrementWin,
      addCrystalsFromBattle,
    }),
    [
      addCoins,
      addCrystals,
      addXp,
      incrementKill,
      incrementWin,
      addCrystalsFromBattle,
    ]
  );

  // 🆕 Spielerwechsel → Gegner spawnen
  useEffect(() => {
    if (activePlayer) spawnEnemy();
  }, [activePlayer, spawnEnemy]);

  // ⚔️ Angriff
  const handleStageTap = useCallback(() => {
    if (!enemy || enemyHp <= 0 || !activePlayer || respawning) return;
    handleAttack(PLAYER_DAMAGE, activePlayer, battleRewards);
  }, [
    enemy,
    enemyHp,
    activePlayer,
    respawning,
    PLAYER_DAMAGE,
    handleAttack,
    battleRewards,
  ]);

  // ❌ Kein Spieler gewählt
  if (!activePlayer) {
    return (
      <View style={styles.center}>
        <Text style={styles.noPlayer}>❌ Kein Spieler ausgewählt!</Text>
      </View>
    );
  }

  // Autoplay aktiv?
  const autoPlayActive = enemy && autoPlay && enemyHp > 0 && !respawning;

  // ✨ Animiertes Respawn-Overlay
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (respawning) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [respawning, fadeAnim]);

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleStageTap}
    >
      {/* 🧭 HUD */}
      <Header />
      <StageProgress current={stage} total={TOTAL_STAGES} />

      {/* ⚡ AutoPlay Toggle */}
      <TouchableOpacity
        style={[
          styles.autoPlayBtn,
          { backgroundColor: autoPlay ? "#2ecc71" : "#e74c3c" },
        ]}
        onPress={() => setAutoPlay((prev) => !prev)}
        disabled={!enemy || enemyHp <= 0}
      >
        <Text style={styles.autoPlayText}>
          {autoPlay ? "Auto: ON" : "Auto: OFF"}
        </Text>
      </TouchableOpacity>

      {/* 🤖 AutoPlay Engine */}
      <AutoPlay
        enabled={autoPlayActive}
        interval={AUTO_PLAY_INTERVAL}
        onAttack={handleStageTap}
      />

      {/* 🌄 Hintergrund */}
      <BattleBackground
        width={width}
        height={height}
        backgroundId={backgroundId}
      />

      {/* 👾 Gegner */}
      {enemy && !respawning && (
        <View style={styles.enemyWrap}>
          <EnemyFactory
            enemy={enemy}
            size={Math.min(260, Math.max(180, width * 0.6))}
          />
          <HPBar current={enemyHp} max={enemy.hp} width={200} height={20} />
        </View>
      )}

      {/* ⚔️ Respawn Overlay mit Fade */}
      {respawning && (
        <Animated.View style={[styles.respawnOverlay, { opacity: fadeAnim }]}>
          <Text style={styles.respawnText}>
            ⚔️ Gegner besiegt! Neuer Gegner erscheint …
          </Text>
        </Animated.View>
      )}

      {/* 🪨 Boden */}
      <View style={styles.groundShadow} />
      <View style={styles.ground} />

      {/* 🧑 Spieler */}
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

      {/* 🛠 Debug Overlay */}
      {__DEV__ && (
        <View style={styles.debugBox}>
          <DebugText>
            🧑 {activePlayer.name} (Lvl {activePlayer.level}) —{" "}
            {activePlayer.xp}/{activePlayer.xpToNextLevel}
          </DebugText>
          <DebugText>
            👾 {enemy?.name ?? "?"} HP: {enemyHp}/{enemy?.hp ?? 0}
          </DebugText>
          <DebugText>🎯 Stage: {stage}</DebugText>
          <View style={styles.debugButtons}>
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

// kleine Helper-Komponente für DebugText
function DebugText({ children }) {
  return <Text style={styles.debugText}>{children}</Text>;
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

  respawnOverlay: {
    position: "absolute",
    top: ENEMY_Y - 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
    padding: 10,
    backgroundColor: "#00000088",
    borderRadius: 8,
  },
  respawnText: { color: "#ffcc00", fontSize: 16, fontWeight: "700" },

  debugBox: {
    position: "absolute",
    top: 120,
    left: 10,
    right: 10,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 8,
    zIndex: 99,
  },
  debugText: { color: "#fff", fontSize: 12, marginVertical: 2 },
  debugButtons: { flexDirection: "row", gap: 8, marginTop: 6 },
});
