// src/components/ChargeVisualization.tsx

import { useId, useState } from "react";
import type { ChargeDistribution } from "../physics/sphere";
import { useElementWidth } from "../hooks/useElementWidth";

type ChargeVisualizationProps = {
  distribution: ChargeDistribution;
  radius: number;
  observationRadius: number;
};

export default function ChargeVisualization({
  distribution,
  radius,
  observationRadius,
}: ChargeVisualizationProps) {
  const { ref, width } = useElementWidth(300);
  const clipId = useId();

  // Keep the displayed scale fixed while dragging.
  // This makes changes in the physical radius visually meaningful.
  const [halfSpan, setHalfSpan] = useState(3); // cm

  // Use a slightly shorter diagram on very narrow screens.
  const height = width < 260 ? 180 : 230;
  const cx = width / 2;
  const cy = height / 2;

  // Convert physical distances in cm to SVG screen coordinates.
  const scale =
    Math.max(
      1,
      Math.min(width - 32, height - 32),
    ) /
    (2 * halfSpan);

  const sphereRadius = radius * scale;
  const gaussianRadius =
    observationRadius * scale;

  // Warn when either surface extends beyond the current view.
  const outside =
    Math.max(radius, observationRadius) >
    halfSpan;

  return (
    <section className="panel charge-panel">
      <h2>Charge Distribution</h2>

      {/* Responsive 2D cross-section of the charged sphere */}
      <div ref={ref}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="diagram"
          style={{ height }}
          role="img"
          aria-label={`Sphere R ${radius} cm, Gaussian surface r ${observationRadius} cm`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                width={width}
                height={height}
              />
            </clipPath>
          </defs>

          {/* Keep all geometry inside the visible SVG area */}
          <g clipPath={`url(#${clipId})`}>
            {/* Charged sphere or spherical shell */}
            <circle
              cx={cx}
              cy={cy}
              r={sphereRadius}
              fill={
                distribution === "solid"
                  ? "#fda4af"
                  : "none"
              }
              fillOpacity="0.55"
              stroke="#e11d48"
              strokeWidth={
                distribution === "solid"
                  ? 2
                  : 4
              }
            />

            {/* Gaussian surface */}
            <circle
              cx={cx}
              cy={cy}
              r={gaussianRadius}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Radius indicator from the center to the Gaussian surface */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + gaussianRadius}
              y2={cy}
              stroke="#2563eb"
            />

            {/* Center and observation point */}
            <circle
              cx={cx}
              cy={cy}
              r="3"
              fill="#0f172a"
            />

            <circle
              cx={cx + gaussianRadius}
              cy={cy}
              r="4"
              fill="#7c3aed"
            />

            {/* Radius labels */}
            <text
              x={cx + sphereRadius / 2}
              y={cy - 9}
              fontSize="12"
              fill="#9f1239"
            >
              R
            </text>

            <text
              x={cx + gaussianRadius / 2}
              y={cy + 19}
              fontSize="12"
              fill="#1d4ed8"
            >
              r
            </text>
          </g>
        </svg>
      </div>

      {/* Compact diagram legend */}
      <div className="caption diagram-legend">
        <span>
          <i className="legend-line" />
          Sphere R
        </span>

        <span>
          <i className="legend-line legend-gaussian" />
          Gaussian r
        </span>
      </div>

      {/* View controls do not change the physical parameters */}
      <div className="view-controls">
        <span>
          View ±{halfSpan.toFixed(1)} cm
        </span>

        <button
          className="subtle-button"
          type="button"
          onClick={() =>
            setHalfSpan(
              Math.max(
                radius,
                observationRadius,
              ) * 1.25,
            )
          }
        >
          Fit view
        </button>
      </div>

      {outside && (
        <p
          className="view-notice"
          role="status"
        >
          A surface is outside the view. Select
          Fit view.
        </p>
      )}

      <p className="caption">
        2D cross-section of 3D spheres
      </p>
    </section>
  );
}
