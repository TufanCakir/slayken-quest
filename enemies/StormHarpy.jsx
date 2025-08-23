// enemies/StormHarpy.jsx
import React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function StormHarpy({
  size = 120,
  skin = "#AED581", // grünliche Haut
  wing = "#689F38", // Flügel
  eyeColor = "#222", // Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      {/* Schatten */}
      <Ellipse cx="80" cy="145" rx="34" ry="12" fill="#000" opacity={0.25} />

      {/* Flügel links */}
      <Path
        d="M40 90 Q10 50 50 60 Q60 70 40 90 Z"
        fill={wing}
        stroke="#000"
        strokeWidth={2}
      />
      {/* Flügel rechts */}
      <Path
        d="M120 90 Q150 50 110 60 Q100 70 120 90 Z"
        fill={wing}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Körper */}
      <Path
        d="M60 120 Q80 70 100 120 Z"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Kopf */}
      <Circle
        cx="80"
        cy="60"
        r="20"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />
      {/* Augen */}
      <Circle cx="72" cy="60" r="4" fill={eyeColor} />
      <Circle cx="88" cy="60" r="4" fill={eyeColor} />
      {/* Schnabel */}
      <Path d="M75 70 Q80 78 85 70" stroke="#000" strokeWidth={3} />
    </Svg>
  );
}
