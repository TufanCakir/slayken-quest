export function getXpForLevel(level) {
  if (level >= 50) return Infinity;
  return 100 + (level - 1) * 50; // einfache Progression
}

export function gainXp(player, amount) {
  if (player.level >= 50) return player;

  let newXp = player.xp + amount;
  let newLevel = player.level;
  let xpToNext = getXpForLevel(newLevel);

  while (newXp >= xpToNext && newLevel < 50) {
    newXp -= xpToNext;
    newLevel++;
    xpToNext = getXpForLevel(newLevel);
  }

  return {
    ...player,
    xp: newXp,
    level: newLevel,
    xpToNextLevel: xpToNext,
  };
}
