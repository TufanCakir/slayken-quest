// enemies/Skeleton.jsx
import React from "react";
import Svg, { Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function Skeleton({
  size = 100,
  skin = "#E0E0E0", // Knochenfarbe
  armor = "#424242", // Brust/Rüstung
  helmet = "#9E9E9E", // Helm/Totenschädel-Schimmer
  eyeColor = "#000", // leere Augenhöhlen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten */}
      <Ellipse cx="70" cy="128" rx="28" ry="9" fill="#000" opacity={0.25} />

      {/* Schädel */}
      <Circle
        cx="70"
        cy="46"
        r="22"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />
      {/* Augenhöhlen */}
      <Circle cx="62" cy="46" r="5" fill={eyeColor} />
      <Circle cx="78" cy="46" r="5" fill={eyeColor} />
      {/* Zähne */}
      <Path d="M60 58 H80" stroke="#000" strokeWidth={3} />

      {/* Brustkorb */}
      <Rect
        x="52"
        y="74"
        width="36"
        height="34"
        rx="6"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />
      <Path
        d="M60 80 H80 M60 88 H80 M60 96 H80"
        stroke={skin}
        strokeWidth={2}
      />
    </Svg>
  );
}
