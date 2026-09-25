import { useState } from "react";

import {
  fieldRatio as calculateFieldRatio,
  enclosedChargeRatio as calculateEnclosedChargeRatio,
  surfaceFieldMagnitude,
  type ChargeDistribution,
} from "./physics/sphere";

import ControlPanel from "./components/ControlPanel";

import ChargeVisualization from "./components/ChargeVisualization";

import PhysicsNotes from "./components/PhysicsNotes";

import "./App.css";

const Q = 5e-9; // Coulombs

function App() {
  const [distribution, setDistribution] =
    useState<ChargeDistribution>("solid");

  // Sphere radius in cm
  const [radius, setRadius] = useState(2);

  // Gaussian surface radius in cm
  const [observationRadius, setObservationRadius] =
    useState(1.2);

  // Graph display mode
  const [plotMode, setPlotMode] =
    useState<"normalized" | "physical">("normalized");

  // Dimensionless observation radius
  const x = observationRadius / radius;

  // x = r / R
  const fieldRatio = (t: number) =>
    calculateFieldRatio(distribution, t);

  const enclosedChargeRatio = (t: number) =>
    calculateEnclosedChargeRatio(distribution, t);

  // Convert cm to meters
  const R = radius / 100;

  // Electric field at the surface
  const E0 = surfaceFieldMagnitude(Q, R);

  const electricField = E0 * fieldRatio(x);

  const enclosedCharge = Q * enclosedChargeRatio(x);

  // ==========================================
  // Electric Field Plot
  // ==========================================

  // Maximum horizontal axis value

  const plotXMax =
    plotMode === "normalized"
      ? Math.max(2.4, x * 1.1)
      : 10;

  // Maximum vertical axis value

  const plotYMax =
    plotMode === "normalized"
      ? 1
      : E0;


  // Convert horizontal coordinate to r/R

  const getRatio = (position: number) => {

    if (plotMode === "normalized") {
      return position;
    }

    return position / radius;

  };


  // Generate graph points

  const plotPoints = Array.from(
    { length: 401 },
    (_, i) => {

      const position =
        (i / 400) * plotXMax;

      const ratio = getRatio(position);

      const fieldValue =
        plotMode === "normalized"
          ? fieldRatio(ratio)
          : E0 * fieldRatio(ratio);

      const px =
        40 + (position / plotXMax) * 430;

      const py =
        220 - (fieldValue / plotYMax) * 165;

      return `${px},${py}`;

    }
  ).join(" ");


  // Observation point

  const markerPosition =
    plotMode === "normalized"
      ? x
      : observationRadius;

  const markerValue =
    plotMode === "normalized"
      ? fieldRatio(x)
      : electricField;

  const markerX =
    40 + (markerPosition / plotXMax) * 430;

  const markerY =
    220 - (markerValue / plotYMax) * 165;


  // Charged sphere boundary

  const surfacePosition =
    plotMode === "normalized"
      ? 1
      : radius;

  const surfaceX =
    40 + (surfacePosition / plotXMax) * 430;

  // ==========================================
  // Spherical shell: outside field curve
  // ==========================================

  const shellOutsidePoints = Array.from(
    { length: 401 },
    (_, i) => {

      const position =
        surfacePosition +
        (i / 400) * (plotXMax - surfacePosition);

      const ratio = getRatio(position);

      const fieldValue =
        plotMode === "normalized"
          ? fieldRatio(ratio)
          : E0 * fieldRatio(ratio);

      const px =
        40 + (position / plotXMax) * 430;

      const py =
        220 - (fieldValue / plotYMax) * 165;

      return `${px},${py}`;

    }
  ).join(" ");

// Visualization, Physics notes and ControlPanel in components/.


  return (
    <main className="app">

      <header>
        <h1>Electrostatics Visualizer</h1>

        <p>
          Explore electric fields and charge distributions
          interactively.
        </p>
      </header>

      <section className="layout">

        <ControlPanel

          distribution={distribution}

          onDistributionChange={setDistribution}

          radius={radius}

          onRadiusChange={setRadius}

          observationRadius={observationRadius}

          onObservationRadiusChange={setObservationRadius}

          fieldRatio={x}

          electricField={electricField}

          enclosedCharge={enclosedCharge}

        />


        <ChargeVisualization

          distribution={distribution}

          radius={radius}

          observationRadius={observationRadius}

        />

      </section>

      <section className="panel">

        <h2>Electric Field vs. Radius</h2>

        <div className="plot-controls">

          <label htmlFor="plot-mode">
            Graph Mode
          </label>

          <select
            id="plot-mode"
            value={plotMode}
            onChange={(e) =>
              setPlotMode(
                e.target.value as "normalized" | "physical"
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

        <svg
          viewBox="0 0 500 270"
          className="plot"
        >

          <line
            x1="40"
            y1="220"
            x2="480"
            y2="220"
            stroke="black"
          />

          <line
            x1="40"
            y1="220"
            x2="40"
            y2="30"
            stroke="black"
          />

          <line
            x1={surfaceX}
            y1="30"
            x2={surfaceX}
            y2="220"
            stroke="#aaa"
            strokeDasharray="5 5"
          />

          {distribution === "solid" ? (

            // Uniform Solid Sphere

            <polyline
              points={plotPoints}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />

          ) : (

            // Uniform Spherical Shell

            <>

              {/* Inside: E = 0 */}

              <line
                x1="40"
                y1="220"
                x2={surfaceX}
                y2="220"
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

              {/* Inner limit: E(R-) = 0 */}

              <circle
                cx={surfaceX}
                cy="220"
                r="5"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2"
              />

              {/* Outer limit: E(R+) = E0 */}

              <circle
                cx={surfaceX}
                cy="55"
                r="5"
                fill="#2563eb"
                stroke="#2563eb"
                strokeWidth="2"
              />

            </>

          )}

          <circle
            cx={markerX}
            cy={markerY}
            r="6"
            fill="#e11d48"
          />

          <text x="8" y="25">

            {plotMode === "normalized"
              ? "E / E₀"
              : "E (N/C)"}

          </text>

          <text x="435" y="250">

            {plotMode === "normalized"
              ? "r / R"
              : "r (cm)"}

          </text>

          <text
            x={surfaceX}
            y="245"
            textAnchor="middle"
          >
            R
          </text>

          <text
            x="34"
            y="59"
            textAnchor="end"
            fontSize="12"
          >
            {plotMode === "normalized"
              ? "1"
              : E0.toExponential(2)}
          </text>

        </svg>

        <PhysicsNotes

          radius={radius}

          surfaceField={E0}

          plotMode={plotMode}

        />

      </section>

    </main>
  );
}

export default App;

