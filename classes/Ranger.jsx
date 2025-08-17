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

// 🔧 Gradient-Helfer
function makeGradient(id, colors, { x2 = "0", y2 = "1" } = {}) {
  const stops = Array.isArray(colors) ? colors : [colors];
  const count = Math.max(stops.length - 1, 1);
  return (
    <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2} spreadMethod="pad">
      {stops.map((c, i) => (
        <Stop
          key={`${id}-${i}`}
          offset={`${(i / count) * 100}%`}
          stopColor={c}
        />
      ))}
    </LinearGradient>
  );
}

// 🏹 Bogen
function RangerBow({ bowId, stringId }) {
  return (
    <G transform="translate(96,88)">
      <Path
        d="M0 -20 Q20 0 0 20"
        stroke={`url(#${bowId})`}
        strokeWidth={4}
        fill="none"
      />
      <Line
        x1={0}
        y1={-20}
        x2={0}
        y2={20}
        stroke={`url(#${stringId})`}
        strokeWidth={1.5}
      />
    </G>
  );
}

// 🎒 Köcher + Pfeil
function RangerQuiver({ quiverId, arrowShaftId, arrowHeadId, outline }) {
  return (
    <G transform="translate(40,70)">
      <Rect
        x={-4}
        y={0}
        width={8}
        height={20}
        fill={`url(#${quiverId})`}
        stroke={outline}
        strokeWidth={2}
      />
      {/* Pfeil */}
      <Line
        x1={0}
        y1={0}
        x2={0}
        y2={-10}
        stroke={`url(#${arrowShaftId})`}
        strokeWidth={2}
      />
      <Path d="M-4 -10 L0 -18 L4 -10 Z" fill={`url(#${arrowHeadId})`} />
    </G>
  );
}

export default function Ranger({
  // === Farben ===
  skin = "#FFCCBC",
  outlineColor = "#202020",

  armorColors = ["#795548", "#5D4037"],
  strapColors = ["#4E342E", "#3E2723"],

  bowColors = ["#3E2723", "#1B0000"],
  stringColors = "#FFF",

  quiverColors = ["#3E2723", "#1B1B1B"],
  arrowShaftColors = "#FFF",
  arrowHeadColors = ["#FFF", "#CCC"],

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

      {/* Rüstung */}
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

      {/* Arme */}
      <Rect
        x={42}
        y={74}
        width={8}
        height={18}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />
      <Rect
        x={90}
        y={74}
        width={8}
        height={18}
        rx={3}
        fill={skin}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* Bogen */}
      <RangerBow bowId="ranger-bow" stringId="ranger-string" />

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
