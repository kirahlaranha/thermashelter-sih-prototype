import type { ThermalDataset } from '../types/thermal'

export function MethodologyDrawer({ open, onClose, data }: { open: boolean; onClose: () => void; data: ThermalDataset }) {
  return (
    <div className={`drawer-shell ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close model notes" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Model notes">
        <div className="drawer-head"><span>MODEL DISCLOSURE</span><button onClick={onClose}>CLOSE ×</button></div>
        <h2>Comparative screening,<br/>not certification.</h2>
        <p>{data.modelDisclosure}</p>
        <div className="method-lines">
          <div><span>MODEL</span><strong>Reduced-order transient thermal screening</strong></div>
          <div><span>WEATHER</span><strong>{data.weather.source}</strong></div>
          <div><span>WINDOW</span><strong>15–17 JAN 2025 · 72 H reported period</strong></div>
          <div><span>LIMITS</span><strong>No CFD, FEM, structural, moisture or detailed HVAC validation</strong></div>
        </div>
        <p className="drawer-note">NASA POWER is a gridded data source. The fixed mid-winter window and material/leakage assumptions are for comparative engineering demonstration.</p>
      </aside>
    </div>
  )
}
