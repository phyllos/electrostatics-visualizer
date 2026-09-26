// src/physics/radialDensity.test.ts

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  densityShape,
  enclosedChargeRatio,
  fieldRatio,
} from "./radialDensity";


// ==========================================
// Uniform Density
// ==========================================
describe(
  "Uniform radial density",
  () => {
    it(
      "has constant density inside the sphere",
      () => {
        expect(
          densityShape(
            "uniform",
            0,
          ),
        ).toBeCloseTo(1);

        expect(
          densityShape(
            "uniform",
            0.5,
          ),
        ).toBeCloseTo(1);

        expect(
          densityShape(
            "uniform",
            1,
          ),
        ).toBeCloseTo(1);
      },
    );

    it(
      "has Q_enc / Q = x^3 inside",
      () => {
        expect(
          enclosedChargeRatio(
            "uniform",
            0.5,
          ),
        ).toBeCloseTo(
          0.125,
        );
      },
    );

    it(
      "has E / E0 = x inside",
      () => {
        expect(
          fieldRatio(
            "uniform",
            0.5,
          ),
        ).toBeCloseTo(
          0.5,
        );
      },
    );
  },
);


// ==========================================
// Linearly Increasing Density
// rho / rho0 = x
// ==========================================
describe(
  "Linearly increasing radial density",
  () => {
    it(
      "has rho / rho0 = x",
      () => {
        expect(
          densityShape(
            "linear-increasing",
            0,
          ),
        ).toBeCloseTo(0);

        expect(
          densityShape(
            "linear-increasing",
            0.5,
          ),
        ).toBeCloseTo(0.5);

        expect(
          densityShape(
            "linear-increasing",
            1,
          ),
        ).toBeCloseTo(1);
      },
    );

    it(
      "has Q_enc / Q = x^4 inside",
      () => {
        expect(
          enclosedChargeRatio(
            "linear-increasing",
            0.5,
          ),
        ).toBeCloseTo(
          0.5 ** 4,
        );
      },
    );

    it(
      "has E / E0 = x^2 inside",
      () => {
        expect(
          fieldRatio(
            "linear-increasing",
            0.5,
          ),
        ).toBeCloseTo(
          0.5 ** 2,
        );
      },
    );
  },
);


// ==========================================
// Quadratically Decreasing Density
// rho / rho0 = 1 - x^2
// ==========================================
describe(
  "Quadratically decreasing radial density",
  () => {
    it(
      "has rho / rho0 = 1 - x^2",
      () => {
        expect(
          densityShape(
            "quadratic-decreasing",
            0,
          ),
        ).toBeCloseTo(1);

        expect(
          densityShape(
            "quadratic-decreasing",
            0.5,
          ),
        ).toBeCloseTo(
          0.75,
        );

        expect(
          densityShape(
            "quadratic-decreasing",
            1,
          ),
        ).toBeCloseTo(0);
      },
    );

    it(
      "has the derived enclosed-charge ratio",
      () => {
        const x = 0.5;

        const expected =
          (5 / 2) *
            x ** 3 -
          (3 / 2) *
            x ** 5;

        expect(
          enclosedChargeRatio(
            "quadratic-decreasing",
            x,
          ),
        ).toBeCloseTo(
          expected,
        );
      },
    );

    it(
      "has the derived electric-field ratio",
      () => {
        const x = 0.5;

        const expected =
          (5 / 2) *
            x -
          (3 / 2) *
            x ** 3;

        expect(
          fieldRatio(
            "quadratic-decreasing",
            x,
          ),
        ).toBeCloseTo(
          expected,
        );
      },
    );

    it(
      "can have E / E0 greater than 1 inside",
      () => {
        const x =
          Math.sqrt(5) / 3;

        expect(
          fieldRatio(
            "quadratic-decreasing",
            x,
          ),
        ).toBeGreaterThan(1);
      },
    );
  },
);


// ==========================================
// Shared Boundary Behavior
// ==========================================
describe(
  "Radial-density boundary behavior",
  () => {
    const models = [
      "uniform",
      "linear-increasing",
      "quadratic-decreasing",
    ] as const;

    it(
      "encloses all charge at r = R",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            enclosedChargeRatio(
              model,
              1,
            ),
          ).toBeCloseTo(1);
        }
      },
    );

    it(
      "has E / E0 = 1 at r = R",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            fieldRatio(
              model,
              1,
            ),
          ).toBeCloseTo(1);
        }
      },
    );

    it(
      "has the same 1/x^2 field outside",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            fieldRatio(
              model,
              2,
            ),
          ).toBeCloseTo(
            0.25,
          );
        }
      },
    );

    it(
      "encloses all charge outside",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            enclosedChargeRatio(
              model,
              2,
            ),
          ).toBeCloseTo(1);
        }
      },
    );

    it(
      "has zero volume charge outside",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            densityShape(
              model,
              2,
            ),
          ).toBeCloseTo(0);
        }
      },
    );
  },
);


// ==========================================
// Center Behavior
// ==========================================
describe(
  "Radial-density center behavior",
  () => {
    const models = [
      "uniform",
      "linear-increasing",
      "quadratic-decreasing",
    ] as const;

    it(
      "has zero enclosed charge at the center",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            enclosedChargeRatio(
              model,
              0,
            ),
          ).toBeCloseTo(0);
        }
      },
    );

    it(
      "has zero electric field at the center",
      () => {
        for (
          const model
          of models
        ) {
          expect(
            fieldRatio(
              model,
              0,
            ),
          ).toBeCloseTo(0);
        }
      },
    );
  },
);


// ==========================================
// Invalid Input
// ==========================================
describe(
  "Radial-density input validation",
  () => {
    it(
      "rejects negative normalized radius",
      () => {
        expect(() =>
          densityShape(
            "uniform",
            -0.1,
          ),
        ).toThrow(RangeError);

        expect(() =>
          enclosedChargeRatio(
            "uniform",
            -0.1,
          ),
        ).toThrow(RangeError);

        expect(() =>
          fieldRatio(
            "uniform",
            -0.1,
          ),
        ).toThrow(RangeError);
      },
    );

    it(
      "rejects non-finite normalized radius",
      () => {
        expect(() =>
          densityShape(
            "uniform",
            Number.NaN,
          ),
        ).toThrow(RangeError);

        expect(() =>
          enclosedChargeRatio(
            "uniform",
            Infinity,
          ),
        ).toThrow(RangeError);

        expect(() =>
          fieldRatio(
            "uniform",
            Number.NaN,
          ),
        ).toThrow(RangeError);
      },
    );
  },
);
