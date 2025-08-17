import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Polygon,
  Line,
} from "react-native-svg";
import backgrounds from "../data/battleBackgrounds.json";

export default function BattleBackground({ width, height, backgroundId }) {
  const bg = backgrounds.find((b) => b.id === backgroundId) || backgrounds[0];

  const horizonY = height * 0.6;
  const gridStep = 40;
  const gridLines = [];

  for (let y = horizonY; y <= height; y += gridStep) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={bg.gridColor}
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  for (let x = 0; x <= width; x += gridStep) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        x1={x}
        y1={horizonY}
        x2={x}
        y2={height}
        stroke={bg.gridColor}
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
    >
      <Defs>
        <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={bg.skyGradient.start} />
          <Stop offset="100%" stopColor={bg.skyGradient.end} />
        </LinearGradient>

        <LinearGradient id="groundGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={bg.groundGradient.start} />
          <Stop offset="100%" stopColor={bg.groundGradient.end} />
        </LinearGradient>
      </Defs>

      <Rect width={width} height={height} fill="url(#skyGradient)" />

      <Polygon
        points={`0,${horizonY} ${width},${horizonY} ${width * 1.2},${height} -${
          width * 0.2
        },${height}`}
        fill="url(#groundGradient)"
      />

      {gridLines}
    </Svg>
  );
}
