// enemies/FrostWolf.jsx
import React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function FrostWolf({
  size = 120,
  fur = "#B3E5FC", // hellblaues Fell
  shade = "#01579B", // Schatten / Rückenfell
  eyeColor = "#ffffff", // kalte Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      {/* Schatten */}
      <Ellipse cx="80" cy="145" rx="34" ry="12" fill="#000" opacity={0.3} />

      {/* Körper */}
      <Path
        d="M40 120 Q30 90 60 70 Q100 60 120 80 Q130 110 110 130 Z"
        fill={fur}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Rückenfell */}
      <Path
        d="M50 100 Q80 60 120 90"
        stroke={shade}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.8}
      />

      {/* Kopf */}
      <Circle cx="60" cy="70" r="20" fill={fur} stroke="#000" strokeWidth={3} />
      {/* Augen */}
      <Circle cx="52" cy="68" r="4" fill={eyeColor} />
      <Circle cx="68" cy="68" r="4" fill={eyeColor} />
      {/* Schnauze */}
      <Ellipse cx="60" cy="78" rx="10" ry="6" fill="#333" stroke="#000" />
      <Circle cx="60" cy="80" r="3" fill="#000" />
    </Svg>
  );
}
