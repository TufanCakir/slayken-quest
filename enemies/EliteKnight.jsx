// enemies/EliteKnight.jsx
import React from "react";
import Svg, { Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function EliteKnight({
  size = 120,
  skin = "#B0BEC5", // metallischer Touch
  armor = "#212121", // dunkle Rüstung
  helmet = "#263238", // Helm
  eyeColor = "#ff0000", // glühende Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      {/* Schatten */}
      <Ellipse cx="80" cy="145" rx="34" ry="12" fill="#000" opacity={0.3} />

      {/* Helm */}
      <Circle
        cx="80"
        cy="50"
        r="26"
        fill={helmet}
        stroke="#000"
        strokeWidth={3}
      />
      {/* Visier */}
      <Path d="M60 50 H100" stroke="#ccc" strokeWidth={4} />
      {/* Augen-Schlitze */}
      <Circle cx="72" cy="50" r="3" fill={eyeColor} />
      <Circle cx="88" cy="50" r="3" fill={eyeColor} />

      {/* Brustpanzer */}
      <Rect
        x="58"
        y="78"
        width="44"
        height="48"
        rx="6"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />
      <Path d="M58 92 H102" stroke="#555" strokeWidth={2} />

      {/* Schulterplatten */}
      <Path
        d="M58 78 Q40 88 58 100"
        fill={armor}
        stroke="#000"
        strokeWidth={2}
      />
      <Path
        d="M102 78 Q120 88 102 100"
        fill={armor}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Schwert */}
      <Path d="M120 70 L130 130" stroke="#999" strokeWidth={6} />
      <Path d="M118 65 L132 75" stroke="#000" strokeWidth={3} />
    </Svg>
  );
}
