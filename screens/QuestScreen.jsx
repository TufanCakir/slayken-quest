import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuests } from "../context/QuestContext";

function RewardPill({ xp = 0, gold = 0, crystals = 0 }) {
  const parts = [];
  if (xp) parts.push(`XP ${xp}`);
  if (gold) parts.push(`Gold ${gold}`);
  if (crystals) parts.push(`Kristalle ${crystals}`);
  return <Text style={styles.rewards}>{parts.join(" • ") || "—"}</Text>;
}

function ProgressText({ quest }) {
  const st = quest.state;
  const p = st?.progress || {};
  switch (quest.type) {
    case "kills": {
      const need = quest.target?.count ?? 0;
      const only = quest.target?.enemyId;
      const have = only ? p?.countByEnemy?.[only] ?? 0 : p?.total ?? 0;
      return (
        <Text style={styles.progress}>
          {have}/{need}
        </Text>
      );
    }
    case "wins": {
      const need = quest.target?.count ?? 0;
      const have = p?.total ?? 0;
      return (
        <Text style={styles.progress}>
          {have}/{need}
        </Text>
      );
    }
    case "reach_level": {
      const need = quest.target?.level ?? 1;
      const have = p?.level ?? 1;
      return (
        <Text style={styles.progress}>
          Level {have}/{need}
        </Text>
      );
    }
    case "collect_crystals": {
      const need = quest.target?.count ?? 0;
      const have = p?.total ?? 0;
      return (
        <Text style={styles.progress}>
          {have}/{need}
        </Text>
      );
    }
    default:
      return null;
  }
}

function QuestCard({ quest, onAccept, onAbandon, onClaim }) {
  const status = quest.state?.status || "available";
  const isAvailable = status === "available";
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isClaimed = status === "claimed";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{quest.title}</Text>
      <Text style={styles.desc}>{quest.description}</Text>
      <RewardPill {...quest.rewards} />
      <ProgressText quest={quest} />
      <View style={styles.row}>
        {isAvailable && (
          <TouchableOpacity
            style={[styles.btn, styles.primary]}
            onPress={onAccept}
          >
            <Text style={styles.btnText}>Annehmen</Text>
          </TouchableOpacity>
        )}
        {isActive && (
          <TouchableOpacity
            style={[styles.btn, styles.warn]}
            onPress={onAbandon}
          >
            <Text style={styles.btnText}>Aufgeben</Text>
          </TouchableOpacity>
        )}
        {isCompleted && (
          <TouchableOpacity
            style={[styles.btn, styles.success]}
            onPress={onClaim}
          >
            <Text style={styles.btnText}>Belohnung</Text>
          </TouchableOpacity>
        )}
        {isClaimed && <Text style={styles.claimed}>✔ Abgeschlossen</Text>}
      </View>
    </View>
  );
}

export default function QuestScreen() {
  const { quests, acceptQuest, abandonQuest, claimRewards } = useQuests();
  const [tab, setTab] = useState("active"); // "active" | "available" | "completed"

  const filtered = useMemo(() => {
    switch (tab) {
      case "active":
        return quests.filter((q) => q.state?.status === "active");
      case "available":
        return quests.filter((q) => q.state?.status === "available");
      case "completed":
        return quests.filter(
          (q) =>
            q.state?.status === "completed" || q.state?.status === "claimed"
        );
      default:
        return quests;
    }
  }, [quests, tab]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quests</Text>

      <View style={styles.tabs}>
        {["active", "available", "completed"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "active"
                ? "Aktiv"
                : t === "available"
                ? "Verfügbar"
                : "Abgeschlossen"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            onAccept={() => acceptQuest(item.id)}
            onAbandon={() => abandonQuest(item.id)}
            onClaim={() => claimRewards(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Keine Quests in diesem Tab.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    padding: 16,
    paddingBottom: 8,
  },
  tabs: { flexDirection: "row", paddingHorizontal: 12, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#2d3436" },
  tabText: { color: "#aaa", fontWeight: "700" },
  tabTextActive: { color: "#fff" },

  card: {
    backgroundColor: "#1b1b1b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "800" },
  desc: { color: "#ccc", marginTop: 4 },
  rewards: { color: "#8bdc8b", marginTop: 8, fontWeight: "700" },
  progress: { color: "#9ecbff", marginTop: 6, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center" },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "800" },
  primary: { backgroundColor: "#3b82f6" },
  warn: { backgroundColor: "#f59e0b" },
  success: { backgroundColor: "#10b981" },
  claimed: { color: "#a3e635", fontWeight: "800" },
  empty: { padding: 32, alignItems: "center" },
  emptyText: { color: "#666" },
});
