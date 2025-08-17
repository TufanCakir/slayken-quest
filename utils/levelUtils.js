// src/utils/levelUtils.js

/**
 * Berechnet, wie viel XP nötig ist, um das nächste Level zu erreichen.
 * Formel kann beliebig angepasst werden (exponentiell, linear, etc.)
 */
export function getXpForNextLevel(level) {
  return Math.floor(50 + level * level * 10);
}

/**
 * Fügt XP hinzu und gibt ein Objekt mit neuem Level und verbleibender XP zurück.
 */
export function addXp(currentXp, gainedXp, level, setLevelUpCallback) {
  let xp = currentXp + gainedXp;
  let currentLevel = level;
  let leveledUp = false;

  let xpNeeded = getXpForNextLevel(currentLevel);

  // Mehrfach-Levels möglich (z. B. bei viel XP auf einmal)
  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    currentLevel++;
    leveledUp = true;
    xpNeeded = getXpForNextLevel(currentLevel);
  }

  if (leveledUp && typeof setLevelUpCallback === "function") {
    setLevelUpCallback(currentLevel);
  }

  return {
    xp,
    level: currentLevel,
  };
}
