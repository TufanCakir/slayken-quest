// src/components/Player.jsx
import React, { useMemo } from "react";
import Svg, { G, Circle, Path, Line, Ellipse } from "react-native-svg";
import { useSelectedPlayer } from "../context/SelectedPlayerContext";
import classColors from "../data/classColors";
import faceConfigs from "../data/faceConfigs"; // 👈 neu eingebunden
import Berserker from "../classes/Berserker";
import Mage from "../classes/Mage";
import Assassin from "../classes/Assassin";
import Ranger from "../classes/Ranger";
import Paladin from "../classes/Paladin";
import Necromancer from "../classes/Necromancer";

const CLASS_RENDERERS = {
  Berserker,
  Paladin,
  Assassin,
  Mage,
  Ranger,
  Necromancer,
};

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

  // 2) Farben mergen (Defaults → gespeicherter Spieler → expliziter Prop)
  const colors = useMemo(() => {
    const defaults = classColors?.[charClass] || {};
    const fromSelected = selectedPlayer?.sprite || {};
    const fromProp = spriteProp || {};
    return { ...defaults, ...fromSelected, ...fromProp };
  }, [charClass, selectedPlayer?.sprite, spriteProp]);

  // 3) FaceConfig aus faceConfigs laden (Fallback auf BASE-Face)
  const faceConfig = useMemo(
    () => faceConfigs[charClass] || faceConfigs.Berserker,
    [charClass]
  );

  // 4) Mood bestimmen
  const faceMood = useMemo(() => MOODS[mood] || MOODS.neutral, [mood]);

  // Hilfsfunktion → Template Strings ersetzen
  const renderDynamicPath = (template, values) =>
    template.replace(/\{(.*?)\}/g, (_, key) => values?.[key] ?? 0);

  // 🟡 Falls wirklich nichts vorhanden → nicht rendern
  if (!spriteProp && !selectedPlayer && !classColors?.[charClass]) {
    return null;
  }

  // ---- Render Sub-Komponenten ----
  const renderLegs = () =>
    showLegs && (
      <G
        id="legs"
        stroke={colors.outlineColor}
        strokeWidth={3}
        strokeLinecap="round"
      >
        <Line x1="62" y1="102" x2="62" y2="116" />
        <Line x1="78" y1="102" x2="78" y2="116" />
      </G>
    );

  const renderFace = () =>
    showFace && (
      <G id="face" accessibilityLabel="Gesicht">
        {/* Augen */}
        <Circle {...faceConfig.eyeLeft} fill={colors.outlineColor} />
        <Circle {...faceConfig.eyeRight} fill={colors.outlineColor} />

        {/* Augenbrauen */}
        {faceMood.brows.map((b, i) => (
          <Path
            key={`brow-${i}`}
            d={renderDynamicPath(b.d, faceConfig.brows)}
            stroke={colors.outlineColor}
            strokeWidth={b.strokeWidth || 2}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Nase */}
        <Circle {...faceConfig.nose} fill={colors.outlineColor} />

        {/* Mund */}
        <Path
          d={renderDynamicPath(faceMood.mouth.d, faceConfig.mouth)}
          stroke={colors.outlineColor}
          strokeWidth={faceMood.mouth.strokeWidth || 2}
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      {showShadow && (
        <Ellipse cx="70" cy="120" rx="18" ry="6" fill="#000" opacity={0.15} />
      )}

      {/* Beine */}
      {renderLegs()}

      {/* Klassen-spezifischer Körper */}
      <ClassRenderer {...colors} />

      {/* Gesicht */}
      {renderFace()}
    </Svg>
  );
}

export default React.memo(Player);
