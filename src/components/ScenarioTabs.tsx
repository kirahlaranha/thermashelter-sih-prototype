import type { Scenario, ScenarioId } from '../types/thermal'

export function ScenarioTabs({
  scenarios,
  selected,
  onSelect,
  compact = false,
}: {
  scenarios: Scenario[]
  selected: ScenarioId
  onSelect: (id: ScenarioId) => void
  compact?: boolean
}) {
  return (
    <div className={`scenario-tabs ${compact ? 'compact' : ''}`} role="tablist" aria-label="Shelter scenario">
      {scenarios.map((scenario, index) => (
        <button
          key={scenario.id}
          role="tab"
          aria-selected={selected === scenario.id}
          className={selected === scenario.id ? 'active' : ''}
          onClick={() => onSelect(scenario.id)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{scenario.id === 'optimized' ? 'OPTIMIZED' : scenario.id.toUpperCase()}</strong>
        </button>
      ))}
    </div>
  )
}
