// src/components/classes/Assassin.jsx
import React from "react";
import {
  G,
  Rect,
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import defaultColors from "../data/assassinColors"; // 🎨 externe Farb-Defaults

// =========================================================
// 🔧 Gradient-Helfer
// =========================================================
function makeGradient(id, colors, { x2 = "0", y2 = "1", opacity = 1 } = {}) {
  if (!colors) return null;
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

// =========================================================
// 🔪 Dolch-Renderer
// =========================================================
function Dagger({ x, y, rotation, bladeId, glowId, gripColor, outline }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Klinge */}
      <Line
        x1={0}
        y1={0}
        x2={0}
        y2={22}
        stroke={`url(#${bladeId})`}
        strokeWidth={3}
      />
      {/* Griff */}
      <Path
        d="M-4 22 L0 32 L4 22 Z"
        fill={gripColor}
        stroke={outline}
        strokeWidth={1}
      />
      {/* Glow-Effekt */}
      <Path
        d="M0 0 L0 22"
        stroke={`url(#${glowId})`}
        strokeWidth={1.5}
        opacity={0.7}
      />
    </G>
  );
}

// =========================================================
// 🗡 Assassin
// =========================================================
export default function Assassin({
  // === Farben ===
  skin = defaultColors.skin,
  armorColors = defaultColors.armor,
  hoodColors = defaultColors.hood,
  weaponColors = defaultColors.weapon,
  gripColor = defaultColors.grip,
  glowColors = defaultColors.glow,
  bandColor = defaultColors.band,
  outlineColor = defaultColors.outline,

  strokeWidth = 2,
}) {
  return (
    <G id="assassin">
      {/* Gradients */}
      <Defs>
        {makeGradient("assassin-blade", weaponColors)}
        {makeGradient("assassin-glow", glowColors, { opacity: 0.7 })}
        {makeGradient("assassin-hood", hoodColors)}
        {makeGradient("assassin-armor", armorColors)}
      </Defs>

      {/* Körper / Rüstung */}
      <Rect
        x={52}
        y={72}
        width={36}
        height={28}
        rx={4}
        fill="url(#assassin-armor)"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Kapuze */}
      <Path
        d="M52 52 Q70 6 88 52 Z"
        fill="url(#assassin-hood)"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Kopf */}
      <Circle
        cx={70}
        cy={56}
        r={15}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Gesichtsschatten */}
      <Path d="M55 55 Q70 66 85 55 Z" fill="rgba(0,0,0,0.35)" />

      {/* Arme */}
      <G transform="translate(46,74) rotate(-8)">
        <Rect
          x={-3}
          y={0}
          width={6}
          height={18}
          rx={3}
          fill={skin}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      </G>
      <G transform="translate(90,74) rotate(8)">
        <Rect
          x={-3}
          y={0}
          width={6}
          height={18}
          rx={3}
          fill={skin}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      </G>

      {/* Dolche */}
      <Dagger
        x={48}
        y={90}
        rotation={-10}
        bladeId="assassin-blade"
        glowId="assassin-glow"
        gripColor={gripColor}
        outline={outlineColor}
      />
      <Dagger
        x={88}
        y={90}
        rotation={10}
        bladeId="assassin-blade"
        glowId="assassin-glow"
        gripColor={gripColor}
        outline={outlineColor}
      />

      {/* Brustband */}
      <Path
        d="M52 78 L88 84"
        stroke={bandColor}
        strokeWidth={2}
        opacity={0.6}
      />
    </G>
  );
}
