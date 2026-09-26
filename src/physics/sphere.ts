// src/physics/sphere.ts

// ==========================================
// Physical Constants
// ==========================================

import { COULOMB_CONSTANT } from "./constants";

import {
  enclosedChargeRatio as radialEnclosedChargeRatio,
  fieldRatio as radialFieldRatio,
  type RadialDensityModel,
} from "./radialDensity";

// ==========================================
// Spherical Distribution Types
// ==========================================

export type SphericalDistribution =
  | {
      kind: "volume";
      densityModel: RadialDensityModel;
    }
  | {
      kind: "shell";
    };

// ==========================================
// Input Validation
// ==========================================

function validateNormalizedRadius(
  x: number,
) {
  if (
    !Number.isFinite(x) ||
    x < 0
  ) {
    throw new RangeError(
      "r/R must be finite and nonnegative",
    );
  }
}

// ==========================================
// Normalized Electric Field
// E(r) / E0
// ==========================================

export function fieldRatio(
  distribution: SphericalDistribution,
  x: number,
): number {
  validateNormalizedRadius(x);

  // Volume charge distributions are handled by the radial-density physics module.
  if (distribution.kind === "volume") {
    return radialFieldRatio(
      distribution.densityModel,
      x,
    );
  }

  // Ideal spherical shell: E = 0 inside, and E ∝ 1/r^2 outside.
  if (x < 1) {
    return 0;
  }

  return 1 / (x * x);
}


// ==========================================
// Normalized Enclosed Charge
// Q_enc(r) / Q
// ==========================================

export function enclosedChargeRatio(
  distribution: SphericalDistribution,
  x: number,
): number {
  validateNormalizedRadius(x);

  if (distribution.kind === "volume") {
    return radialEnclosedChargeRatio(
      distribution.densityModel,
      x,
    );
  }

  // An ideal shell contains no enclosed charge until the Gaussian surface reaches the shell.
  return x < 1 ? 0 : 1;
}


// ==========================================
// Electric Field Magnitude at Surface
// E0 = k|Q| / R²
// ==========================================

export function surfaceFieldMagnitude(
  totalCharge: number,
  radiusMeters: number,
): number {
  if (
    !Number.isFinite(radiusMeters) ||
    radiusMeters <= 0
  ) {
    throw new RangeError(
      "Sphere radius must be positive",
    );
  }

  return (
    COULOMB_CONSTANT *
    Math.abs(totalCharge) /
    radiusMeters ** 2
  );
}

