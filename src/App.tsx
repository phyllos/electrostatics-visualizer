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

import ElectricFieldPlot, {
  type PlotMode,
} from "./components/ElectricFieldPlot";

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
    useState<PlotMode>("normalized");

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

          radiusRatio={x}

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

        <ElectricFieldPlot
          distribution={distribution}
          radius={radius}
          observationRadius={observationRadius}
          surfaceField={E0}
          electricField={electricField}
          fieldRatio={fieldRatio}
          plotMode={plotMode}
          onPlotModeChange={setPlotMode}
        />

        <PhysicsNotes
          distribution={distribution}
          radius={radius}
          surfaceField={E0}
          plotMode={plotMode}
        />

      </section>

    </main>
  );
}

export default App;

