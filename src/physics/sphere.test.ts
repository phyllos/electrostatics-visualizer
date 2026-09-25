// src/physics/sphere.test.ts

import {
  describe,
  expect,
  it
} from "vitest";

import {
  fieldRatio,
  enclosedChargeRatio,
  surfaceFieldMagnitude
} from "./sphere";


// ==========================================
// Uniformly Charged Solid Sphere
// ==========================================

describe("Uniform Solid Sphere", () => {

  it("has zero electric field at the center", () => {

    expect(
      fieldRatio("solid", 0)
    ).toBe(0);

  });

  it("has E0/2 at r = R/2", () => {

    expect(
      fieldRatio("solid", 0.5)
    ).toBeCloseTo(0.5);

  });

  it("has E0 at r = R", () => {

    expect(
      fieldRatio("solid", 1)
    ).toBeCloseTo(1);

  });

  it("has E0/4 at r = 2R", () => {

    expect(
      fieldRatio("solid", 2)
    ).toBeCloseTo(0.25);

  });

  it("encloses Q/8 at r = R/2", () => {

    expect(
      enclosedChargeRatio("solid", 0.5)
    ).toBeCloseTo(0.125);

  });

  it("encloses all charge at r >= R", () => {

    expect(
      enclosedChargeRatio("solid", 2)
    ).toBe(1);

  });

});


// ==========================================
// Uniformly Charged Spherical Shell
// ==========================================

describe("Uniform Spherical Shell", () => {

  it("has zero electric field inside", () => {

    expect(
      fieldRatio("shell", 0.5)
    ).toBe(0);

  });

  it("has E0/4 at r = 2R", () => {

    expect(
      fieldRatio("shell", 2)
    ).toBeCloseTo(0.25);

  });

  it("encloses no charge inside", () => {

    expect(
      enclosedChargeRatio("shell", 0.5)
    ).toBe(0);

  });

  it("encloses all charge outside", () => {

    expect(
      enclosedChargeRatio("shell", 2)
    ).toBe(1);

  });

});


// ==========================================
// Surface Electric Field
// ==========================================

describe("Surface Electric Field", () => {

  it("calculates E0 for Q = 5 nC and R = 2 cm", () => {

    const Q = 5e-9;

    const R = 0.02;

    const E0 = surfaceFieldMagnitude(Q, R);

    expect(E0).toBeCloseTo(112344.3974, 3);

  });

  it("scales as 1/R squared", () => {

    const Q = 5e-9;

    const E1 = surfaceFieldMagnitude(Q, 0.02);

    const E2 = surfaceFieldMagnitude(Q, 0.04);

    expect(E2).toBeCloseTo(E1 / 4);

  });

});
