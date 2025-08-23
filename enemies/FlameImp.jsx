// enemies/FlameImp.jsx
import React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function FlameImp({
  size = 100,
  skin = "#FF7043", // Feuerhaut
  hornColor = "#BF360C",
  eyeColor = "#fff200", // gelbe Augen
  flame = "#E64A19",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="128" rx="24" ry="9" fill="#000" opacity={0.25} />

      {/* Kopf */}
      <Circle
        cx="70"
        cy="60"
        r="22"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Hörner */}
      <Path
        d="M60 40 Q55 25 65 32"
        fill={hornColor}
        stroke="#000"
        strokeWidth={2}
      />
      <Path
        d="M80 40 Q85 25 75 32"
        fill={hornColor}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Augen */}
      <Circle cx="62" cy="60" r="4" fill={eyeColor} />
      <Circle cx="78" cy="60" r="4" fill={eyeColor} />

      {/* Flammen-Haube */}
      <Path
        d="M55 40 Q70 10 85 40"
        fill={flame}
        opacity={0.8}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Mund */}
      <Path d="M60 72 Q70 78 80 72" stroke="#900" strokeWidth={2} fill="none" />
    </Svg>
  );
}
