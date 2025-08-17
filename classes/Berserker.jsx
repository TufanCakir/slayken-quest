// src/components/classes/Berserker.jsx
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

// =========================================================
// 🔧 Gradient-Helfer
// =========================================================
function makeGradient(id, colors, x2 = "0", y2 = "1") {
  const stops = Array.isArray(colors) ? colors : [colors];
  const count = Math.max(stops.length - 1, 1);

  return (
    <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2} spreadMethod="pad">
      {stops.map((c, i) => (
        <Stop
          key={`${id}-${i}`}
          offset={`${(i / count) * 100}%`}
          stopColor={c}
        />
      ))}
    </LinearGradient>
  );
}

// =========================================================
// 🔧 Default-Geometrien
// =========================================================
const DEFAULT_HEAD = { cx: 70, cy: 56, r: 18 }; // statt (70, 40, 15)
const DEFAULT_BODY = { x: 50, y: 70, width: 40, height: 34, rx: 4 };
const DEFAULT_ARM_LEFT = { x: 40, y: 72, width: 8, height: 14, rx: 3 };
const DEFAULT_ARM_RIGHT = { x: 92, y: 72, width: 8, height: 14, rx: 3 };

const DEFAULT_SWORD = {
  x: 100, // etwas weiter rechts
  y: 55, // tiefer gesetzt, passend zu den Armen
  rotation: -0,
  grip: { width: 6, height: 28, rx: 2 },
  crossguard: { length: 10, thickness: 4 },
  blade: "M-6 -70 L0 -90 L6 -70 L4 0 L-4 0 Z",
};

// =========================================================
// 🪓 Berserker
// =========================================================
export default function Berserker({
  // === Farben ===
  skin = "#F2C29B",
  armorColors = ["#2ECC71", "#27AE60"],
  helmetColors = ["#FFD700", "#FFA000"],
  greatswordBladeColors = ["#B0BEC5", "#ECEFF1"],
  gripColors = ["#444444", "#222222"],
  outlineColor = "#222222",

  // === Größen / Positionen (optional überschreiben) ===
  head = DEFAULT_HEAD,
  body = DEFAULT_BODY,
  armLeft = DEFAULT_ARM_LEFT,
  armRight = DEFAULT_ARM_RIGHT,

  // === Schwert ===
  sword = DEFAULT_SWORD,

  strokeWidth = 2,
}) {
  return (
    <G id="berserker">
      <Defs>
        {makeGradient("berserker-armor", armorColors)}
        {makeGradient("berserker-helmet", helmetColors)}
        {makeGradient("berserker-blade", greatswordBladeColors)}
        {makeGradient("berserker-grip", gripColors)}
      </Defs>

      {/* Kopf */}
      <Circle
        {...head}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Helm (Halbkreis über Kopf) */}
      <Path
        d={`M${head.cx - head.r} ${head.cy - 2} 
           A${head.r} ${head.r} 0 0 1 ${head.cx + head.r} ${head.cy - 2} 
           L${head.cx - head.r} ${head.cy - 2} Z`}
        fill="url(#berserker-helmet)"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Körper */}
      <Rect
        {...body}
        fill="url(#berserker-armor)"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Arme */}
      <Rect
        {...armLeft}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />
      <Rect
        {...armRight}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Großschwert */}
      <G
        transform={`translate(${sword.x},${sword.y}) rotate(${sword.rotation})`}
      >
        {/* Griff */}
        <Rect
          x={-(sword.grip.width / 2)}
          y={0}
          width={sword.grip.width}
          height={sword.grip.height}
          rx={sword.grip.rx}
          fill="url(#berserker-grip)"
          stroke={outlineColor}
          strokeWidth={strokeWidth * 0.75}
        />
        {/* Parierstange */}
        <Line
          x1={-sword.crossguard.length}
          y1={0}
          x2={sword.crossguard.length}
          y2={0}
          stroke="url(#berserker-grip)"
          strokeWidth={sword.crossguard.thickness}
        />
        {/* Klinge */}
        <Path
          d={sword.blade}
          fill="url(#berserker-blade)"
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      </G>
    </G>
  );
}
