// src/components/PhysicsNotes.tsx

import { BlockMath, InlineMath } from "react-katex";
import type { SphericalDistribution } from "../physics/sphere";
import type { RadialDensityModel } from "../physics/radialDensity";

type PhysicsNotesProps = {
  distribution: SphericalDistribution;
  radius: number;
  surfaceField: number;
  plotMode: "normalized" | "physical";
};

type VolumeModelNote = {
  name: string;
  density: string;
  enclosedCharge: string;
  field: string;
  explanation: string;
};

const volumeModelNotes: Record<
  RadialDensityModel,
  VolumeModelNote
> = {
  uniform: {
    name: "Uniform solid sphere",

    density: String.raw`
      \frac{\rho(r)}{\rho_0}=1
    `,

    enclosedCharge: String.raw`
      \frac{Q_{\mathrm{enc}}}{Q}
      =
      \begin{cases}
        x^3, & x<1,\\
        1, & x\ge 1,
      \end{cases}
    `,

    field: String.raw`
      \frac{E}{E_0}
      =
      \begin{cases}
        x, & x<1,\\
        \dfrac{1}{x^2}, & x\ge 1.
      \end{cases}
    `,

    explanation:
      "The charge density is constant, so the enclosed charge grows as the volume, proportional to r³.",
  },

  "linear-increasing": {
    name: "Linearly increasing density",

    density: String.raw`
      \frac{\rho(r)}{\rho_0}=x
    `,

    enclosedCharge: String.raw`
      \frac{Q_{\mathrm{enc}}}{Q}
      =
      \begin{cases}
        x^4, & x<1,\\
        1, & x\ge 1,
      \end{cases}
    `,

    field: String.raw`
      \frac{E}{E_0}
      =
      \begin{cases}
        x^2, & x<1,\\
        \dfrac{1}{x^2}, & x\ge 1.
      \end{cases}
    `,

    explanation:
      "More charge is concentrated toward the outside of the sphere, so less charge is enclosed at small radii than for a uniform sphere.",
  },

  "quadratic-decreasing": {
    name: "Quadratically decreasing density",

    density: String.raw`
      \frac{\rho(r)}{\rho_0}
      =
      1-x^2
    `,

    enclosedCharge: String.raw`
      \frac{Q_{\mathrm{enc}}}{Q}
      =
      \begin{cases}
        \dfrac{5}{2}x^3-\dfrac{3}{2}x^5,
        & x<1,\\
        1,
        & x\ge 1,
      \end{cases}
    `,

    field: String.raw`
      \frac{E}{E_0}
      =
      \begin{cases}
        \dfrac{5}{2}x-\dfrac{3}{2}x^3,
        & x<1,\\
        \dfrac{1}{x^2},
        & x\ge 1.
      \end{cases}
    `,

    explanation:
      "More charge is concentrated near the center. The internal electric field can therefore exceed E₀ before falling back to E(R) = E₀ at the surface.",
  },
};

export default function PhysicsNotes({
  distribution,
  radius,
  surfaceField,
  plotMode,
}: PhysicsNotesProps) {
  const volumeNote =
    distribution.kind === "volume"
      ? volumeModelNotes[
          distribution.densityModel
        ]
      : null;

  return (
    <div className="physics-note">
      <h3>Understanding the Graph</h3>

      <p>
        Define the normalized radius{" "}
        <InlineMath math="x=r/R" />{" "}
        and the reference field scale
      </p>

      <div className="physics-equation">
        <BlockMath
          math={String.raw`
            E_0=\frac{k|Q|}{R^2}
          `}
        />
      </div>

      <p>
        For a spherically symmetric volume charge distribution,
      </p>

      <div className="physics-equation">
        <BlockMath
          math={String.raw`
            Q_{\mathrm{enc}}(r)
            =
            4\pi
            \int_0^r
            \rho(r')\,r'^2\,dr'
          `}
        />
      </div>

      <p>
        Gauss&apos;s law then gives
      </p>

      <div className="physics-equation">
        <BlockMath
          math={String.raw`
            E(r)\,4\pi r^2
            =
            \frac{Q_{\mathrm{enc}}(r)}
            {\varepsilon_0}
          `}
        />
      </div>

      {volumeNote ? (
        <>
          <h3>{volumeNote.name}</h3>

          <p>
            The selected radial charge-density profile is
          </p>

          <div className="physics-equation">
            <BlockMath
              math={volumeNote.density}
            />
          </div>

          <p>
            where{" "}
            <InlineMath math="x=r/R" />.
          </p>

          <p>
            The corresponding enclosed-charge fraction is
          </p>

          <div className="physics-equation">
            <BlockMath
              math={volumeNote.enclosedCharge}
            />
          </div>

          <p>
            Therefore the normalized electric field is
          </p>

          <div className="physics-equation">
            <BlockMath
              math={volumeNote.field}
            />
          </div>

          <p>
            {volumeNote.explanation}
          </p>

          <p>
            At the sphere surface,{" "}
            <InlineMath math="E(R)=E_0" />.
          </p>
        </>
      ) : (
        <>
          <h3>Ideal spherical shell</h3>

          <p>
            All charge is concentrated on the spherical surface at <InlineMath math="r=R" />.
          </p>

          <div className="physics-equation">
            <BlockMath
              math={String.raw`
                \frac{Q_{\mathrm{enc}}}{Q}
                =
                \begin{cases}
                  0, & x<1,\\
                  1, & x\ge 1.
                \end{cases}
              `}
            />
          </div>

          <div className="physics-equation">
            <BlockMath
              math={String.raw`
                \frac{E}{E_0}
                =
                \begin{cases}
                  0, & x<1,\\
                  \dfrac{1}{x^2}, & x\ge 1.
                \end{cases}
              `}
            />
          </div>

          <p>
            The ideal shell has a discontinuity at the surface:{" "}
            <InlineMath math="E(R^-)=0" />{" "}
            while{" "}
            <InlineMath math="E(R^+)=E_0" />.
          </p>
        </>
      )}

      <h3>Current scale</h3>

      <p>
        When <InlineMath math="R" /> ={" "}
        {radius.toFixed(1)} cm,
      </p>

      <div className="physics-equation">
        <BlockMath
          math={String.raw`
            E_0
            =
            ${surfaceField.toExponential(3)}
            \ \mathrm{N/C}
          `}
        />
      </div>

      {plotMode === "normalized" ? (
        <p>
          The normalized plot uses{" "}
          <InlineMath math="r/R" />{" "}
          and{" "}
          <InlineMath math="E/E_0" />.
          This removes the overall size and field scale 
          and makes the shape of different charge distributions easier to compare.
        </p>
      ) : (
        <p>
          The physical plot shows the actual electric field in kN/C as a function of radius in cm.
          Changing <InlineMath math="R" /> changes the physical field scale through{" "}
          <InlineMath math="E_0\propto 1/R^2" />.
        </p>
      )}
    </div>
  );
}
