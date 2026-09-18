import type { Scenario, ScenarioId } from '../types/thermal'
import { one, two } from '../utils/format'
import { ScenarioTabs } from '../components/ScenarioTabs'
import { TemperatureChart } from '../components/TemperatureChart'
import { HeatFlowDiagram } from '../components/HeatFlowDiagram'

export function AnalysisSection({ scenario, scenarios, selected, onSelect }: { scenario: Scenario; scenarios: Scenario[]; selected: ScenarioId; onSelect: (id: ScenarioId)=>void }) {
  const metrics = [
    ['FREE-RUN MIN', `${one(scenario.freeRunning.minIndoorTempC)}°C`],
    ['FREE-RUN MAX', `${one(scenario.freeRunning.maxIndoorTempC)}°C`],
    ['72 H HEATING', `${one(scenario.idealHeating.heatingEnergyKWh)} kWh`],
    ['PEAK HEATING', `${two(scenario.idealHeating.peakHeatingKW)} kW`],
  ]
  return (
    <section id="analysis" className="section-screen analysis-section screenshot-section">
      <div className="analysis-top">
        <div><span className="eyebrow">03 · THERMAL ANALYSIS</span><h2>{scenario.name}</h2><p>Leh · 72 h winter run · Precomputed thermal screening result</p></div>
        <ScenarioTabs scenarios={scenarios} selected={selected} onSelect={onSelect} compact />
      </div>
      <div className="analysis-layout">
        <div className="chart-card">
          <div className="mini-heading"><span>INDOOR vs OUTDOOR TEMPERATURE</span><small>FREE-RUNNING · IST</small></div>
          <TemperatureChart data={scenario.hourlySeries} />
        </div>
        <div className="metric-stack">{metrics.map(([label,value]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <HeatFlowDiagram scenario={scenario} />
      </div>
      <div className="analysis-note"><i /> All scenarios remain below the 18–22°C target band in free-running mode during this severe winter window. Passive design reduces cold severity and auxiliary heating demand; it does not eliminate heating.</div>
    </section>
  )
}
