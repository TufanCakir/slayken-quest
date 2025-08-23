// src/components/enemies/Goblin.jsx
import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function Goblin({
  size = 100,
  skin = "#8BC34A",
  armor = "#33691E",
  helmet = "#558B2F",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="128" rx="26" ry="8" fill="#000" opacity={0.15} />

      {/* Kopf */}
      <Circle
        cx="70"
        cy="50"
        r="22"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />
      {/* Goblin-Ohren */}
      <Path d="M46 50 Q30 40 46 30" fill={skin} stroke="#000" strokeWidth={2} />
      <Path
        d="M94 50 Q110 40 94 30"
        fill={skin}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Augen */}
      <Circle cx="62" cy="50" r="3" fill="#000" />
      <Circle cx="78" cy="50" r="3" fill="#000" />

      {/* Mund */}
      <Path d="M60 62 Q70 70 80 62" stroke="#900" strokeWidth={2} fill="none" />

      {/* Körper */}
      <Rect
        x="50"
        y="72"
        width="40"
        height="36"
        rx="6"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />
    </Svg>
  );
}
