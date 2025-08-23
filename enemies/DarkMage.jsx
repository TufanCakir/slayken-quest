// enemies/DarkMage.jsx
import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse, Line } from "react-native-svg";

export default function DarkMage({
  size = 100,
  skin = "#B39DDB", // blass-lila Haut
  armor = "#512DA8", // dunkellila Robe
  helmet = "#311B92", // Kapuze
  eyeColor = "#ff0000", // glühend rot
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="128" rx="26" ry="8" fill="#000" opacity={0.2} />

      {/* Kapuzen-Kopf */}
      <G id="hood">
        <Circle
          cx="70"
          cy="50"
          r="22"
          fill={helmet}
          stroke="#000"
          strokeWidth={3}
        />
        {/* Gesicht (Schatten) */}
        <Circle cx="70" cy="52" r="14" fill={skin} opacity={0.5} />
        {/* Augen */}
        <Circle cx="62" cy="52" r="3" fill={eyeColor} />
        <Circle cx="78" cy="52" r="3" fill={eyeColor} />
      </G>

      {/* Körper / Robe */}
      <Path
        d="M50 72 Q70 120 90 72 Z"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Gürtel */}
      <Rect
        x="55"
        y="90"
        width="30"
        height="6"
        rx="2"
        fill="#222"
        stroke="#000"
      />

      {/* Stab */}
      <Line
        x1="100"
        y1="40"
        x2="95"
        y2="120"
        stroke="#4E342E"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Magische Kugel oben */}
      <Circle
        cx="100"
        cy="35"
        r="8"
        fill="#8e24aa"
        stroke="#000"
        strokeWidth={2}
      />
    </Svg>
  );
}
