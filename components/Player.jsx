// src/components/Player.jsx
import React, { useMemo } from "react";
import Svg, { G, Circle, Path, Line, Ellipse } from "react-native-svg";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import faceConfigs from "../data/faceConfigs";

import Berserker from "../classes/Berserker";
import Mage from "../classes/Mage";
import Assassin from "../classes/Assassin";
import Ranger from "../classes/Ranger";
import Paladin from "../classes/Paladin";
import Necromancer from "../classes/Necromancer";
import DemonHunter from "../classes/DemonHunter";
import DeathKnight from "../classes/DeathKnight";

const CLASS_RENDERERS = {
  Berserker,
  Paladin,
  Assassin,
  Mage,
  Ranger,
  Necromancer,
  DemonHunter,
  DeathKnight,
};

// 😃 Face-Moods
const MOODS = {
  happy: {
    mouth: { d: "M{mx1} {my} Q{mcx} {mcy} {mx2} {my}", strokeWidth: 2.5 },
    brows: [
      { d: "M{bx1} {by} Q{bx1c} {byc} {bx2} {by}" },
      { d: "M{bx3} {by} Q{bx3c} {byc} {bx4} {by}" },
    ],
  },
  angry: {
    mouth: { d: "M{mx1} {my2} Q{mcx} {mcy2} {mx2} {my2}", strokeWidth: 2.5 },
    brows: [
      { d: "M{bx1} {by2} Q{bx1c} {byc2} {bx2} {by2}" },
      { d: "M{bx3} {by2} Q{bx3c} {byc2} {bx4} {by2}" },
    ],
  },
  neutral: {
    mouth: { d: "M{mx1} {my} Q{mcx} {my} {mx2} {my}", strokeWidth: 2 },
    brows: [
      { d: "M{bx1} {by} Q{bx1c} {by} {bx2} {by}" },
      { d: "M{bx3} {by} Q{bx3c} {by} {bx4} {by}" },
    ],
  },
};

// Template-Funktion für dynamische Paths
const renderDynamicPath = (template, values) =>
  template.replace(/\{(.*?)\}/g, (_, key) => values?.[key] ?? 0);

// 🦵 Memo-Komponente: Beine
const Legs = React.memo(({ outlineColor }) => (
  <G stroke={outlineColor} strokeWidth={3} strokeLinecap="round">
    <Line x1="62" y1="102" x2="62" y2="116" />
    <Line x1="78" y1="102" x2="78" y2="116" />
  </G>
));

// 🙂 Memo-Komponente: Gesicht
const Face = React.memo(function Face({ colors, faceConfig, faceMood }) {
  const dBrows = useMemo(
    () => faceMood.brows.map((b) => renderDynamicPath(b.d, faceConfig.brows)),
    [faceMood, faceConfig]
  );

  const dMouth = useMemo(
    () => renderDynamicPath(faceMood.mouth.d, faceConfig.mouth),
    [faceMood, faceConfig]
  );

  return (
    <G id="face">
      {/* Augen */}
      <Circle {...faceConfig.eyeLeft} fill={colors.outlineColor || "#000"} />
      <Circle {...faceConfig.eyeRight} fill={colors.outlineColor || "#000"} />

      {/* Augenbrauen */}
      {dBrows.map((d, i) => (
        <Path
          key={`brow-${i}`}
          d={d}
          stroke={colors.outlineColor || "#000"}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      ))}

      {/* Nase */}
      <Circle {...faceConfig.nose} fill={colors.outlineColor || "#000"} />

      {/* Mund */}
      <Path
        d={dMouth}
        stroke={colors.outlineColor || "#000"}
        strokeWidth={faceMood.mouth.strokeWidth || 2}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
});

// 🟢 Player-Komponente
function Player({
  size = 140,
  sprite: spriteProp,
  mood = "happy",
  playerClass,
  showShadow = true,
  showLegs = true,
  showFace = true,
}) {
  const { selectedPlayer } = useSelectedPlayer();

  // 1) Klasse bestimmen
  const charClass = useMemo(
    () => playerClass ?? selectedPlayer?.class ?? "Berserker",
    [playerClass, selectedPlayer?.class]
  );
  const ClassRenderer = CLASS_RENDERERS[charClass] || Berserker;

  // 2) Sprite mergen: Context > Prop
  const colors = useMemo(
    () => ({ ...(selectedPlayer?.sprite || {}), ...(spriteProp || {}) }),
    [selectedPlayer?.sprite, spriteProp]
  );

  // 3) FaceConfig + Mood vorberechnen
  const faceConfig = useMemo(
    () => faceConfigs[charClass] || faceConfigs.Berserker,
    [charClass]
  );
  const faceMood = useMemo(() => MOODS[mood] || MOODS.neutral, [mood]);

  // 🟡 Kein Sprite? → nichts rendern
  if (!spriteProp && !selectedPlayer) return null;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Schatten */}
      {showShadow && (
        <Ellipse cx="70" cy="120" rx="18" ry="6" fill="#000" opacity={0.15} />
      )}

      {/* Beine */}
      {showLegs && <Legs outlineColor={colors.outlineColor || "#000"} />}

      {/* Körper */}
      <ClassRenderer {...colors} />

      {/* Gesicht */}
      {showFace && (
        <Face colors={colors} faceConfig={faceConfig} faceMood={faceMood} />
      )}
    </Svg>
  );
}

export default React.memo(Player);
