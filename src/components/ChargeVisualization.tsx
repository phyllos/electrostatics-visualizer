// src/components/ChargeVisualization.tsx

import { useId, useState } from "react";
import type { SphericalDistribution } from "../physics/sphere";
import { densityShape } from "../physics/radialDensity";
import { useElementWidth } from "../hooks/useElementWidth";
import { InlineMath } from "react-katex";
import DensityProfileMini from "./DensityProfileMini";
import type { RadialDensityModel } from "../physics/radialDensity";

type ChargeVisualizationProps = {
  distribution: SphericalDistribution;
  radius: number;
  observationRadius: number;
};

const DENSITY_STOP_COUNT = 21;

function densityFormula(
  model: RadialDensityModel,
): string {
  switch (model) {
    case "uniform":
      return String.raw`
        \rho/\rho_0 = 1
      `;

    case "linear-increasing":
      return String.raw`
        \rho/\rho_0 = x
      `;

    case "quadratic-decreasing":
      return String.raw`
        \rho/\rho_0 = 1-x^2
      `;
  }
}

export default function ChargeVisualization({
  distribution,
  radius,
  observationRadius,
}: ChargeVisualizationProps) {
  const { ref, width } = useElementWidth(300);
  const clipId = useId();
  const densityGradientId = useId();

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

  const sphereRadius = 
    radius * scale;
  const gaussianRadius =
    observationRadius * scale;

  // Warn when either surface extends beyond the current view.
  const outside =
    Math.max(
      radius, 
      observationRadius,
    ) >
    halfSpan;

  // ==========================================
  // Relative Radial Density Visualization
  // ==========================================

  // Sample rho(r) / rho0 from the center
  // (x = 0) to the sphere surface (x = 1).
  const densityStops =
    distribution.kind === "volume"
      ? Array.from(
          {
            length: DENSITY_STOP_COUNT,
          },

          (_, index) => {
            const x =
              index /
              (DENSITY_STOP_COUNT - 1);

            const density =
              densityShape(
                distribution.densityModel,
                x,
              );

            return {
              x,
              density:
                Math.max(
                  0,
                  density,
                ),
            };
          },
        )
      : [];

  // Normalize the visual intensity so the gradient
  // represents the shape of the selected density profile.
  const maxDensity =
    densityStops.length > 0
      ? Math.max(
          ...densityStops.map(
            (stop) =>
              stop.density,
          ),
        )
      : 1;


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

            {/* Radial charge-density gradient */}
            {distribution.kind === "volume" && (
              <radialGradient
                id={densityGradientId}
                cx="50%"
                cy="50%"
                r="50%"
              >
                {densityStops.map(
                  ({
                    x,
                    density,
                  }) => {
                    const relativeDensity =
                      maxDensity > 0
                        ? density /
                          maxDensity
                        : 0;

                    return (
                      <stop
                        key={x}
                        offset={`${x * 100}%`}
                        stopColor="var(--sphere-fill)"
                        stopOpacity={
                          0.62 *
                          relativeDensity
                        }
                      />
                    );
                  },
                )}
              </radialGradient>
            )}
          </defs>

          {/* Keep all geometry inside the visible SVG area */}
          <g clipPath={`url(#${clipId})`}>
            {distribution.kind === "volume" ? (
              <>
                {/* Very faint background shows the physical extent
                    of the sphere even where rho = 0. */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={sphereRadius}
                  fill="var(--sphere-fill)"
                  fillOpacity="0.12"
                />

                {/* Density profile */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={sphereRadius}
                  fill={`url(#${densityGradientId})`}
                  stroke="var(--sphere-line)"
                  strokeWidth="2"
                />
              </>
            ) : (
              /* Ideal spherical shell */
              <circle
                cx={cx}
                cy={cy}
                r={sphereRadius}
                fill="none"
                stroke="var(--sphere-line)"
                strokeWidth="4"
              />
            )}

            {/* Gaussian surface */}
            <circle
              cx={cx}
              cy={cy}
              r={gaussianRadius}
              fill="none"
              stroke="var(--gaussian-color)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Radius indicator from the center to the Gaussian surface */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + gaussianRadius}
              y2={cy}
              stroke="var(--gaussian-color)"
            />

            {/* Center and observation point */}
            <circle
              cx={cx}
              cy={cy}
              r="3"
              fill="var(--text-primary)"
            />

            <circle
              cx={cx + gaussianRadius}
              cy={cy}
              r="4"
              fill="var(--probe-color)"
            />

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
          A surface is outside the view. Select Fit view.
        </p>
      )}

      {distribution.kind === "volume" ? (
        <div className="density-summary">
          <div className="density-summary-text">
            <span className="density-summary-label">
              Relative density · x = r/R
            </span>

            <InlineMath
              math={densityFormula(
                distribution.densityModel,
              )}
            />
          </div>

          <DensityProfileMini
            model={distribution.densityModel}
            observationRatio={
              observationRadius / radius
            }
          />
        </div>
      ) : (
        <p className="caption">
          Charge is concentrated on the spherical surface
        </p>
      )}
    </section>
  );
}
