// src/components/ElectricFieldPlot.tsx

import type { ChargeDistribution } from "../physics/sphere";


// ==========================================
// Types
// ==========================================

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

  onPlotModeChange: (mode: PlotMode) => void;
};


// ==========================================
// SVG Plot Settings
// ==========================================

const PLOT_LEFT = 40;
const PLOT_RIGHT = 470;

const PLOT_BOTTOM = 220;
const PLOT_HEIGHT = 165;

const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT;

const NUM_POINTS = 401;


// ==========================================
// Electric Field Plot Component
// ==========================================

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


  // ========================================
  // Normalized Observation Radius
  // ========================================

  const x = observationRadius / radius;


  // ========================================
  // Plot Axis Ranges
  // ========================================

  const plotXMax =
    plotMode === "normalized"
      ? Math.max(2.4, x * 1.1)
      : 10;

  const plotYMax =
    plotMode === "normalized"
      ? 1
      : surfaceField;


  // ========================================
  // Coordinate Conversion
  // ========================================

  // Convert plot horizontal coordinate to r/R

  const getRatio = (position: number) => {

    if (plotMode === "normalized") {
      return position;
    }

    return position / radius;

  };


  // Convert physical/normalized x to SVG x

  const toSvgX = (position: number) =>
    PLOT_LEFT +
    (position / plotXMax) * PLOT_WIDTH;


  // Convert physical/normalized y to SVG y

  const toSvgY = (value: number) =>
    PLOT_BOTTOM -
    (value / plotYMax) * PLOT_HEIGHT;


  // ========================================
  // Electric Field Calculation for Plot
  // ========================================

  const getPlotField = (position: number) => {

    const ratio = getRatio(position);

    const normalizedField = fieldRatio(ratio);

    return plotMode === "normalized"
      ? normalizedField
      : surfaceField * normalizedField;

  };


  // ========================================
  // General Electric Field Curve
  // ========================================

  const plotPoints = Array.from(
    { length: NUM_POINTS },
    (_, i) => {

      const position =
        (i / (NUM_POINTS - 1)) * plotXMax;

      const fieldValue =
        getPlotField(position);

      const px = toSvgX(position);

      const py = toSvgY(fieldValue);

      return `${px},${py}`;

    }
  ).join(" ");


  // ========================================
  // Observation Point
  // ========================================

  const markerPosition =
    plotMode === "normalized"
      ? x
      : observationRadius;

  const markerValue =
    plotMode === "normalized"
      ? fieldRatio(x)
      : electricField;

  const markerX = toSvgX(markerPosition);

  const markerY = toSvgY(markerValue);


  // ========================================
  // Charged Sphere Boundary
  // ========================================

  const surfacePosition =
    plotMode === "normalized"
      ? 1
      : radius;

  const surfaceX =
    toSvgX(surfacePosition);


  // ========================================
  // Spherical Shell: Outside Field Curve
  // ========================================

  const shellOutsidePoints = Array.from(
    { length: NUM_POINTS },
    (_, i) => {

      const position =
        surfacePosition +
        (i / (NUM_POINTS - 1)) *
          (plotXMax - surfacePosition);

      const fieldValue =
        getPlotField(position);

      const px = toSvgX(position);

      const py = toSvgY(fieldValue);

      return `${px},${py}`;

    }
  ).join(" ");


  // ========================================
  // Render
  // ========================================

  return (

    <>

      {/* Graph Mode Selection */}

      <div className="plot-controls">

        <label htmlFor="plot-mode">
          Graph Mode
        </label>

        <select
          id="plot-mode"

          value={plotMode}

          onChange={(e) =>
            onPlotModeChange(
              e.target.value as PlotMode
            )
          }
        >

          <option value="normalized">
            Normalized (E/E₀ vs. r/R)
          </option>

          <option value="physical">
            Physical (E vs. r)
          </option>

        </select>

      </div>


      {/* Electric Field Graph */}

      <svg
        viewBox="0 0 500 270"
        className="plot"
        role="img"
        aria-label="Electric field versus radius"
      >

        {/* X Axis */}

        <line
          x1={PLOT_LEFT}
          y1={PLOT_BOTTOM}
          x2="480"
          y2={PLOT_BOTTOM}
          stroke="black"
        />


        {/* Y Axis */}

        <line
          x1={PLOT_LEFT}
          y1={PLOT_BOTTOM}
          x2={PLOT_LEFT}
          y2="30"
          stroke="black"
        />


        {/* Sphere Boundary */}

        <line
          x1={surfaceX}
          y1="30"
          x2={surfaceX}
          y2={PLOT_BOTTOM}
          stroke="#aaa"
          strokeDasharray="5 5"
        />


        {/* Electric Field Curves */}

        {distribution === "solid" ? (

          // Uniformly Charged Solid Sphere

          <polyline
            points={plotPoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
          />

        ) : (

          // Uniformly Charged Spherical Shell

          <>

            {/* Inside: E = 0 */}

            <line
              x1={PLOT_LEFT}
              y1={PLOT_BOTTOM}
              x2={surfaceX}
              y2={PLOT_BOTTOM}
              stroke="#2563eb"
              strokeWidth="3"
            />


            {/* Outside: E = kQ/r² */}

            <polyline
              points={shellOutsidePoints}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />


            {/* Inner Limit: E(R-) = 0 */}

            <circle
              cx={surfaceX}
              cy={PLOT_BOTTOM}
              r="5"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
            />


            {/* Outer Limit: E(R+) = E0 */}

            <circle
              cx={surfaceX}
              cy={toSvgY(plotYMax)}
              r="5"
              fill="#2563eb"
              stroke="#2563eb"
              strokeWidth="2"
            />

          </>

        )}


        {/* Observation Point */}

        <circle
          cx={markerX}
          cy={markerY}
          r="6"
          fill="#e11d48"
        />


        {/* Y Axis Label */}

        <text x="8" y="25">

          {plotMode === "normalized"
            ? "E / E₀"
            : "E (N/C)"}

        </text>


        {/* X Axis Label */}

        <text x="435" y="250">

          {plotMode === "normalized"
            ? "r / R"
            : "r (cm)"}

        </text>


        {/* Sphere Boundary Label */}

        <text
          x={surfaceX}
          y="245"
          textAnchor="middle"
        >
          R
        </text>


        {/* Y Axis Scale */}

        <text
          x="34"
          y="59"
          textAnchor="end"
          fontSize="12"
        >

          {plotMode === "normalized"
            ? "1"
            : surfaceField.toExponential(2)}

        </text>

      </svg>

    </>

  );

}
