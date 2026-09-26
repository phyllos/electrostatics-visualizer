// src/physics/radialDensity.test.ts

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  densityAt,
  densityScale,
  densityShape,
  enclosedCharge,
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
// Physical Density Scale
// ==========================================
describe(
  "Physical density scale",
  () => {
    const Q = 5e-9;
    const R = 0.02;

    it(
      "normalizes uniform density to the total charge",
      () => {
        const expected =
          (3 * Q) /
          (
            4 *
            Math.PI *
            R ** 3
          );

        expect(
          densityScale(
            "uniform",
            Q,
            R,
          ),
        ).toBeCloseTo(
          expected,
        );
      },
    );

    it(
      "normalizes linear density to the total charge",
      () => {
        const expected =
          Q /
          (
            Math.PI *
            R ** 3
          );

        expect(
          densityScale(
            "linear-increasing",
            Q,
            R,
          ),
        ).toBeCloseTo(
          expected,
        );
      },
    );

    it(
      "normalizes quadratic density to the total charge",
      () => {
        const expected =
          (15 * Q) /
          (
            8 *
            Math.PI *
            R ** 3
          );

        expect(
          densityScale(
            "quadratic-decreasing",
            Q,
            R,
          ),
        ).toBeCloseTo(
          expected,
        );
      },
    );
  },
);

// ==========================================
// Physical Charge Density
// ==========================================
describe(
  "Physical charge density",
  () => {
    const Q = 5e-9;
    const R = 0.02;
    const r = 0.01;

    it(
      "evaluates each density profile at r = R / 2",
      () => {
        expect(
          densityAt(
            "uniform",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          densityScale(
            "uniform",
            Q,
            R,
          ),
        );

        expect(
          densityAt(
            "linear-increasing",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          0.5 *
          densityScale(
            "linear-increasing",
            Q,
            R,
          ),
        );

        expect(
          densityAt(
            "quadratic-decreasing",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          0.75 *
          densityScale(
            "quadratic-decreasing",
            Q,
            R,
          ),
        );
      },
    );

    it(
      "has zero volume charge density outside the sphere",
      () => {
        expect(
          densityAt(
            "uniform",
            Q,
            R,
            2 * R,
          ),
        ).toBeCloseTo(0);

        expect(
          densityAt(
            "linear-increasing",
            Q,
            R,
            2 * R,
          ),
        ).toBeCloseTo(0);

        expect(
          densityAt(
            "quadratic-decreasing",
            Q,
            R,
            2 * R,
          ),
        ).toBeCloseTo(0);
      },
    );
  },
);
describe(
  "Charge sign",
  () => {
    it(
      "preserves the sign of a negative total charge",
      () => {
        const Q = -5e-9;
        const R = 0.02;

        expect(
          densityScale(
            "uniform",
            Q,
            R,
          ),
        ).toBeLessThan(0);

        expect(
          densityAt(
            "uniform",
            Q,
            R,
            R / 2,
          ),
        ).toBeLessThan(0);

        expect(
          enclosedCharge(
            "uniform",
            Q,
            R,
            R / 2,
          ),
        ).toBeLessThan(0);
      },
    );
  },
);

// ==========================================
// Charge Sign
// ==========================================
describe(
  "Charge sign",
  () => {
    it(
      "preserves the sign of a negative total charge",
      () => {
        const Q = -5e-9;
        const R = 0.02;

        expect(
          densityScale(
            "uniform",
            Q,
            R,
          ),
        ).toBeLessThan(0);

        expect(
          densityAt(
            "uniform",
            Q,
            R,
            R / 2,
          ),
        ).toBeLessThan(0);

        expect(
          enclosedCharge(
            "uniform",
            Q,
            R,
            R / 2,
          ),
        ).toBeLessThan(0);
      },
    );
  },
);

// ==========================================
// Physical Enclosed Charge
// ==========================================
describe(
  "Physical enclosed charge",
  () => {
    const Q = 5e-9;
    const R = 0.02;
    const r = R / 2;

    it(
      "returns the expected enclosed charge at r = R / 2",
      () => {
        expect(
          enclosedCharge(
            "uniform",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          Q * 0.5 ** 3,
        );

        expect(
          enclosedCharge(
            "linear-increasing",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          Q * 0.5 ** 4,
        );

        const expectedQuadratic =
          Q *
          (
            (5 / 2) *
              0.5 ** 3 -
            (3 / 2) *
              0.5 ** 5
          );

        expect(
          enclosedCharge(
            "quadratic-decreasing",
            Q,
            R,
            r,
          ),
        ).toBeCloseTo(
          expectedQuadratic,
        );
      },
    );

    it(
      "returns the total charge outside the sphere",
      () => {
        expect(
          enclosedCharge(
            "linear-increasing",
            Q,
            R,
            2 * R,
          ),
        ).toBeCloseTo(Q);
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

// ==========================================
// Physical Input Validation
// ==========================================
describe(
  "Physical input validation",
  () => {
    it(
      "rejects a non-finite total charge",
      () => {
        expect(() =>
          densityScale(
            "uniform",
            Number.NaN,
            0.02,
          ),
        ).toThrow(
          RangeError,
        );
      },
    );

    it(
      "rejects a non-positive sphere radius",
      () => {
        expect(() =>
          densityScale(
            "uniform",
            5e-9,
            0,
          ),
        ).toThrow(
          RangeError,
        );

        expect(() =>
          enclosedCharge(
            "uniform",
            5e-9,
            -0.02,
            0.01,
          ),
        ).toThrow(
          RangeError,
        );
      },
    );

    it(
      "rejects a negative observation radius",
      () => {
        expect(() =>
          densityAt(
            "uniform",
            5e-9,
            0.02,
            -0.01,
          ),
        ).toThrow(
          RangeError,
        );

        expect(() =>
          enclosedCharge(
            "uniform",
            5e-9,
            0.02,
            -0.01,
          ),
        ).toThrow(
          RangeError,
        );
      },
    );
  },
);