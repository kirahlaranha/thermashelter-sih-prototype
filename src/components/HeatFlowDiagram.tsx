import type { Scenario } from '../types/thermal'
import { one } from '../utils/format'

export function HeatFlowDiagram({ scenario }: { scenario: Scenario }) {
  const losses = scenario.headlineHeatFlow72h.lossesKWh
  const gains = scenario.headlineHeatFlow72h.gainsKWh
  const max = Math.max(...Object.values(losses))
  const rows = [
    ['Walls', losses.walls], ['Roof', losses.roof], ['Floor', losses.floor], ['Windows', losses.windows], ['Infiltration', losses.infiltration],
  ] as const
  return (
    <div className="heat-flow-card">
      <div className="mini-heading"><span>72-HOUR HEAT FLOW</span><small>IDEAL HEATING · 20°C SETPOINT</small></div>
      <div className="flow-grid">
        <div className="flow-losses">
          <div className="flow-label">LOSSES</div>
          {rows.map(([label, value]) => <div className="flow-row" key={label}><span>{label}</span><div className="flow-track"><i style={{width:`${(value/max)*100}%`}} /></div><strong>{one(value)}</strong><em>kWh</em></div>)}
        </div>
        <div className="flow-gains">
          <div className="flow-label">GAINS</div>
          <div className="gain-number"><strong>+{one(gains.solar)}</strong><span>kWh</span><small>WINDOW SOLAR</small></div>
          <div className="gain-number"><strong>+{one(gains.internal)}</strong><span>kWh</span><small>INTERNAL</small></div>
        </div>
      </div>
    </div>
  )
}
