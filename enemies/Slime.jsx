// enemies/Slime.jsx
import React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function Slime({
  size = 100,
  skin = "#AEEA00", // Hauptfarbe
  shade = "#689F38", // Schatten/Unterseite
  eyeColor = "#222", // Augen
  mouthColor = "#900", // Mund
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* Schatten am Boden */}
      <Ellipse cx="70" cy="126" rx="28" ry="10" fill="#000" opacity={0.2} />

      {/* Körper (Haupt-Blase) */}
      <Circle
        cx="70"
        cy="70"
        r="40"
        fill={skin}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Unterseite/Schatten */}
      <Ellipse cx="70" cy="90" rx="35" ry="15" fill={shade} opacity={0.5} />

      {/* Augen */}
      <Circle cx="58" cy="66" r="6" fill={eyeColor} />
      <Circle cx="82" cy="66" r="6" fill={eyeColor} />

      {/* Mund */}
      <Path
        d="M55 78 Q70 90 85 78"
        stroke={mouthColor}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
