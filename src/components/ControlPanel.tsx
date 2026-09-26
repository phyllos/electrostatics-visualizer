// src/components/ControlPanel.tsx

import type { ChargeDistribution } from "../physics/sphere";

// ==========================================
// Component Props
// ==========================================

type ControlPanelProps = {
  // Charge distribution
  distribution: ChargeDistribution;
  onDistributionChange: (
    value: ChargeDistribution,
  ) => void;

  // Sphere radius (cm)
  radius: number;
  onRadiusChange: (value: number) => void;

  // Gaussian surface radius (cm)
  observationRadius: number;
  onObservationRadiusChange: (
    value: number,
  ) => void;
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
    <section className="panel control-panel">
      <h2>Parameters</h2>

      {/* Charge Distribution */}
      <div className="control distribution-control">
        <label htmlFor="charge-distribution">
          Charge Distribution
        </label>

        <select
          id="charge-distribution"
          value={distribution}
          onChange={(event) =>
            onDistributionChange(
              event.target
                .value as ChargeDistribution,
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
        {/* Sphere Radius */}
        <div className="control">
          <label htmlFor="sphere-radius">
            <span>Sphere radius R</span>

            <output htmlFor="sphere-radius">
              {radius.toFixed(2)} cm
            </output>
          </label>

          <input
            id="sphere-radius"
            className="physics-slider"
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={radius}
            onChange={(event) =>
              onRadiusChange(
                Number(event.target.value),
              )
            }
          />

          <div className="range-limits">
            <span>1 cm</span>
            <span>5 cm</span>
          </div>
        </div>

        {/* Gaussian Surface Radius */}
        <div className="control">
          <label htmlFor="gaussian-radius">
            <span>Gaussian radius r</span>

            <output htmlFor="gaussian-radius">
              {observationRadius.toFixed(2)} cm
            </output>
          </label>

          <input
            id="gaussian-radius"
            className="physics-slider"
            type="range"
            min="0.05"
            max="10"
            step="0.05"
            value={observationRadius}
            onChange={(event) =>
              onObservationRadiusChange(
                Number(event.target.value),
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
