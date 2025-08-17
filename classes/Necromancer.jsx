// src/components/classes/Necromancer.jsx
import React from "react";
import {
  G,
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import defaultColors from "../data/necromancerColors"; // 🎨 externe Farb-Defaults

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

// 🔮 Unterkomponente: Stab + Orb
function NecroStaff({
  staffId,
  orbMainId,
  orbStrokeId,
  orbGlowId,
  skullColor,
  outlineColor,
}) {
  return (
    <G transform="translate(96,88) rotate(-25)">
      {/* Stab */}
      <Rect
        x={-2}
        y={0}
        width={4}
        height={46}
        rx={2}
        fill={`url(#${staffId})`}
        stroke={outlineColor}
        strokeWidth={1}
      />

      {/* Orb */}
      <Circle
        cx={0}
        cy={-8}
        r={10}
        fill={`url(#${orbMainId})`}
        stroke={`url(#${orbStrokeId})`}
        strokeWidth={2}
      />
      <Circle
        cx={0}
        cy={-8}
        r={10}
        fill="none"
        stroke={outlineColor}
        strokeWidth={1}
      />

      {/* Totenkopf im Orb */}
      <Path
        d="M-4 -9 Q0 -14 4 -9 Q4 -5 0 -2 Q-4 -5 -4 -9Z"
        fill={skullColor}
        stroke={outlineColor}
        strokeWidth={0.8}
        opacity={0.85}
      />

      {/* Glow */}
      <Circle
        cx={0}
        cy={-8}
        r={14}
        fill="none"
        stroke={`url(#${orbGlowId})`}
        strokeWidth={1.5}
        opacity={0.5}
      />
    </G>
  );
}

export default function Necromancer({
  // === Farben ===
  skin = defaultColors.skin,
  outlineColor = defaultColors.outline,

  robeColors = defaultColors.robe,
  hoodColors = defaultColors.hood,

  staffColors = defaultColors.staff,
  orbMainColors = defaultColors.orbMain,
  orbStrokeColors = defaultColors.orbStroke,
  orbGlowColors = defaultColors.orbGlow,

  skullColors = defaultColors.skull,
  runeColors = defaultColors.runes,

  strokeWidth = 2,
}) {
  return (
    <G id="necromancer">
      <Defs>
        {makeGradient("nec-robe", robeColors)}
        {makeGradient("nec-hood", hoodColors)}
        {makeGradient("nec-staff", staffColors)}
        {makeGradient("nec-orb-main", orbMainColors)}
        {makeGradient("nec-orb-stroke", orbStrokeColors)}
        {makeGradient("nec-orb-glow", orbGlowColors)}
        {makeGradient("nec-runes", runeColors, { x2: "1", y2: "0" })}
      </Defs>

      {/* Robe */}
      <Path
        d="M50 72 Q70 120 90 72 Z"
        fill="url(#nec-robe)"
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Kapuze */}
      <Path
        d="M52 52 Q70 20 88 52 Z"
        fill="url(#nec-hood)"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Kopf */}
      <Circle
        cx={70}
        cy={56}
        r={16}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Gesichtsschatten */}
      <Path d="M54 56 Q70 70 86 56 Z" fill="rgba(0,0,0,0.25)" />

      {/* Arme */}
      {[
        { x: 44, y: 74 },
        { x: 90, y: 74 },
      ].map((pos, i) => (
        <Rect
          key={`arm-${i}`}
          x={pos.x}
          y={pos.y}
          width={6}
          height={22}
          rx={3}
          fill={skin}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* Stab + Orb */}
      <NecroStaff
        staffId="nec-staff"
        orbMainId="nec-orb-main"
        orbStrokeId="nec-orb-stroke"
        orbGlowId="nec-orb-glow"
        skullColor={skullColors}
        outlineColor={outlineColor}
      />

      {/* Magische Runenlinien */}
      <Path
        d="M70 72 Q70 100 70 118"
        stroke="url(#nec-runes)"
        strokeWidth={1.5}
        opacity={0.65}
      />
      <Path
        d="M60 80 Q70 95 80 80"
        stroke="url(#nec-runes)"
        strokeWidth={1.3}
        opacity={0.65}
      />
    </G>
  );
}
