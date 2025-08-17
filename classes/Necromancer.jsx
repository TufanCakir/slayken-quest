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
}) {
  return (
    <G transform="translate(96,88) rotate(-25)">
      {/* Stab */}
      <Rect x={-2} y={0} width={4} height={46} fill={`url(#${staffId})`} />

      {/* Orb */}
      <Circle
        cx={0}
        cy={-8}
        r={10}
        fill={`url(#${orbMainId})`}
        stroke={`url(#${orbStrokeId})`}
        strokeWidth={2.5}
      />

      {/* Totenkopf im Orb */}
      <Path
        d="M-4 -9 Q0 -14 4 -9 Q4 -5 0 -2 Q-4 -5 -4 -9Z"
        fill={skullColor}
        opacity={0.8}
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
  skin = "#E0D4D4",
  outlineColor = "#202020",

  robeColors = ["#222", "#111"],
  hoodColors = ["#111", "#000"],

  staffColors = ["#2C2C2C", "#1A1A1A"],
  orbMainColors = ["#111", "#333"],
  orbStrokeColors = ["#0ff", "#08f"],
  orbGlowColors = ["#0ff", "#0aa"],

  skullColors = "#0ff",
  runeColors = ["#0ff", "#08f"],

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
      <Path d="M54 56 Q70 70 86 56 Z" fill="rgba(0,0,0,0.2)" />

      {/* 👇 Arme (schmal & länger) */}
      <Rect
        x={44}
        y={74}
        width={6}
        height={22}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />
      <Rect
        x={90}
        y={74}
        width={6}
        height={22}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Stab + Orb */}
      <NecroStaff
        staffId="nec-staff"
        orbMainId="nec-orb-main"
        orbStrokeId="nec-orb-stroke"
        orbGlowId="nec-orb-glow"
        skullColor={skullColors}
      />

      {/* Magische Runenlinien */}
      <Path
        d="M70 72 Q70 100 70 118"
        stroke="url(#nec-runes)"
        strokeWidth={1.5}
        opacity={0.6}
      />
      <Path
        d="M60 80 Q70 95 80 80"
        stroke="url(#nec-runes)"
        strokeWidth={1.2}
        opacity={0.6}
      />
    </G>
  );
}
