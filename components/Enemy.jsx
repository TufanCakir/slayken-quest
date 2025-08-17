import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse, Line } from "react-native-svg";

export default function Enemy({
  size = 80,
  skin = "#ccc",
  armor = "#555",
  helmet = "#777",
  eyeColor = "#000",
  mouthColor = "#000",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="126" rx="20" ry="7" fill="#000" opacity={0.15} />

      {/* Körper */}
      <G id="body">
        <Rect
          x="50"
          y="72"
          width="40"
          height="32"
          rx="6"
          fill={armor}
          stroke="#000"
          strokeWidth={3}
        />
        {/* Arme */}
        <Circle
          cx="44"
          cy="86"
          r="7"
          fill={skin}
          stroke="#000"
          strokeWidth={3}
        />
        <Circle
          cx="96"
          cy="86"
          r="7"
          fill={skin}
          stroke="#000"
          strokeWidth={3}
        />
      </G>

      {/* Beine */}
      <G id="legs">
        <Rect
          x="56"
          y="104"
          width="8"
          height="18"
          rx="3"
          fill={armor}
          stroke="#000"
          strokeWidth={2}
        />
        <Rect
          x="76"
          y="104"
          width="8"
          height="18"
          rx="3"
          fill={armor}
          stroke="#000"
          strokeWidth={2}
        />
        <Ellipse
          cx="60"
          cy="124"
          rx="6"
          ry="3"
          fill="#222"
          stroke="#000"
          strokeWidth={1}
        />
        <Ellipse
          cx="80"
          cy="124"
          rx="6"
          ry="3"
          fill="#222"
          stroke="#000"
          strokeWidth={1}
        />
      </G>

      {/* Kopf */}
      <G id="head">
        <Circle
          cx="70"
          cy="56"
          r="18"
          fill={skin}
          stroke="#000"
          strokeWidth={3}
        />

        {/* Helm */}
        <Path
          d="M52 52 A18 18 0 0 1 88 52 L52 52 Z"
          fill={helmet}
          stroke="#000"
          strokeWidth={3}
        />
        <Rect
          x="50"
          y="50"
          width="40"
          height="4"
          rx="2"
          fill={helmet}
          stroke="#000"
          strokeWidth={3}
        />

        {/* Gesicht */}
        {/* Augen */}
        <Circle cx="62" cy="56" r="2.5" fill={eyeColor} />
        <Circle cx="78" cy="56" r="2.5" fill={eyeColor} />

        {/* Mund */}
        <Path
          d="M62 64 Q70 70 78 64"
          stroke={mouthColor}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
