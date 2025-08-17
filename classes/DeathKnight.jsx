// src/classes/DeathKnight.jsx
import {
  G,
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from "react-native-svg";
import defaultColors from "../data/deathKnightColors"; // 🎨 externe Farb-Defaults

// =========================================================
// 🔧 Gradient-Helfer
// =========================================================
function makeGradient(id, colors, x2 = "0", y2 = "1") {
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
        />
      ))}
    </LinearGradient>
  );
}

// =========================================================
// ⚔ Default-Geometrien für den Todesritter
// =========================================================
const DEFAULTS = {
  head: { cx: 70, cy: 56, r: 16 },
  body: { x: 52, y: 70, width: 36, height: 32, rx: 4 },
  armLeft: { x: 40, y: 72, width: 8, height: 14, rx: 3 },
  armRight: { x: 92, y: 72, width: 8, height: 14, rx: 3 },
  sword: {
    blade: "M0 0 L6 -46 L-6 -46 Z", // lange Klinge
    hilt: { x1: -10, y1: 0, x2: 10, y2: 0 }, // Parierstange
    grip: { width: 4, height: 18, rx: 2 },
  },
};

// =========================================================
// 💀 DeathKnight
// =========================================================
export default function DeathKnight({
  // 🎨 Farben
  skin = defaultColors.skin,
  armorColors = defaultColors.armor,
  helmetColors = defaultColors.helmet,
  swordColors = defaultColors.sword,
  gripColors = defaultColors.grip,
  runeColors = defaultColors.runes,
  outlineColors = defaultColors.outline,

  // ⚙️ Formen
  head = DEFAULTS.head,
  body = DEFAULTS.body,
  armLeft = DEFAULTS.armLeft,
  armRight = DEFAULTS.armRight,

  strokeWidth = 2,
}) {
  return (
    <G id="deathknight">
      <Defs>
        {makeGradient("dk-armor", armorColors)}
        {makeGradient("dk-helmet", helmetColors)}
        {makeGradient("dk-sword", swordColors)}
        {makeGradient("dk-grip", gripColors)}
        {makeGradient("dk-runes", runeColors)}
      </Defs>

      {/* Kopf */}
      <Circle
        {...head}
        fill={skin}
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Helm */}
      <Path
        d={`M${head.cx - head.r} ${head.cy}
           Q${head.cx} ${head.cy - head.r * 2.2} ${head.cx + head.r} ${head.cy}
           L${head.cx - head.r} ${head.cy} Z`}
        fill="url(#dk-helmet)"
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />
      {/* Helm-Visier */}
      <Line
        x1={head.cx - 6}
        y1={head.cy}
        x2={head.cx + 6}
        y2={head.cy}
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Körper */}
      <Rect
        {...body}
        fill="url(#dk-armor)"
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Arme */}
      <Rect
        {...armLeft}
        fill={skin}
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />
      <Rect
        {...armRight}
        fill={skin}
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Runenklinge */}
      <G transform={`translate(${armRight.x + 4},${armRight.y - 20})`}>
        {/* Griff */}
        <Rect
          {...DEFAULTS.sword.grip}
          x={-2}
          y={0}
          fill="url(#dk-grip)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
        {/* Parierstange */}
        <Line {...DEFAULTS.sword.hilt} stroke="url(#dk-grip)" strokeWidth={3} />
        {/* Klinge */}
        <Path
          d={DEFAULTS.sword.blade}
          fill="url(#dk-sword)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
        {/* Runen-Linien */}
        <Line
          x1={0}
          y1={-5}
          x2={0}
          y2={-40}
          stroke="url(#dk-runes)"
          strokeWidth={2}
          strokeDasharray="4,3"
        />
      </G>
    </G>
  );
}
