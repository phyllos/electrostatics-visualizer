// src/physics/radialDensity.ts

// ==========================================
// Radial Density Models
// ==========================================
export type RadialDensityModel =
  | "uniform"
  | "linear-increasing"
  | "quadratic-decreasing";


// ==========================================
// Internal Density Profile Definition
// ==========================================
type RadialDensityProfile = {
  // Dimensionless density shape:
  // rho(r) / rho0 = f(x),
  // where x = r / R.
  shape: (x: number) => number;
  // Dimensionless enclosed-charge integral:
  //
  // integral from 0 to x of f(u) u^2 du
  enclosedIntegral: (x: number) => number;
};

// ==========================================
// Density Profiles
// ==========================================
const profiles: Record<
  RadialDensityModel,
  RadialDensityProfile
> = {
  uniform: {
    // rho / rho0 = 1
    shape: () => 1,
    // integral u^2 du = x^3 / 3
    enclosedIntegral: (x) => x ** 3 / 3,
  },

  "linear-increasing": {
    // rho / rho0 = x
    shape: (x) => x,
    // integral u^3 du = x^4 / 4
    enclosedIntegral: (x) => x ** 4 / 4,
  },

  "quadratic-decreasing": {
    // rho / rho0 = 1 - x^2
    shape: (x) => 1 - x ** 2,
    // integral (u^2 - u^4) du = x^3 / 3 - x^5 / 5
    enclosedIntegral: (x) =>
      x ** 3 / 3 - x ** 5 / 5,
  },
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
// Normalized Density
// rho(r) / rho0
// ==========================================
export function densityShape(
  model: RadialDensityModel,
  x: number,
): number {
  validateNormalizedRadius(x);
  // No volume charge exists outside the sphere.
  if (x > 1) {
    return 0;
  }
  return profiles[model].shape(x);
}

/*
export function densityScale(
  model: RadialDensityModel,
  totalCharge: number,
  radiusMeters: number,
) {
  const profile = profiles[model];

  const normalization =
    profile.enclosedIntegral(1);

  return (
    totalCharge /
    (
      4 *
      Math.PI *
      radiusMeters ** 3 *
      normalization
    )
  );
}
*/

/*
densityAt(model, totalCharge, radiusMeters, rMeters)
*/

// ==========================================
// Normalized Enclosed Charge
// Q_enc(r) / Q
// ==========================================
export function enclosedChargeRatio(
  model: RadialDensityModel,
  x: number,
): number {
  validateNormalizedRadius(x);

  // A Gaussian surface at or outside the
  // physical sphere encloses all charge.
  if (x >= 1) {
    return 1;
  }

  const profile =
    profiles[model];

  return (
    profile.enclosedIntegral(x) /
    profile.enclosedIntegral(1)
  );
}

/*
enclosedCharge(model, totalCharge, x)
*/

// ==========================================
// Normalized Electric Field
// E(r) / E0
// E0 = kQ / R^2
// ==========================================
export function fieldRatio(
  model: RadialDensityModel,
  x: number,
): number {
  validateNormalizedRadius(x);
  // Avoid division by zero at the center.
  if (x === 0) {
    return 0;
  }
  // Outside every spherically symmetric distribution, 
  // the field is identical to that of a point charge Q.
  if (x >= 1) {
    return 1 / (x * x);
  }
  // From Gauss's law:
  // E / E0 = (Q_enc / Q) / x^2
  return (
    enclosedChargeRatio(
      model,
      x,
    ) /
    (x * x)
  );
}
