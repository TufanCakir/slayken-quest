// src/components/classes/Mage.jsx
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

// 🔮 Unterkomponente: Magischer Stab mit Orb
function MagicStaff({ staffId, orbMainId, orbInnerId, orbGlowId, runeColor }) {
  return (
    <G transform="translate(96,88) rotate(-35)">
      {/* Holzstab */}
      <Rect
        x={-2}
        y={0}
        width={4}
        height={44}
        rx={2}
        fill={`url(#${staffId})`}
      />

      {/* Orb */}
      <Circle
        cx={0}
        cy={-8}
        r={10}
        fill={`url(#${orbMainId})`}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <Circle cx={0} cy={-8} r={6} fill={`url(#${orbInnerId})`} opacity={0.9} />

      {/* Glow */}
      <Circle
        cx={0}
        cy={-8}
        r={14}
        fill="none"
        stroke={`url(#${orbGlowId})`}
        strokeWidth={1.5}
        opacity={0.6}
      />

      {/* Runen im Orb */}
      <Path
        d="M-4 -8 L4 -8 M0 -12 L0 -4"
        stroke={runeColor}
        strokeWidth={1}
        opacity={0.8}
      />
    </G>
  );
}

export default function Mage({
  // === Farben ===
  skin = "#EED6C4",
  armorColors = ["#512DA8", "#311B92"], // Robe & Kapuze
  staffColors = ["#6B4226", "#4E342E"], // Holzstab
  orbMainColors = ["#9C27B0", "#6A1B9A"], // Orb Hauptfarbe
  orbInnerColors = ["#E1BEE7", "#CE93D8"], // Orb inneres Leuchten
  orbGlowColors = ["#B388FF", "#7C4DFF"], // Glow
  runeColors = "#FFFFFF", // Runen im Orb
  robeRuneColors = ["#B388FF", "#7E57C2"], // Linien auf Robe

  outlineColor = "#202020",
  strokeWidth = 2,
}) {
  return (
    <G id="mage">
      {/* Gradients */}
      <Defs>
        {makeGradient("mage-armor", armorColors)}
        {makeGradient("mage-staff", staffColors)}
        {makeGradient("mage-orb-main", orbMainColors)}
        {makeGradient("mage-orb-inner", orbInnerColors)}
        {makeGradient("mage-orb-glow", orbGlowColors, { opacity: 1 })}
        {makeGradient("mage-robe-runes", robeRuneColors)}
      </Defs>

      {/* Robe */}
      <Path
        d="M50 72 Q70 120 90 72 Z"
        fill="url(#mage-armor)"
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Kapuze */}
      <Path
        d="M52 52 Q70 18 88 52 Z"
        fill="url(#mage-armor)"
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
      <Path d="M54 56 Q70 68 86 56 Z" fill="rgba(0,0,0,0.25)" />

      {/* 👇 Arme (schlank, mage-like) */}
      <Rect
        x={44}
        y={74}
        width={6}
        height={20}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />
      <Rect
        x={90}
        y={74}
        width={6}
        height={20}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Stab + Orb */}
      <MagicStaff
        staffId="mage-staff"
        orbMainId="mage-orb-main"
        orbInnerId="mage-orb-inner"
        orbGlowId="mage-orb-glow"
        runeColor={runeColors}
      />

      {/* Magische Linien auf Robe */}
      <Path
        d="M70 74 Q70 100 70 116"
        stroke="url(#mage-robe-runes)"
        strokeWidth={1.3}
        opacity={0.6}
      />
    </G>
  );
}
