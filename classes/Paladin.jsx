// src/components/classes/Paladin.jsx
import React from "react";
import {
  G,
  Rect,
  Circle,
  Path,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import defaultColors from "../data/paladinColors"; // 🎨 externe Farb-Defaults

// 🔧 Gradient-Helfer
function makeGradient(id, colors, { x2 = "0", y2 = "1", opacity = 1 } = {}) {
  const stops = Array.isArray(colors) ? colors : [colors];
  const count = Math.max(stops.length - 1, 1);
  return (
    <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2} spreadMethod="pad">
      {stops.map((c, i) => (
        <Stop
          key={`${id}-${i}`}
          offset={`${(i / count) * 100}%`}
          stopColor={c}
          stopOpacity={opacity}
        />
      ))}
    </LinearGradient>
  );
}

// 🛡 Schild
function PaladinShield({ shieldId, crossId, outline }) {
  return (
    <G transform="translate(100,85)">
      {/* Grundform */}
      <Path
        d="M0 0 L20 15 L20 50 L0 65 L-20 50 L-20 15 Z"
        fill={`url(#${shieldId})`}
        stroke={outline}
        strokeWidth={2.5}
      />
      {/* Kreuz */}
      <Line
        x1={0}
        y1={12}
        x2={0}
        y2={48}
        stroke={`url(#${crossId})`}
        strokeWidth={3}
      />
      <Line
        x1={-10}
        y1={30}
        x2={10}
        y2={30}
        stroke={`url(#${crossId})`}
        strokeWidth={3}
      />
    </G>
  );
}

// ⚔ Schwert
function PaladinSword({ gripId, weaponId, bladeId, outline }) {
  return (
    <G transform="translate(44,90) rotate(-25)">
      {/* Griff */}
      <Rect
        x={-2}
        y={0}
        width={4}
        height={20}
        fill={`url(#${gripId})`}
        stroke={outline}
        strokeWidth={1}
      />
      {/* Parierstange */}
      <Line
        x1={-10}
        y1={0}
        x2={10}
        y2={0}
        stroke={`url(#${weaponId})`}
        strokeWidth={3}
      />
      {/* Klinge */}
      <Path
        d="M0 0 L6 -42 L-6 -42 Z"
        fill={`url(#${bladeId})`}
        stroke={outline}
        strokeWidth={2}
      />
    </G>
  );
}

export default function Paladin({
  // === Farben ===
  skin = defaultColors.skin,
  armorColors = defaultColors.armor,
  helmetColors = defaultColors.helmet,
  shieldColors = defaultColors.shield,
  weaponColors = defaultColors.weapon,
  swordBladeColors = defaultColors.swordBlade,
  gripColors = defaultColors.grip,
  crossColors = defaultColors.cross,
  outlineColor = defaultColors.outline,

  strokeWidth = 2,
}) {
  return (
    <G id="paladin">
      <Defs>
        {makeGradient("paladin-armor", armorColors)}
        {makeGradient("paladin-helmet", helmetColors)}
        {makeGradient("paladin-shield", shieldColors)}
        {makeGradient("paladin-weapon", weaponColors)}
        {makeGradient("paladin-blade", swordBladeColors)}
        {makeGradient("paladin-grip", gripColors)}
        {makeGradient("paladin-cross", crossColors)}
      </Defs>

      {/* Brustplatte */}
      <Rect
        x={50}
        y={70}
        width={40}
        height={34}
        rx={4}
        fill="url(#paladin-armor)"
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Schulterplatten */}
      {[
        { d: "M48 70 Q50 60 60 65 Q55 75 48 70Z" },
        { d: "M92 70 Q90 60 80 65 Q85 75 92 70Z" },
      ].map((p, i) => (
        <Path
          key={`shoulder-${i}`}
          d={p.d}
          fill="url(#paladin-armor)"
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* Kopf */}
      <Circle
        cx={70}
        cy={56}
        r={18}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Helm */}
      <Path
        d="M52 52 Q70 26 88 52 Z"
        fill="url(#paladin-helmet)"
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />
      {/* Helm-Mittelstreifen */}
      <Line
        x1={70}
        y1={34}
        x2={70}
        y2={58}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Arme */}
      {[
        { x: 42, y: 72 },
        { x: 90, y: 72 },
      ].map((arm, i) => (
        <Rect
          key={`arm-${i}`}
          x={arm.x}
          y={arm.y}
          width={8}
          height={18}
          rx={3}
          fill={skin}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* Schild */}
      <PaladinShield
        shieldId="paladin-shield"
        crossId="paladin-cross"
        outline={outlineColor}
      />

      {/* Schwert */}
      <PaladinSword
        gripId="paladin-grip"
        weaponId="paladin-weapon"
        bladeId="paladin-blade"
        outline={outlineColor}
      />
    </G>
  );
}
