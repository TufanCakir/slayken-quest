// enemies/Vampire.jsx
import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function Vampire({
  size = 100,
  skin = "#D7CCC8", // blasse Haut
  cloak = "#212121", // Umhang
  armor = "#424242", // Brust
  eyeColor = "#ff0000", // rote Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="128" rx="28" ry="9" fill="#000" opacity={0.25} />

      {/* Umhang */}
      <Path
        d="M40 72 Q70 140 100 72 Z"
        fill={cloak}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Kopf */}
      <Circle
        cx="70"
        cy="46"
        r="20"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Augen */}
      <Circle cx="62" cy="46" r="3" fill={eyeColor} />
      <Circle cx="78" cy="46" r="3" fill={eyeColor} />

      {/* Mund mit Fangzähnen */}
      <Path d="M60 56 Q70 64 80 56" stroke="#900" strokeWidth={2} fill="none" />
      <Rect x="65" y="56" width="2" height="6" fill="#fff" />
      <Rect x="73" y="56" width="2" height="6" fill="#fff" />

      {/* Körper */}
      <Rect
        x="54"
        y="72"
        width="32"
        height="34"
        rx="6"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />
    </Svg>
  );
}
