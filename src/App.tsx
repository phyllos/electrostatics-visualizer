import { useState } from "react";

import { InlineMath, BlockMath } from "react-katex";

import "./App.css";

type ChargeDistribution = "solid" | "shell";

const k = 8.9875517923e9;

const Q = 5e-9; // Coulombs

function App() {
  const [distribution, setDistribution] =
    useState<ChargeDistribution>("solid");

  const [radius, setRadius] = useState(2);

  const [x, setX] = useState(0.6);

  // x = r / R
  const fieldRatio = (t: number) => {
    if (distribution === "solid" && t < 1) {
      return t;
    }

    if (distribution === "shell" && t < 1) {
      return 0;
    }

    return 1 / (t * t);
  };

  const enclosedChargeRatio = (t: number) => {
    if (distribution === "solid") {
      return t < 1 ? t ** 3 : 1;
    }

    return t < 1 ? 0 : 1;
  };

  // Convert cm to meters
  const R = radius / 100;

  // Electric field at the surface
  const E0 = (k * Q) / (R * R);

  const electricField = E0 * fieldRatio(x);

  const enclosedCharge = Q * enclosedChargeRatio(x);

  // Electric field plot
  const plotPoints = Array.from(
    { length: 241 },
    (_, i) => {
      const t = (i / 240) * 2.4;

      const px = 40 + (t / 2.4) * 430;

      const py = 220 - fieldRatio(t) * 165;

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

  const markerX = 40 + (x / 2.4) * 430;

  const markerY = 220 - fieldRatio(x) * 165;

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
            Observation Radius: r/R = {x.toFixed(2)}
          </label>

          <input
            type="range"
            min="0"
            max="2.4"
            step="0.01"
            value={x}
            onChange={(e) =>
              setX(Number(e.target.value))
            }
          />

          <div className="results">

            <h3>Results</h3>

            <p>
              E = {electricField.toExponential(3)} N/C
            </p>

            <p>
              Q enclosed ={" "}
              {(enclosedCharge * 1e9).toFixed(3)} nC
            </p>

            <p>
              r = {(x * radius).toFixed(2)} cm
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
            x1={40 + 430 / 2.4}
            y1="30"
            x2={40 + 430 / 2.4}
            y2="220"
            stroke="#aaa"
            strokeDasharray="5 5"
          />

          <polyline
            points={plotPoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
          />

          <circle
            cx={markerX}
            cy={markerY}
            r="6"
            fill="#e11d48"
          />

          <text x="8" y="25">
            E / E₀
          </text>

          <text x="450" y="250">
            r / R
          </text>

          <text
            x={40 + 430 / 2.4}
            y="245"
            textAnchor="middle"
          >
            R
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

          <p>
            The normalized coordinates{" "}

            <InlineMath math="E/E_0" />

            {" and "}

            <InlineMath math="r/R" />

            {" allow us to compare spheres of different sizes using the same curve."}
          </p>

        </div>

      </section>

    </main>
  );
}

export default App;

