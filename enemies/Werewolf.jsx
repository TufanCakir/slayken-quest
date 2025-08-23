// enemies/Werewolf.jsx
import React from "react";
import Svg, { G, Rect, Circle, Path, Ellipse } from "react-native-svg";

export default function Werewolf({
  size = 100,
  fur = "#6D4C41", // Fell
  armor = "#4E342E", // Brustschutz
  eyeColor = "#ffcc00", // gelbe Augen
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 150 150">
      {/* Schatten */}
      <Ellipse cx="75" cy="135" rx="30" ry="10" fill="#000" opacity={0.25} />

      {/* Kopf */}
      <Circle cx="75" cy="50" r="22" fill={fur} stroke="#000" strokeWidth={3} />

      {/* Ohren */}
      <Path
        d="M55 40 L50 20 L65 35 Z"
        fill={fur}
        stroke="#000"
        strokeWidth={2}
      />
      <Path
        d="M95 40 L100 20 L85 35 Z"
        fill={fur}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Augen */}
      <Circle cx="66" cy="50" r="3" fill={eyeColor} />
      <Circle cx="84" cy="50" r="3" fill={eyeColor} />

      {/* Schnauze */}
      <Ellipse cx="75" cy="60" rx="12" ry="8" fill="#333" stroke="#000" />
      <Circle cx="75" cy="62" r="3" fill="#000" />

      {/* Körper */}
      <Rect
        x="55"
        y="75"
        width="40"
        height="40"
        rx="8"
        fill={armor}
        stroke="#000"
        strokeWidth={3}
      />

      {/* Krallen */}
      <Path
        d="M50 90 L40 95"
        stroke="#000"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M100 90 L110 95"
        stroke="#000"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
