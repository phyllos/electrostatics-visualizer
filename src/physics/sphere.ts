// src/physics/sphere.ts

// ==========================================
// Physical Constants
// ==========================================

export const COULOMB_CONSTANT = 8.9875517923e9;


// ==========================================
// Charge Distribution Types
// ==========================================

export type ChargeDistribution =
  | "solid"
  | "shell";


// ==========================================
// Normalized Electric Field
// E(r) / E0
// ==========================================

export function fieldRatio(
  distribution: ChargeDistribution,
  t: number
): number {

  if (!Number.isFinite(t) || t < 0) {
    throw new RangeError("r/R must be finite and nonnegative");
  }

  // Inside the charged sphere

  if (t < 1) {

    if (distribution === "solid") {
      return t;
    }

    return 0;

  }

  // Outside the charged sphere

  return 1 / (t * t);

}


// ==========================================
// Normalized Enclosed Charge
// Q_enc(r) / Q
// ==========================================

export function enclosedChargeRatio(
  distribution: ChargeDistribution,
  t: number
): number {

  if (!Number.isFinite(t) || t < 0) {
    throw new RangeError("r/R must be finite and nonnegative");
  }

  if (distribution === "solid") {
    return t < 1 ? t ** 3 : 1;
  }

  return t < 1 ? 0 : 1;

}


// ==========================================
// Electric Field Magnitude at Surface
// E0 = k|Q| / R²
// ==========================================

export function surfaceFieldMagnitude(
  totalCharge: number,
  radiusMeters: number
): number {

  if (
    !Number.isFinite(radiusMeters) ||
    radiusMeters <= 0
  ) {
    throw new RangeError("Sphere radius must be positive");
  }

  return (
    COULOMB_CONSTANT *
    Math.abs(totalCharge) /
    (radiusMeters ** 2)
  );

}
