// enemies/SkySerpent.jsx
import React from "react";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";

export default function SkySerpent({
  size = 140,
  skin = "#C5E1A5", // grünliches Schuppenkleid
  scaleColor = "#558B2F", // Schuppenmuster
  eyeColor = "#ff0000", // rote Augen
  belly = "#8BC34A", // Bauchunterseite
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Schatten */}
      <Ellipse cx="100" cy="185" rx="40" ry="12" fill="#000" opacity={0.25} />

      {/* Geschlängelter Körper */}
      <Path
        d="M40 160 Q80 120 60 80 Q40 40 100 40 Q160 40 140 80 Q120 120 160 160"
        fill="none"
        stroke={skin}
        strokeWidth={18}
        strokeLinecap="round"
      />

      {/* Bauchlinie */}
      <Path
        d="M42 160 Q80 120 62 80 Q42 40 100 40 Q158 40 138 80 Q118 120 158 160"
        fill="none"
        stroke={belly}
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.8}
      />

      {/* Kopf */}
      <Circle
        cx="100"
        cy="40"
        r="20"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Augen */}
      <Circle cx="92" cy="38" r="4" fill={eyeColor} />
      <Circle cx="108" cy="38" r="4" fill={eyeColor} />

      {/* Zunge */}
      <Path
        d="M100 58 Q102 70 96 80"
        stroke="#d32f2f"
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M100 58 Q98 70 104 80"
        stroke="#d32f2f"
        strokeWidth={3}
        fill="none"
      />

      {/* Schuppen-Muster */}
      <Path d="M70 100 L75 105" stroke={scaleColor} strokeWidth={3} />
      <Path d="M90 120 L95 125" stroke={scaleColor} strokeWidth={3} />
      <Path d="M120 140 L125 145" stroke={scaleColor} strokeWidth={3} />
      <Path d="M140 100 L145 105" stroke={scaleColor} strokeWidth={3} />
    </Svg>
  );
}
