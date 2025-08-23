// src/components/enemies/EnemyFactory.jsx
import React from "react";
import PropTypes from "prop-types";

// 👉 Imports aller Enemies (müssen existieren)
import Goblin from "./Goblin";
import Skeleton from "./Skeleton";
import DarkMage from "./DarkMage";
import Vampire from "./Vampire";
import Werewolf from "./Werewolf";
import Demon from "./Demon";
import EliteKnight from "./EliteKnight";
import Slime from "./Slime";
import FlameImp from "./FlameImp";
import IceElemental from "./IceElemental";
import FrostWolf from "./FrostWolf";
import StormHarpy from "./StormHarpy";
import SkySerpent from "./SkySerpent";

// 🛡️ Fallback-Komponente (für fehlende Implementierungen)
function UnknownEnemy({ size }) {
  if (__DEV__) console.warn("⚠️ Unbekannter Gegner gerendert!");
  return <DarkMage size={size} />;
}

// ✨ Mapping: enemy.id → Component
const ENEMY_MAP = {
  slime: Slime,
  enemy_001: Goblin, // Goblin Raider
  enemy_002: Skeleton, // Skeleton Warrior
  enemy_003: DarkMage, // Dark Mage

  enemy_fire_001: FlameImp, // Flame Imp
  enemy_fire_002: Demon, // Lava Golem → temporär Demon
  enemy_ice_001: FrostWolf, // Frost Wolf
  enemy_ice_002: IceElemental, // Ice Elemental
  enemy_wind_001: StormHarpy, // Storm Harpy
  enemy_wind_002: SkySerpent, // Sky Serpent

  enemy_earth_001: Skeleton, // Stone Guardian (TODO: eigene Komponente)
  enemy_earth_002: Skeleton, // Cave Troll (TODO)

  enemy_vampire_001: Vampire, // Vampire Thrall
  enemy_vampire_002: Vampire, // Vampire Lord
  enemy_werewolf_001: Werewolf, // Feral Werewolf
  enemy_werewolf_002: Werewolf, // Alpha Werewolf

  enemy_mage_001: DarkMage, // Apprentice Mage (TODO: eigene)
  enemy_mage_002: DarkMage, // Archmage (TODO: eigene)
  enemy_skeleton_mage: Skeleton, // Skeleton Mage

  enemy_elite_knight: EliteKnight, // Elite Black Knight

  enemy_demon_001: Demon, // Lesser Demon
  enemy_demon_002: Demon, // Demon Overlord
};

// 🏭 EnemyFactory
export default function EnemyFactory({ enemy, size = 120 }) {
  if (!enemy || !enemy.id) {
    if (__DEV__)
      console.warn("⚠️ EnemyFactory: enemy oder enemy.id fehlt!", enemy);
    return null;
  }

  const EnemyComponent = ENEMY_MAP[enemy.id] || UnknownEnemy;
  return <EnemyComponent size={size} {...(enemy.sprite ?? {})} />;
}

EnemyFactory.propTypes = {
  enemy: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sprite: PropTypes.object,
  }),
  size: PropTypes.number,
};
