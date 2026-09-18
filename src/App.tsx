import { useMemo, useState } from 'react'
import rawData from './data/thermal_static_results.json'
import type { ScenarioId, ThermalDataset } from './types/thermal'
import { Header } from './components/Header'
import { MethodologyDrawer } from './components/MethodologyDrawer'
import { HeroSection } from './sections/HeroSection'
import { ConfigurationSection } from './sections/ConfigurationSection'
import { AnalysisSection } from './sections/AnalysisSection'
import { ComparisonSection } from './sections/ComparisonSection'

const data = rawData as ThermalDataset

export default function App() {
  const [selected, setSelected] = useState<ScenarioId>('optimized')
  const [methodologyOpen, setMethodologyOpen] = useState(false)
  const scenario = useMemo(() => data.scenarios.find(s => s.id === selected) ?? data.scenarios[2], [selected])

  return (
    <div className="app-shell">
      <Header onMethodology={() => setMethodologyOpen(true)} />
      <main>
        <HeroSection data={data} />
        <ConfigurationSection scenario={scenario} scenarios={data.scenarios} selected={selected} onSelect={setSelected} />
        <AnalysisSection scenario={scenario} scenarios={data.scenarios} selected={selected} onSelect={setSelected} />
        <ComparisonSection data={data} />
      </main>
      <footer><span>DRDO · SIH26051</span><p>Physics-based reduced-order thermal screening model · Precomputed demonstrator · Comparative engineering estimates only.</p><a href="#pilot">BACK TO TOP ↑</a></footer>
      <MethodologyDrawer open={methodologyOpen} onClose={() => setMethodologyOpen(false)} data={data} />
    </div>
  )
}
