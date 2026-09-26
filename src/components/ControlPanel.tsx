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

}: ControlPanelProps) {

  return (

    <section className="panel">


      <h2>Parameters</h2>



      <div className="control distribution-control">
        {/* Charge Distribution */}
        <label htmlFor="charge-distribution">
          Charge Distribution
        </label>

        <select
          id="charge-distribution"

          value={distribution}

          onChange={(event) =>
            onDistributionChange(
              event.target.value as ChargeDistribution
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
      </div>

      <div className="slider-controls">
        <div className="control">

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

          <div className="range-limits">
            <span>1 cm</span>
            <span>5 cm</span>
          </div>
        
        </div>



        <div className="control">
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

            onChange={(event) =>
              onObservationRadiusChange(
                Number(event.target.value)
              )
            }
          />
          <div className="range-limits">
            <span>0.05 cm</span>
            <span>10 cm</span>
          </div>
        </div>

      </div>
    </section>
  );

}

