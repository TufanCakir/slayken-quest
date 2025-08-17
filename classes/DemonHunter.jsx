// src/classes/DemonHunter.jsx
import {
  G,
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import defaultColors from "../data/demonHunterColors"; // 🎨 externe Farb-Defaults

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
// ⚙️ Default-Geometrien (zentral definiert)
// =========================================================
const DEFAULTS = {
  head: { cx: 70, cy: 56, r: 16 },
  body: { x: 52, y: 70, width: 36, height: 32, rx: 4 },
  armLeft: { x: 40, y: 72, width: 8, height: 14, rx: 3 },
  armRight: { x: 92, y: 72, width: 8, height: 14, rx: 3 },
  glaive: {
    // Halbmond-Form (gebogene Klinge)
    blade: "M-20 -10 Q0 -40 20 -10 L15 -5 Q0 -25 -15 -5 Z",
    grip: { width: 4, height: 16, rx: 2 },
  },
};

// =========================================================
// 🪓 DemonHunter mit Gleven
// =========================================================
export default function DemonHunter({
  // 🎨 Farben → mit Fallbacks
  skin = defaultColors.skin,
  armorColors = defaultColors.armor,
  hoodColors = defaultColors.hood,
  glaiveColors = defaultColors.glaive,
  gripColors = defaultColors.grip,
  outlineColors = defaultColors.outline,

  // ⚙️ Formen → mit Fallbacks
  head = DEFAULTS.head,
  body = DEFAULTS.body,
  armLeft = DEFAULTS.armLeft,
  armRight = DEFAULTS.armRight,

  strokeWidth = 2,
}) {
  return (
    <G id="demonhunter">
      <Defs>
        {makeGradient("dh-armor", armorColors)}
        {makeGradient("dh-hood", hoodColors)}
        {makeGradient("dh-glaive", glaiveColors)}
        {makeGradient("dh-grip", gripColors)}
      </Defs>

      {/* Kopf */}
      <Circle
        {...head}
        fill={skin}
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Kapuze */}
      <Path
        d={`M${head.cx - head.r - 4} ${head.cy}
           Q${head.cx} ${head.cy - head.r * 2} ${head.cx + head.r + 4} ${
          head.cy
        }
           L${head.cx - head.r - 4} ${head.cy} Z`}
        fill="url(#dh-hood)"
        stroke={outlineColors}
        strokeWidth={strokeWidth}
      />

      {/* Körper */}
      <Rect
        {...body}
        fill="url(#dh-armor)"
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

      {/* Linke Gleve */}
      <G transform={`translate(${armLeft.x - 12},${armLeft.y + 10})`}>
        <Path
          d={DEFAULTS.glaive.blade}
          fill="url(#dh-glaive)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
        <Rect
          {...DEFAULTS.glaive.grip}
          x={-2}
          y={-2}
          fill="url(#dh-grip)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
      </G>

      {/* Rechte Gleve (gespiegelt) */}
      <G
        transform={`translate(${armRight.x + 20},${
          armRight.y + 10
        }) scale(-1,1)`}
      >
        <Path
          d={DEFAULTS.glaive.blade}
          fill="url(#dh-glaive)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
        <Rect
          {...DEFAULTS.glaive.grip}
          x={-2}
          y={-2}
          fill="url(#dh-grip)"
          stroke={outlineColors}
          strokeWidth={strokeWidth}
        />
      </G>
    </G>
  );
}
