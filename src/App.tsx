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

const TOTAL_CHARGE = 5e-9; // Coulombs

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
    useState<PlotMode>("physical");
  
  // Mobile view toggle
  const [mobileView, setMobileView] = 
    useState<"field" | "sphere">("field");

  // Dimensionless observation radius
  const x = observationRadius / radius;

  // x = r / R
  const fieldRatio = (t: number) =>
    calculateFieldRatio(distribution, t);

  // Electric field at the surface
  const E0 = surfaceFieldMagnitude(TOTAL_CHARGE, radius / 100);

  const electricField = E0 * fieldRatio(x);

  const enclosedCharge = TOTAL_CHARGE * calculateEnclosedChargeRatio(distribution, x);



  return (
    <main className="app">
      <header className="app-header">
        <h1>Electrostatics Visualizer</h1>

        <p>
          Explore spherical charge distributions and Gauss's law.
        </p>

      </header>
      {/* Live values remain close to the figures and controls. */}
      <div className="results-bar" aria-label="Current values">

        <span>
          <strong>Q</strong> = +5.00 nC{" "}
          <small>· fixed</small>
        </span>

        <span>
          <strong>r/R</strong> = {x.toFixed(3)}
        </span>

        <span>
          <strong>|E|</strong> = {(electricField / 1000).toFixed(2)} kN/C
        </span>

        <span>
          <strong>Q enclosed</strong> = {(enclosedCharge * 1e9).toFixed(3)} nC
        </span>

      </div>

      {/* Switching figures preserves the shared parameters. */}
      <div 
        className="mobile-view-switch" 
        role="group" 
        aria-label="Visible figure"
      >
        <button 
          type="button" 
          aria-pressed={mobileView === "field"}
          aria-controls="field-view" 
          onClick={() => setMobileView("field")}
        >
          E(r) graph
        </button>

        <button 
          type="button" 
          aria-pressed={mobileView === "sphere"}
          aria-controls="sphere-view" 
          onClick={() => setMobileView("sphere")}
        >
          Sphere
        </button>
      </div>

      <section 
        className="workspace" 
        data-mobile-view={mobileView}
      >
        <div className="controls-view">

          <ControlPanel 
            distribution={distribution} 
            onDistributionChange={setDistribution}
            radius={radius} 
            onRadiusChange={setRadius} 
            observationRadius={observationRadius}
            onObservationRadiusChange={setObservationRadius} 
          />

        </div>

        <div 
          className="sphere-view" 
          id="sphere-view"
        >

          <ChargeVisualization 
            distribution={distribution} 
            radius={radius}
            observationRadius={observationRadius} 
          />

        </div>
        <section 
          className="panel field-view" 
          id="field-view"
        >
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

        </section>
      </section>

      <details className="panel notes-panel">
        <summary>
          Physics notes &amp; equations
        </summary>

        <PhysicsNotes 
          distribution={distribution} 
          radius={radius}
          surfaceField={E0} 
          plotMode={plotMode} 
        />

      </details>
    </main>
  );
}

export default App;

