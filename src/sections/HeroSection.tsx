import type { ThermalDataset } from '../types/thermal'
import { one } from '../utils/format'
import { TerrainMap } from '../components/TerrainMap'

export function HeroSection({ data }: { data: ThermalDataset }) {
  const w = data.weather.reported72h
  return (
    <section id="pilot" className="hero section-screen">
      <div className="hero-copy reveal">
        <div className="eyebrow">LEH PILOT · 3500 M</div>
        <h1>DESIGN SHELTERS<br/>FOR EXTREME CLIMATES.</h1>
        <p>Evaluate passive shelter configurations against site-specific winter conditions before physical prototyping.</p>
        <a className="primary-action" href="#configuration">EXPLORE LEH PILOT <span>→</span></a>
      </div>
      <div className="hero-map reveal delay-1"><TerrainMap /></div>
      <div className="weather-strip">
        <div><span>SOURCE</span><strong>NASA POWER</strong></div>
        <div><span>DEMONSTRATION WINDOW</span><strong>15–17 JAN 2025</strong></div>
        <div><span>MIN OUTDOOR</span><strong>{one(w.outdoorMinC)}°C</strong></div>
        <div><span>MEAN OUTDOOR</span><strong>{one(w.outdoorMeanC)}°C</strong></div>
      </div>
    </section>
  )
}
