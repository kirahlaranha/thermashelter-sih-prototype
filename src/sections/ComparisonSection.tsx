import type { ThermalDataset } from '../types/thermal'
import { one, percent1, two } from '../utils/format'
import { CompassSun } from '../components/CompassSun'

export function ComparisonSection({ data }: { data: ThermalDataset }) {
  const scenarios = data.scenarios
  const max = Math.max(...scenarios.map(s=>s.idealHeating.heatingEnergyKWh))
  const cmp = data.comparison.optimizedVsBaseline
  const orient = data.comparison.orientationOnlyDiagnostic
  return (
    <section id="comparison" className="section-screen comparison-section screenshot-section">
      <div className="section-heading comparison-head"><div><span className="eyebrow">04 · DESIGN COMPARISON</span><h2>Cut the heating burden.</h2></div><p>Same shelter geometry. Same severe Leh weather. Better envelope and solar-aware orientation reduce required auxiliary heat.</p></div>
      <div className="comparison-main">
        <div className="energy-compare">
          <div className="mini-heading"><span>72-HOUR HEATING ENERGY</span><small>IDEAL HEATING TO 20°C</small></div>
          <div className="energy-bars">{scenarios.map((s,i) => <div className={`energy-row ${s.id}`} key={s.id}><div className="energy-label"><span>{String(i+1).padStart(2,'0')}</span><strong>{s.name.toUpperCase()}</strong></div><div className="energy-track"><i style={{width:`${(s.idealHeating.heatingEnergyKWh/max)*100}%`}} /></div><div className="energy-value"><strong>{one(s.idealHeating.heatingEnergyKWh)}</strong><span>kWh</span></div></div>)}</div>
          <div className="impact-callouts">
            <div><strong>↓ {percent1(cmp.heatingEnergyReductionPct)}</strong><span>HEATING ENERGY</span></div>
            <div><strong>↓ {percent1(cmp.peakHeatingLoadReductionPct)}</strong><span>PEAK HEATING</span></div>
            <div><strong>↓ {percent1(cmp.envelopeAndInfiltrationLossReductionPct)}</strong><span>ENVELOPE + INFILTRATION LOSS</span></div>
          </div>
        </div>
        <aside className="orientation-card">
          <div className="mini-heading"><span>WHY ORIENTATION MATTERS</span><small>CONTROLLED DIAGNOSTIC · NOT A FOURTH SCENARIO</small></div>
          <div className="orientation-body">
            <CompassSun />
            <div className="orientation-copy"><p>Same optimized envelope, glazing, ACH and {two(data.geometry.totalWindowAreaM2)} m² window area.</p><div className="east-south"><span>EAST</span><b>→</b><span>SOUTH</span></div></div>
          </div>
          <div className="solar-line"><span>WINDOW SOLAR</span><strong>{two(orient.eastPrimaryWindowSolarKWh)} <b>→</b> {two(orient.southPrimaryWindowSolarKWh)} kWh</strong></div>
          <div className="orientation-stats"><div><strong>+{percent1(orient.windowSolarGainIncreaseSouthVsEastPct)}</strong><span>WINTER SOLAR GAIN</span></div><div><strong>−{percent1(orient.heatingEnergyReductionFromSouthOrientationPct)}</strong><span>HEATING ENERGY</span></div></div>
        </aside>
      </div>
      <div className="recommendation-band">
        <div><span>RECOMMENDATION</span><strong>PASSIVE-OPTIMIZED FOR LEH</strong></div>
        <ul><li>Higher-resistance envelope</li><li>Lower window U-value</li><li>Reduced infiltration assumption</li><li>South-oriented primary winter glazing</li></ul>
        <p>Passive measures do not remove the need for auxiliary heating during this severe winter period; they reduce the heating burden required to maintain 20°C.</p>
      </div>
    </section>
  )
}
