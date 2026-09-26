// src/components/ChargeVisualization.tsx

import type { ChargeDistribution } from "../physics/sphere";


// ==========================================
// Component Props
// ==========================================

type ChargeVisualizationProps = {

  distribution: ChargeDistribution;

  radius: number;

  observationRadius: number;

};


// ==========================================
// Visualization Settings
// ==========================================

// 17.5 SVG units = 1 cm

const VISUALIZATION_SCALE = 17.5;


// ==========================================
// Charge Visualization Component
// ==========================================

export default function ChargeVisualization({

  distribution,
  radius,
  observationRadius,

}: ChargeVisualizationProps) {


  // Convert physical radii to SVG coordinates

  const sphereVisualRadius =
    radius * VISUALIZATION_SCALE;

  const gaussianVisualRadius =
    observationRadius * VISUALIZATION_SCALE;


  return (

    <div className="panel">

      <h2>Charge Distribution</h2>


      {/* Charge Distribution Diagram */}

      <svg
        viewBox="60 60 400 400"
        className="diagram"
        role="img"
        aria-label="Charged sphere and Gaussian surface"
      >


        {/* Charged Sphere */}

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


        {/* Gaussian Surface */}

        <circle
          cx="260"
          cy="260"

          r={gaussianVisualRadius}

          fill="none"

          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="7 5"
        />


        {/* Center */}

        <circle
          cx="260"
          cy="260"

          r="4"

          fill="#111827"
        />

      </svg>


      {/* Diagram Explanation */}

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

          The Gaussian surface is an imaginary
          closed surface used to calculate
          electric flux.

        </p>

      </div>

    </div>

  );

}
