# THERMASHELTER — SIH26051 Front-End Demonstrator

Presentation-ready front-end prototype for DRDO problem statement **SIH26051 — Software Based Model Development for Design of Area Specific Shelter for Thermal Comfort Maintenance**.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Data integrity

- `src/data/thermal_static_results.json` is the authoritative scientific dataset and is copied unchanged from the supplied result pack.
- `src/data/thermal_time_series.csv` and `src/data/thermal_calculation_notes.md` are bundled for traceability.
- The application does **not** recalculate thermal physics.
- No backend, database, API keys, weather API calls, authentication, live solver, ML model or Python service are used.

## Product name

Edit only:

`src/config/product.ts`

The temporary working name is `THERMASHELTER`.

## Major views

1. Leh Pilot / landing — site and weather context.
2. Shelter Configuration — switch among Baseline, Improved and Passive-Optimized design inputs.
3. Thermal Analysis — 72-hour indoor/outdoor temperature series, key metrics and heat-flow breakdown.
4. Design Comparison — heating-energy comparison, optimized-vs-baseline reductions and orientation-only diagnostic.

## Scientific positioning

The demonstrator is a **physics-based reduced-order thermal screening model** using **precomputed results**. It is not CFD, FEM, a digital twin, a certified comfort model, a structural model or a deployed DRDO system.

## Validation note

This handoff was checked for TypeScript/TSX syntax and frozen-data integrity in the generation environment. The environment could not reach `registry.npmjs.org`, so dependency installation and the final Vite bundle could not be executed here. On a network-enabled machine, run the commands above to install and build.

## Landing hero V2

The landing/Pilot hero uses a local procedural Three.js scene rendered through `@react-three/fiber`. Terrain geometry, wire/topographic overlays, beacon, shelter marker and solar-direction cue are generated at runtime from local code; there are no runtime map, terrain, texture, weather, or imagery requests.

The compact India locator uses a locally bundled SVG at `src/assets/india-natural-earth.svg`, simplified from the public-domain Natural Earth 1:110m Admin 0 Countries India feature. Natural Earth describes the default Admin 0 dataset as a de-facto boundary representation; the locator is included only as geographic context for the Leh reference site.

The terrain is intentionally labeled **STYLIZED HIGH-ALTITUDE TERRAIN**. It is a cinematic engineering visualization, not GIS terrain, a digital twin, or an exact Leh elevation reconstruction.

WebGL DPR is capped at 1.5 and no post-processing stack, texture downloads, or large particle systems are used. If WebGL is unavailable, the hero retains a local static technical mountain fallback. Motion is reduced when the operating system requests `prefers-reduced-motion`.
