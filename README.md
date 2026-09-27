# Electrostatics Visualizer

An interactive educational tool for exploring electric fields, charge distributions, and Gauss's law.

## Live Demo

https://phyllos.github.io/electrostatics-visualizer/

## Features

- Uniform, nonuniform, and shell spherical charge distributions
- Interactive Gaussian surface with adjustable radii
- Normalized and physical electric-field plots
- Radial density visualization and model-specific physics notes
- Responsive layout with light and dark themes

## Charge Distribution Models

For spherical volume charge distributions, define

```math
x = \frac{r}{R}.
```

The current models are:

- **Uniform:** $\rho/\rho_0 = 1$
- **Linearly increasing:** $\rho/\rho_0 = x$
- **Quadratically decreasing:** $\rho/\rho_0 = 1-x^2$

The total charge $Q$ is fixed while the radial density profile changes.

For a spherically symmetric volume charge distribution,

```math
Q_{\mathrm{enc}}(r)
=
4\pi
\int_0^r
\rho(r')\,r'^2\,dr'.
```

Gauss's law gives

```math
E(r)
=
\frac{1}{4\pi\varepsilon_0}
\frac{Q_{\mathrm{enc}}(r)}{r^2}.
```

Outside the sphere, the field follows the same $1/r^2$ dependence for all supported spherical distributions.

## Getting Started

### Requirements

- Node.js
- npm

### Installation

```bash
git clone https://github.com/phyllos/electrostatics-visualizer.git
cd electrostatics-visualizer
npm install
```

### Development

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

## Technologies

React, TypeScript, Vite, SVG, KaTeX, and Vitest.

## Future Development

- Additional radial density models
- Parameterized charge-density profiles
- Cylindrical charge distributions
- Rods, rings, and disks
- Cavities and superposition
- Expanded Gaussian surface tools

