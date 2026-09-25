import { useState } from "react";

import { InlineMath, BlockMath } from "react-katex";

import {
  fieldRatio as calculateFieldRatio,
  enclosedChargeRatio as calculateEnclosedChargeRatio,
  surfaceFieldMagnitude,
  type ChargeDistribution,
} from "./physics/sphere";

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

// Visualization scale
// 17.5 SVG units = 1 cm

    const visualizationScale = 17.5;

    const sphereVisualRadius =
      radius * visualizationScale;

    const gaussianVisualRadius =
      radius * x * visualizationScale;


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

        <div className="panel">

          <h2>Parameters</h2>

          <label>Charge Distribution</label>

          <select
            value={distribution}
            onChange={(e) =>
              setDistribution(
                e.target.value as ChargeDistribution
              )
            }
          >
            <option value="solid">
              Uniform Solid Sphere
            </option>

            <option value="shell">
              Spherical Shell
            </option>
          </select>

          <label>
            Sphere Radius: {radius.toFixed(1)} cm
          </label>

          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={radius}
            onChange={(e) =>
              setRadius(Number(e.target.value))
            }
          />

          <label>
            Gaussian Surface Radius (r):{" "}
            {observationRadius.toFixed(2)} cm
          </label>

          <input
            type="range"
            min="0.05"
            max="10"
            step="0.05"
            value={observationRadius}
            onChange={(e) =>
              setObservationRadius(Number(e.target.value))
            }
          />

          <div className="results">

            <h3>Results</h3>

            <p>
              r/R = {x.toFixed(3)}
            </p>

            <p>
              E = {electricField.toExponential(3)} N/C
            </p>

            <p>
              Q enclosed ={" "}
              {(enclosedCharge * 1e9).toFixed(3)} nC
            </p>

          </div>

        </div>

        <div className="panel">

          <h2>Charge Distribution</h2>

          <svg
            viewBox="0 0 520 520"
            className="diagram"
          >

            {distribution === "solid" ? (

              <circle
                cx="260"
                cy="260"
                r={sphereVisualRadius}
                fill="#fda4af"
                fillOpacity="0.55"
                stroke="#e11d48"
                strokeWidth="2"
              />

            ) : (

              <circle
                cx="260"
                cy="260"
                r={sphereVisualRadius}
                fill="none"
                stroke="#e11d48"
                strokeWidth="5"
              />

            )}

            <circle
              cx="260"
              cy="260"
              r={gaussianVisualRadius}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="7 5"
            />

            <circle
              cx="260"
              cy="260"
              r="4"
              fill="#111827"
            />

          </svg>

          <div className="caption">

            <p>
              <strong style={{ color: "#e11d48" }}>
                Red:
              </strong>{" "}
              Charged sphere (R)
            </p>

            <p>
              <strong style={{ color: "#2563eb" }}>
                Blue dashed circle:
              </strong>{" "}
              Gaussian surface (r)
            </p>

            <p className="caption-note">
              The Gaussian surface is an imaginary closed
              surface used to calculate electric flux.
            </p>

          </div>

        </div>

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

        <div className="physics-note">

          <h3>Understanding the Graph</h3>

          <p>
            The electric field is normalized by its
            magnitude at the sphere's surface:
          </p>

          <div className="physics-equation">
            <BlockMath
              math={String.raw`
                E_0 = \frac{k|Q|}{R^2}
              `}
            />
          </div>

          <p>
            <strong>
              When <InlineMath math="R" /> = {radius.toFixed(1)} cm,
              {" "}
              <InlineMath math="E_0" /> = {E0.toExponential(3)} N/C
            </strong>
          </p>

          <p>
            Here, <InlineMath math="Q" /> is the total
            charge, <InlineMath math="R" /> is the sphere
            radius, and <InlineMath math="k" /> is
            Coulomb's constant.
          </p>

          {plotMode === "normalized" ? (

            <p>
              The normalized coordinates{" "}

              <InlineMath math="E/E_0" />

              {" and "}

              <InlineMath math="r/R" />

              {" allow us to compare spheres of different sizes using the same curve."}
            </p>

          ) : (

            <p>
              The physical coordinates show the actual
              electric field in N/C as a function of
              distance from the center in cm.
              Changing the sphere radius changes
              the electric field distribution.
            </p>

          )}

        </div>

      </section>

    </main>
  );
}

export default App;

