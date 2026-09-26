// src/components/ElectricFieldPlot.tsx

import { useId, useState } from "react";
import type { ChargeDistribution } from "../physics/sphere";
import { useElementWidth } from "../hooks/useElementWidth";

export type PlotMode =
  | "normalized"
  | "physical";

type ElectricFieldPlotProps = {
  distribution: ChargeDistribution;

  radius: number;
  observationRadius: number;

  surfaceField: number;
  electricField: number;

  fieldRatio: (t: number) => number;

  plotMode: PlotMode;

  onPlotModeChange: (
    mode: PlotMode,
  ) => void;
};

type Axes = {
  xMax: number;
  yMax: number;
};

const SAMPLES = 401;

function niceCeiling(
  value: number,
) {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return 1;
  }

  const step =
    10 **
      Math.floor(
        Math.log10(value),
      ) /
    2;

  return (
    Math.ceil(value / step) *
    step
  );
}

function tickLabel(
  value: number,
) {
  return Number(
    value.toFixed(2),
  ).toString();
}

export default function ElectricFieldPlot({
  distribution,
  radius,
  observationRadius,
  surfaceField,
  electricField,
  fieldRatio,
  plotMode,
  onPlotModeChange,
}: ElectricFieldPlotProps) {
  const { ref, width } =
    useElementWidth();

  const clipId = useId();

  const [
    lockedAxes,
    setLockedAxes,
  ] =
    useState<Axes | null>(
      null,
    );

  // Convert between normalized coordinates
  // (r/R, E/E₀) and physical coordinates
  // (cm, kN/C).

  const normalized =
    plotMode === "normalized";

  const observationX =
    normalized
      ? observationRadius /
        radius
      : observationRadius;

  const surfaceX =
    normalized
      ? 1
      : radius;

  const fieldAt = (
    position: number,
  ) => {
    const ratio =
      normalized
        ? position
        : position / radius;

    return (
      fieldRatio(ratio) *
      (
        normalized
          ? 1
          : surfaceField /
            1000
      )
    );
  };

  const markerValue =
    normalized
      ? fieldRatio(
          observationX,
        )
      : electricField /
        1000;

  const surfaceValue =
    normalized
      ? fieldRatio(1)
      : (
          surfaceField *
          fieldRatio(1)
        ) /
        1000;

  const autoXMax =
    normalized
      ? Math.max(
          3,
          Math.ceil(
            observationX *
              1.05,
          ),
        )
      : 10;

  // Sample the full curve so the automatic
  // Y axis can fit the current field.
  //
  // E₀ is only a reference scale.
  // Future nonuniform cases may exceed E/E₀ = 1.

  const sampledPeak =
    Math.max(
      surfaceValue,
      markerValue,

      ...Array.from(
        {
          length: SAMPLES,
        },

        (_, i) =>
          fieldAt(
            (
              i *
              autoXMax
            ) /
              (
                SAMPLES -
                1
              ),
          ),
      ),
    );

  const autoAxes = {
    xMax: autoXMax,

    yMax:
      niceCeiling(
        sampledPeak *
          1.1,
      ),
  };

  // Use automatic limits unless the user
  // explicitly locks the current axes.

  const axes =
    lockedAxes ??
    autoAxes;

  // Keep the SVG compact on narrow screens
  // while preserving readable text.

  const height =
    width < 350
      ? 210
      : 220;

  const left = 62;

  const right =
    width - 14;

  const top = 28;

  const bottom =
    height - 44;

  // Convert plot-space values into
  // SVG pixel coordinates.

  const toX = (
    position: number,
  ) =>
    left +
    (
      position /
      axes.xMax
    ) *
      (
        right -
        left
      );

  const toY = (
    value: number,
  ) =>
    bottom -
    (
      value /
      axes.yMax
    ) *
      (
        bottom -
        top
      );

  // Generate a sampled polyline
  // for a selected interval.

  const makePoints = (
    start: number,
    end: number,
  ) =>
    Array.from(
      {
        length: SAMPLES,
      },

      (_, i) => {
        const position =
          start +
          (
            i /
            (
              SAMPLES -
              1
            )
          ) *
            (
              end -
              start
            );

        return `${toX(
          position,
        )},${toY(
          fieldAt(
            position,
          ),
        )}`;
      },
    ).join(" ");

  // Split the curve at r = R so the surface
  // is sampled exactly.
  //
  // This preserves the sharp corner of the
  // solid-sphere field.

  const insidePoints =
    makePoints(
      0,

      Math.min(
        surfaceX,
        axes.xMax,
      ),
    );

  const outsidePoints =
    surfaceX <=
    axes.xMax
      ? makePoints(
          surfaceX,
          axes.xMax,
        )
      : "";

  const outOfRange =
    sampledPeak >
      axes.yMax ||
    observationX >
      axes.xMax ||
    surfaceX >
      axes.xMax;

  const xTickCount =
    width < 360
      ? 3
      : 4;

  return (
    <>
      {/* Unit / coordinate-system selector */}
      <div className="plot-controls">
        <label htmlFor="plot-mode">
          Units
        </label>

        <select
          id="plot-mode"
          value={plotMode}
          onChange={(event) => {
            // The old limits have different units,
            // so changing units releases them.

            setLockedAxes(
              null,
            );

            onPlotModeChange(
              event.target
                .value as PlotMode,
            );
          }}
        >
          <option value="physical">
            Physical · E vs. r
          </option>

          <option value="normalized">
            Normalized · E/E₀ vs. r/R
          </option>
        </select>
      </div>

      {/* Responsive SVG plot */}
      <div ref={ref}>
        <svg
          className="plot"
          style={{
            height,
          }}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={
            normalized
              ? "E over E0 versus r over R"
              : "Field magnitude in kN/C versus r in cm"
          }
        >
          <defs>
            <clipPath
              id={clipId}
            >
              <rect
                x={left}
                y={top}
                width={Math.max(
                  1,
                  right -
                    left,
                )}
                height={
                  bottom -
                  top
                }
              />
            </clipPath>
          </defs>

          {/* Horizontal grid lines and Y-axis tick labels */}
          {Array.from(
            {
              length: 5,
            },

            (_, i) => {
              const value =
                (
                  i *
                  axes.yMax
                ) /
                4;

              return (
                <g key={i}>
                  <line
                    x1={left}
                    y1={toY(
                      value,
                    )}
                    x2={right}
                    y2={toY(
                      value,
                    )}
                    stroke="var(--grid-line)"
                  />

                  <text
                    x={
                      left -
                      8
                    }
                    y={
                      toY(
                        value,
                      ) +
                      4
                    }
                    textAnchor="end"
                  >
                    {tickLabel(
                      value,
                    )}
                  </text>
                </g>
              );
            },
          )}

          {/* X-axis ticks adapt to the available screen width */}
          {Array.from(
            {
              length:
                xTickCount +
                1,
            },

            (_, i) => {
              const position =
                (
                  i *
                  axes.xMax
                ) /
                xTickCount;

              return (
                <g key={i}>
                  <line
                    x1={toX(
                      position,
                    )}
                    y1={bottom}
                    x2={toX(
                      position,
                    )}
                    y2={
                      bottom +
                      4
                    }
                    stroke="var(--surface-guide)"
                  />

                  <text
                    x={toX(
                      position,
                    )}
                    y={
                      bottom +
                      19
                    }
                    textAnchor={
                      i === 0
                        ? "start"
                        : i ===
                            xTickCount
                          ? "end"
                          : "middle"
                    }
                  >
                    {tickLabel(
                      position,
                    )}
                  </text>
                </g>
              );
            },
          )}

          {/* Y axis */}
          <line
            x1={left}
            y1={top}
            x2={left}
            y2={bottom}
            stroke="var(--axis-line)"
          />

          {/* X axis */}
          <line
            x1={left}
            y1={bottom}
            x2={right}
            y2={bottom}
            stroke="var(--axis-line)"
          />

          {/* Y axis title */}
          <text
            x={left}
            y="15"
          >
            {normalized
              ? "E / E₀"
              : "|E| (kN/C)"}
          </text>

          {/* X axis title */}
          <text
            x={right}
            y={
              height -
              3
            }
            textAnchor="end"
          >
            {normalized
              ? "r / R"
              : "r (cm)"}
          </text>

          {/* Clip curves and markers to the drawable plot area */}
          <g
            clipPath={`url(#${clipId})`}
          >
            {/* Sphere surface */}
            <line
              x1={toX(
                surfaceX,
              )}
              y1={top}
              x2={toX(
                surfaceX,
              )}
              y2={bottom}
              stroke="var(--surface-guide)"
              strokeDasharray="4 4"
            />

            {/* Inside field */}
            {distribution ===
            "solid" ? (
              <polyline
                points={
                  insidePoints
                }
                fill="none"
                stroke="var(--field-color)"
                strokeWidth="2.5"
              />
            ) : (
              <line
                x1={left}
                y1={bottom}
                x2={toX(
                  surfaceX,
                )}
                y2={bottom}
                stroke="var(--field-color)"
                strokeWidth="4"
              />
            )}

            {/* Outside field */}
            {outsidePoints && (
              <polyline
                points={
                  outsidePoints
                }
                fill="none"
                stroke="var(--field-color)"
                strokeWidth="2.5"
              />
            )}

            {/* Shell outside endpoint */}
            {distribution ===
              "shell" && (
              <circle
                cx={toX(
                  surfaceX,
                )}
                cy={toY(
                  surfaceValue,
                )}
                r="4"
                fill="var(--field-color)"
              />
            )}
          </g>

          {/* Sphere radius label */}
          {surfaceX <=
            axes.xMax && (
            <text
              x={Math.min(
                toX(
                  surfaceX,
                ) +
                  5,

                right -
                  14,
              )}
              y={
                top +
                14
              }
            >
              R
            </text>
          )}

          {/* Shell inside endpoint */}
          {distribution ===
            "shell" &&
            surfaceX <=
              axes.xMax && (
              <circle
                cx={toX(
                  surfaceX,
                )}
                cy={bottom}
                r="4"
                fill="var(--panel-bg)"
                stroke="var(--field-color)"
                strokeWidth="2"
              />
            )}

          {/* Observation / probe point */}
          {observationX <=
            axes.xMax &&
            markerValue <=
              axes.yMax && (
              <circle
                cx={toX(
                  observationX,
                )}
                cy={toY(
                  markerValue,
                )}
                r="5"
                fill="var(--probe-color)"
              />
            )}
        </svg>
      </div>

      {/* Locking the axes makes slider-driven changes easier to compare. */}
      <div className="axis-controls">
        <label className="axis-lock">
          <input
            type="checkbox"
            checked={
              lockedAxes !==
              null
            }
            onChange={(
              event,
            ) =>
              setLockedAxes(
                event.target
                  .checked
                  ? {
                      ...axes,
                    }
                  : null,
              )
            }
          />

          Lock axes
        </label>

        <span>
          {lockedAxes
            ? "Locked"
            : "Auto"}{" "}
          · Y: 0–
          {tickLabel(
            axes.yMax,
          )}{" "}
          {normalized
            ? "E/E₀"
            : "kN/C"}
        </span>
      </div>

      {lockedAxes &&
        outOfRange && (
          <p
            className="view-notice"
            role="status"
          >
            Part of the curve or probe is outside
            the axes. Unlock to fit.
          </p>
        )}
    </>
  );
}
