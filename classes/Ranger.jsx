// src/components/classes/Ranger.jsx
import React from "react";
import {
  G,
  Rect,
  Circle,
  Path,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import defaultColors from "../data/rangerColors"; // 🎨 externe Farb-Defaults

// 🔧 Gradient-Helfer
function makeGradient(id, colors, { x2 = "0", y2 = "1", opacity = 1 } = {}) {
  const stops = Array.isArray(colors) ? colors : [colors];
  const count = Math.max(stops.length - 1, 1);
  return (
    <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2} spreadMethod="pad">
      {stops.map((c, i) => (
        <Stop
          key={`${id}-${i}`}
          offset={`${(i / count) * 100}%`}
          stopColor={c}
          stopOpacity={opacity}
        />
      ))}
    </LinearGradient>
  );
}

// 🏹 Bogen
function RangerBow({ bowId, stringId, outline }) {
  return (
    <G transform="translate(96,88)">
      {/* Bogenkörper */}
      <Path
        d="M0 -22 Q20 0 0 22"
        stroke={`url(#${bowId})`}
        strokeWidth={4}
        fill="none"
      />
      {/* Outline für Kontrast */}
      <Path
        d="M0 -22 Q20 0 0 22"
        stroke={outline}
        strokeWidth={1}
        fill="none"
      />
      {/* Bogensehne */}
      <Line
        x1={0}
        y1={-22}
        x2={0}
        y2={22}
        stroke={`url(#${stringId})`}
        strokeWidth={1.5}
      />
    </G>
  );
}

// 🎒 Köcher + Pfeil
function RangerQuiver({ quiverId, arrowShaftId, arrowHeadId, outline }) {
  return (
    <G transform="translate(42,70)">
      {/* Köcher */}
      <Rect
        x={-4}
        y={0}
        width={8}
        height={22}
        rx={2}
        fill={`url(#${quiverId})`}
        stroke={outline}
        strokeWidth={1.5}
      />
      {/* Pfeilschaft */}
      <Line
        x1={0}
        y1={0}
        x2={0}
        y2={-12}
        stroke={`url(#${arrowShaftId})`}
        strokeWidth={2}
      />
      {/* Pfeilspitze */}
      <Path
        d="M-4 -12 L0 -20 L4 -12 Z"
        fill={`url(#${arrowHeadId})`}
        stroke={outline}
        strokeWidth={0.8}
      />
    </G>
  );
}

export default function Ranger({
  // === Farben ===
  skin = defaultColors.skin,
  outlineColor = defaultColors.outline,

  armorColors = defaultColors.armor,
  strapColors = defaultColors.strap,

  bowColors = defaultColors.bow,
  stringColors = defaultColors.string,

  quiverColors = defaultColors.quiver,
  arrowShaftColors = defaultColors.arrowShaft,
  arrowHeadColors = defaultColors.arrowHead,

  strokeWidth = 2,
}) {
  return (
    <G id="ranger">
      <Defs>
        {makeGradient("ranger-armor", armorColors)}
        {makeGradient("ranger-strap", strapColors, { x2: "1" })}
        {makeGradient("ranger-bow", bowColors)}
        {makeGradient("ranger-string", stringColors)}
        {makeGradient("ranger-quiver", quiverColors)}
        {makeGradient("ranger-arrow-shaft", arrowShaftColors)}
        {makeGradient("ranger-arrow-head", arrowHeadColors)}
      </Defs>

      {/* Brustpanzer */}
      <Rect
        x={50}
        y={72}
        width={40}
        height={32}
        rx={6}
        fill="url(#ranger-armor)"
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Kopf */}
      <Circle
        cx={70}
        cy={56}
        r={18}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth + 1}
      />

      {/* Schulterriemen */}
      <Path
        d="M50 72 Q60 60 70 72 Q80 60 90 72"
        fill="none"
        stroke="url(#ranger-strap)"
        strokeWidth={strokeWidth + 1}
        strokeLinecap="round"
      />
      <Path
        d="M50 72 Q60 60 70 72 Q80 60 90 72"
        fill="none"
        stroke={outlineColor}
        strokeWidth={1}
        opacity={0.4}
      />

      {/* Arme */}
      {[
        { x: 42, y: 74 },
        { x: 90, y: 74 },
      ].map((pos, i) => (
        <Rect
          key={`arm-${i}`}
          x={pos.x}
          y={pos.y}
          width={8}
          height={18}
          rx={3}
          fill={skin}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* Bogen */}
      <RangerBow
        bowId="ranger-bow"
        stringId="ranger-string"
        outline={outlineColor}
      />

      {/* Köcher + Pfeil */}
      <RangerQuiver
        quiverId="ranger-quiver"
        arrowShaftId="ranger-arrow-shaft"
        arrowHeadId="ranger-arrow-head"
        outline={outlineColor}
      />
    </G>
  );
}
