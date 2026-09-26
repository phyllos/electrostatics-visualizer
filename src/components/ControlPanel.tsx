// src/components/ControlPanel.tsx

import type { ChargeDistribution } from "../physics/sphere";


// ==========================================
// Component Props
// ==========================================

type ControlPanelProps = {

  // Charge distribution

  distribution: ChargeDistribution;

  onDistributionChange:
    (value: ChargeDistribution) => void;


  // Sphere radius (cm)

  radius: number;

  onRadiusChange:
    (value: number) => void;


  // Gaussian surface radius (cm)

  observationRadius: number;

  onObservationRadiusChange:
    (value: number) => void;


  // Calculated physics results

  radiusRatio: number;

  electricField: number;

  enclosedCharge: number;

};


// ==========================================
// Control Panel Component
// ==========================================

export default function ControlPanel({

  distribution,
  onDistributionChange,

  radius,
  onRadiusChange,

  observationRadius,
  onObservationRadiusChange,

  radiusRatio,
  electricField,
  enclosedCharge,

}: ControlPanelProps) {

  return (

    <div className="panel">

      <h2>Parameters</h2>


      {/* Charge Distribution */}

      <label htmlFor="charge-distribution">
        Charge Distribution
      </label>

      <select
        id="charge-distribution"

        value={distribution}

        onChange={(e) =>
          onDistributionChange(
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


      {/* Sphere Radius */}

      <label htmlFor="sphere-radius">
        Sphere Radius (R): {radius.toFixed(2)} cm
      </label>

      <input
        id="sphere-radius"

        type="range"

        min="1"
        max="5"
        step="0.1"

        value={radius}

        onChange={(e) =>
          onRadiusChange(Number(e.target.value))
        }
      />


      {/* Gaussian Surface Radius */}

      <label htmlFor="gaussian-radius">
        Gaussian Surface Radius (r):{" "}
        {observationRadius.toFixed(2)} cm
      </label>

      <input
        id="gaussian-radius"

        type="range"

        min="0.05"
        max="10"
        step="0.05"

        value={observationRadius}

        onChange={(e) =>
          onObservationRadiusChange(
            Number(e.target.value)
          )
        }
      />


      {/* Physics Results */}

      <div className="results">

        <h3>Results</h3>

        <p>
          r/R = {radiusRatio.toFixed(3)}
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

  );

}
