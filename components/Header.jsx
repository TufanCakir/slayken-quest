import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useCoins } from "../context/CoinsContext";
import { useCrystals } from "../context/CrystalsContext";
import { useAccountLevel } from "../context/AccountLevelContext";
import XPBar from "./XPBar";

export default function Header() {
  const { coins } = useCoins();
  const { crystals } = useCrystals();
  const { level, xp } = useAccountLevel();

  const maxXp = useMemo(() => level * 100, [level]);

  return (
    <View style={styles.container}>
      {/* Coins */}
      <StatItem
        icon={<FontAwesome5 name="coins" size={22} color="#FFD700" />}
        value={coins}
      />

      {/* Level + XP */}
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Lvl {level}</Text>
        <XPBar xp={xp} maxXp={maxXp} level={level} width={110} height={25} />
      </View>

      {/* Crystals */}
      <StatItem
        icon={
          <MaterialCommunityIcons
            name="cards-diamond"
            size={22}
            color="#00E5FF"
          />
        }
        value={crystals}
      />
    </View>
  );
}

// 🔹 Wiederverwendbare kleine Komponente
function StatItem({ icon, value }) {
  return (
    <View style={styles.item}>
      {icon}
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "#272b45",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  levelContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  levelText: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 2,
    fontWeight: "700",
  },
});
