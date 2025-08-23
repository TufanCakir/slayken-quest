// enemies/IceElemental.jsx
import React from "react";
import Svg, { Rect, Path, Ellipse, Polygon } from "react-native-svg";

export default function IceElemental({
  size = 120,
  skin = "#81D4FA", // Eisblau
  crystal = "#0277BD",
  glow = "#B3E5FC",
  eyeColor = "#ffffff",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      {/* Schatten */}
      <Ellipse cx="80" cy="145" rx="34" ry="12" fill="#000" opacity={0.3} />

      {/* Körper (Kristall-Form) */}
      <Polygon
        points="50,140 30,80 80,20 130,80 110,140"
        fill={skin}
        stroke={crystal}
        strokeWidth={4}
      />

      {/* Augen */}
      <Rect x="65" y="70" width="10" height="6" rx="2" fill={eyeColor} />
      <Rect x="85" y="70" width="10" height="6" rx="2" fill={eyeColor} />

      {/* Eislinien */}
      <Path d="M80 20 L80 140" stroke={glow} strokeWidth={2} opacity={0.6} />
      <Path d="M50 90 L110 90" stroke={glow} strokeWidth={2} opacity={0.6} />
    </Svg>
  );
}
