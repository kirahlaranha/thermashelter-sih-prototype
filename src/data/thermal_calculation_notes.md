# SIH26051 Thermal Calculation Notes
## Weather validation
- Raw file: `nasa_power_leh_20250113_20250117_raw.csv`
- SHA-256: `aa8611e892dd80bcc4c01eb7830e1ac31bf7adc0295c88df61d2156c5929177d`
- Validated rows: **120** consecutive hourly UTC timestamps
- Range: **2025-01-13 00:00 UTC** through **2025-01-17 23:00 UTC**
- Missing/blank values: **0**
- `-999` fill values: **0**
- Requested fields present: **T2M, ALLSKY_SFC_SW_DWN, ALLSKY_SFC_SW_DNI, ALLSKY_SFC_SW_DIFF, PS, WS10M, RH2M**
- Extra field returned by NASA: **PSC**, corrected atmospheric pressure for the requested site elevation
- Units from header: T2M °C; irradiance W/m²; PS/PSC kPa; WS10M m/s; RH2M %
- Thermal model pressure: **PSC**, because the header identifies it as corrected to the requested 3500 m site elevation.
## Model implementation
- Single well-mixed indoor-air node plus one 2R1C mass node for each opaque wall orientation, roof and exposed floor.
- Layer resistance uses metal + insulation + plywood plus the frozen surface films `h_i=8 W/m²K` and `h_o=25 W/m²K`.
- Opaque heat capacity uses `C=A Σ rho cp d`, including the thin metal in total assembly capacitance but not as a separate node.
- Opaque exterior solar uses the prior Admin brief's sol-air boundary `T_sa=T_out+alpha*I_POA/h_o`.
- Window conduction uses whole-window U-value; window solar uses `SHGC*A*I_POA` directly in the zone balance.
- Constant ACH infiltration uses pressure-aware outdoor density from `PSC`.
- 150 W continuous sensible occupancy gain is active in both modes.
- Backward Euler, 10-minute internal timestep. NASA hourly forcing is held constant through each hour; solar position is recomputed every 10 minutes.
- Jan 13-14 are warm-up only. All headline totals and metrics use Jan 15-17 exactly (72 h).
### Source-conflict note
The older Researcher report writes opaque absorbed solar as a source at the centered 2R1C mass node. A direct implementation produced physically implausible >100°C daytime temperatures in the highly insulated cases because exterior roof/wall solar effectively bypassed half the insulation. The previous Admin brief had already corrected this to an exterior sol-air boundary. That later treatment is therefore used here; this is a physics-consistency correction, not tuning to force scenario ordering.
## Headline results (Jan 15-17, 72 h)
| Scenario | Free min °C | Free max °C | Free mean °C | Hours 18–22 | Cold degree-h | Heating kWh | Peak kW | kWh/m² |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline Shelter | -31.8 | -1.9 | -16.6 | 0.0 | 2488.4 | 338.7 | 6.91 | 14.11 |
| Improved Envelope | -26.0 | -1.7 | -13.0 | 0.0 | 2233.2 | 125.6 | 2.63 | 5.23 |
| Passive-Optimized | -22.2 | 13.9 | -8.3 | 0.0 | 1890.4 | 74.3 | 1.70 | 3.09 |

## Baseline-relative comparisons
| Metric | Improved vs Baseline | Passive-Optimized vs Baseline |
|---|---:|---:|
| Heating energy reduction | 62.9% | 78.1% |
| Peak heating reduction | 61.9% | 75.4% |
| Cold degree-hour reduction | 10.3% | 24.0% |
| Increase in free-running hours 18–22°C | 0.0 h | 0.0 h |
| Minimum free-running temperature change | +5.8°C | +9.6°C |
| Envelope + infiltration loss reduction | 58.8% | 71.7% |

## Ideal-heating 72 h heat-flow breakdown
Loss values below are positive magnitudes of heat leaving the zone. Solar/internal values are gains.
| Scenario | Walls loss kWh | Roof | Floor | Windows | Infiltration | Window solar gain | Internal gain |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline Shelter | 122.6 | 56.2 | 61.4 | 49.9 | 73.6 | 14.2 | 10.8 |
| Improved Envelope | 49.5 | 17.5 | 24.8 | 23.8 | 34.3 | 13.6 | 10.8 |
| Passive-Optimized | 38.2 | 12.0 | 19.1 | 14.0 | 19.6 | 17.9 | 10.8 |

## Orientation-only diagnostic
With Scenario 03's envelope, U/SHGC, ACH and 3.00 m² glazing held fixed, rotating the primary glazing from east to south increased transmitted window solar from **10.66 kWh** to **17.87 kWh** (+67.5%) and reduced 72 h ideal heating from **81.35 kWh** to **74.26 kWh** (8.7% reduction). This diagnostic is not a fourth scenario.
## Sanity checks
- **sameWeatherAllScenarios:** True
- **sameGeometryAllScenarios:** True
- **windowAreaM2AllScenarios:** 3.0
- **scenario03RotatesRatherThanAddsGlazing:** True
- **higherInsulationReducesIdealModeConductiveLoss:** True
- **lowerACHReducesInfiltrationLoss:** True
- **windowSolarRespondsToOrientation:** True
- **ghiDniDhiNoDoubleCounting:** True
- **opaqueWallAreaExcludesWindows:** True
- **pressureAwareDensityUsesPSC:** True
- **warmupExcludedFromHeadlineMetrics:** True
- **fillValuesEnteredCalculations:** False
- **heatFlowSignConvention:** positive = heat entering indoor zone; losses reported as positive magnitudes of negative zone exchange
- **negativeHeatingEnergyFound:** False
- **comparisonPercentagesRecomputedFromRawValues:** True
- **maxZoneBalanceResidualW:** 3.0233593406592263e-12

## Caveats
- NASA POWER is gridded satellite/reanalysis data, not a shelter-mounted Leh weather station.
- Jan 15-17, 2025 is a fixed historical mid-winter demonstration window, not a statistically certified design period.
- The 18–22°C band is a project thermal-performance indicator, not ASHRAE 55 certification.
- Material values are representative reference properties, not manufacturer-certified panels.
- ACH values are comparative leakage assumptions, not measured airtightness or ventilation compliance.
- No snow-albedo enhancement, terrain/mountain shading, thermal bridges, moisture/condensation, CFD, FEM or detailed HVAC is modeled.
- Opaque absorbed-solar diagnostic energy is not an extra indoor-gain term; its indoor effect is already represented through the envelope heat flow.
- Free-running results remain below 18°C for all three cases during the reported severe-cold window; improved passive design reduces cold severity but does not eliminate the need for auxiliary heat.
