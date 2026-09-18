import type { Scenario, ScenarioId } from '../types/thermal'
import { cardinalFromAzimuth, one, two } from '../utils/format'
import { ScenarioTabs } from '../components/ScenarioTabs'
import { ShelterDiagram } from '../components/ShelterDiagram'

export function ConfigurationSection({ scenario, scenarios, selected, onSelect }: { scenario: Scenario; scenarios: Scenario[]; selected: ScenarioId; onSelect: (id: ScenarioId)=>void }) {
  const c = scenario.configuration
  const params = [
    ['ORIENTATION', cardinalFromAzimuth(c.primaryGlazedFacadeAzimuthDeg)],
    ['WALL INSULATION', `${one(c.wallInsulationMm)} mm`],
    ['ROOF INSULATION', `${one(c.roofInsulationMm)} mm`],
    ['FLOOR INSULATION', `${one(c.floorInsulationMm)} mm`],
    ['WINDOW U-VALUE', `${two(c.windowUValueWm2K)} W/m²K`],
    ['SHGC', two(c.shgc)],
    ['INFILTRATION', `${two(c.infiltrationACH)} ACH`],
    ['WINDOW AREA', `${two(c.windowAreaM2)} m²`],
  ]
  return (
    <section id="configuration" className="section-screen configuration-section">
      <div className="section-heading"><div><span className="eyebrow">02 · SHELTER CONFIGURATION</span><h2>Controlled design variants.</h2></div><p>Same geometry, weather and occupancy. Envelope quality, glazing, leakage and orientation change deliberately.</p></div>
      <ScenarioTabs scenarios={scenarios} selected={selected} onSelect={onSelect} />
      <div className="configuration-grid">
        <ShelterDiagram scenario={scenario} />
        <aside className="parameter-panel">
          <div className="parameter-title"><span>{scenario.label}</span><strong>{scenario.name}</strong></div>
          <div className="parameter-list">{params.map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          <div className="scenario-rationale"><span>DESIGN INTENT</span>{scenario.explanation.map(line => <p key={line}>{line}</p>)}</div>
        </aside>
      </div>
    </section>
  )
}
