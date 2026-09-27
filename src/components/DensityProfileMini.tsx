// src/components/DensityProfileMini.tsx

import {
  densityShape,
  type RadialDensityModel,
} from "../physics/radialDensity";

type DensityProfileMiniProps = {
  model: RadialDensityModel;
  observationRatio: number;
};

const WIDTH = 96;
const HEIGHT = 34;
const PADDING_X = 4;
const PADDING_Y = 4;
const SAMPLES = 41;

export default function DensityProfileMini({
  model,
  observationRatio,
}: DensityProfileMiniProps) {
  const toX = (x: number) =>
    PADDING_X +
    x * (WIDTH - 2 * PADDING_X);

  const toY = (density: number) =>
    HEIGHT -
    PADDING_Y -
    density * (HEIGHT - 2 * PADDING_Y);

  const points = Array.from(
    { length: SAMPLES },
    (_, index) => {
      const x =
        index / (SAMPLES - 1);

      const density =
        densityShape(model, x);

      return `${toX(x)},${toY(density)}`;
    },
  ).join(" ");

  const probeVisible =
    observationRatio >= 0 &&
    observationRatio <= 1;

  const probeDensity =
    probeVisible
      ? densityShape(
          model,
          observationRatio,
        )
      : 0;

  return (
    <svg
      className="density-profile-mini"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Relative radial charge density profile"
    >
      {/* Minimal axes */}
      <line
        x1={PADDING_X}
        y1={HEIGHT - PADDING_Y}
        x2={WIDTH - PADDING_X}
        y2={HEIGHT - PADDING_Y}
        stroke="var(--grid-line)"
      />

      <line
        x1={PADDING_X}
        y1={PADDING_Y}
        x2={PADDING_X}
        y2={HEIGHT - PADDING_Y}
        stroke="var(--grid-line)"
      />

      {/* Density profile */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--sphere-line)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current Gaussian radius */}
      {probeVisible && (
        <circle
          cx={toX(observationRatio)}
          cy={toY(probeDensity)}
          r="3"
          fill="var(--probe-color)"
        />
      )}
    </svg>
  );
}
