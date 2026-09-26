// src/components/PhysicsNotes.tsx

import {
  InlineMath,
  BlockMath
} from "react-katex";

import type { ChargeDistribution } from "../physics/sphere";

// ==========================================
// Component Props
// ==========================================

type PhysicsNotesProps = {
  distribution: ChargeDistribution;

  radius: number;

  surfaceField: number;

  plotMode: "normalized" | "physical";
};


// ==========================================
// Physics Notes Component
// ==========================================

export default function PhysicsNotes({

  distribution,
  radius,
  surfaceField,
  plotMode,

}: PhysicsNotesProps) {

  return (

    <div className="physics-note">

      <h3>Understanding the Graph</h3>


      {/* Reference Electric Field */}

      <p>

        The electric field is normalized using the reference field scale:
      </p>


      <div className="physics-equation">

        <BlockMath
          math={String.raw`
            E_0 = \frac{k|Q|}{R^2}
          `}
        />

      </div>

      {/* Boundary Behavior */}

      {distribution === "solid" ? (
        <p>
          For a uniformly charged solid sphere,{" "}
          <InlineMath math="E(R) = E_0" />.
        </p>
      ) : (
        <p>
          For an ideal spherical shell,{" "}
          <InlineMath math="E(R^-) = 0" />{" "}
          and{" "}
          <InlineMath math="E(R^+) = E_0" />.
        </p>
      )}


      {/* Dynamic Surface Field */}

      <p>

        <strong>

          When <InlineMath math="R" /> ={" "}
          {radius.toFixed(1)} cm,

          {" "}

          <InlineMath math="E_0" /> ={" "}
          {surfaceField.toExponential(3)} N/C

        </strong>

      </p>


      {/* Explanation of Symbols */}

      <p>

        Here, <InlineMath math="Q" /> is
        the total charge,{" "}

        <InlineMath math="R" /> is the
        sphere radius, and{" "}

        <InlineMath math="k" /> is
        Coulomb's constant.

      </p>


      {/* Graph Mode Explanation */}

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

          {" "}

          Changing the sphere radius changes
          the electric field distribution.

        </p>

      )}

    </div>

  );

}
