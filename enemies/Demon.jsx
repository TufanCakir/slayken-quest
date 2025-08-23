// enemies/Demon.jsx
import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function Demon({
  size = 120,
  skin = "#FF5252", // rote Haut
  armor = "#B71C1C", // Brust/Rüstung
  hornColor = "#880E4F", // Hörner
  wingColor = "#660000", // Flügel
  eyeColor = "#ffff00", // gelbe Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      {/* Schatten */}
      <Ellipse cx="80" cy="145" rx="34" ry="12" fill="#000" opacity={0.3} />

      {/* Flügel */}
      <Path
        d="M20 70 Q40 30 60 60 L40 100 Z"
        fill={wingColor}
        stroke="#000"
        strokeWidth={3}
      />
      <Path
        d="M140 70 Q120 30 100 60 L120 100 Z"
        fill={wingColor}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Kopf */}
      <Circle
        cx="80"
        cy="50"
        r="24"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Hörner */}
      <Path
        d="M65 28 Q60 10 75 20"
        fill={hornColor}
        stroke="#000"
        strokeWidth={2}
      />
      <Path
        d="M95 28 Q100 10 85 20"
        fill={hornColor}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Augen */}
      <Circle cx="70" cy="50" r="4" fill={eyeColor} />
      <Circle cx="90" cy="50" r="4" fill={eyeColor} />

      {/* Mund mit Zähnen */}
      <Path d="M68 64 Q80 72 92 64" stroke="#000" strokeWidth={2} fill="none" />
      <Rect x="74" y="64" width="2" height="6" fill="#fff" />
      <Rect x="84" y="64" width="2" height="6" fill="#fff" />

      {/* Körper */}
      <Rect
        x="58"
        y="80"
        width="44"
        height="46"
        rx="8"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Arme */}
      <Path
        d="M58 90 L40 110"
        stroke={skin}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <Path
        d="M102 90 L120 110"
        stroke={skin}
        strokeWidth={10}
        strokeLinecap="round"
      />

      {/* Beine */}
      <Rect
        x="64"
        y="126"
        width="10"
        height="18"
        rx="3"
        fill={skin}
        stroke="#000"
      />
      <Rect
        x="86"
        y="126"
        width="10"
        height="18"
        rx="3"
        fill={skin}
        stroke="#000"
      />
    </Svg>
  );
}
