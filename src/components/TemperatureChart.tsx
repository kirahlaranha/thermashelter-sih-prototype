import { useMemo, useRef, useState } from 'react'
import type { HourlyPoint } from '../types/thermal'
import { formatIST } from '../utils/format'

const W = 900
const H = 360
const P = { l: 58, r: 20, t: 24, b: 46 }
const Y_MIN = -40
const Y_MAX = 20

const xFor = (i: number, n: number) => P.l + (i / Math.max(1, n - 1)) * (W - P.l - P.r)
const yFor = (v: number) => P.t + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - P.t - P.b)

function pathFor(data: HourlyPoint[], field: 'outdoorC' | 'freeIndoorC') {
  return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i, data.length).toFixed(2)} ${yFor(d[field]).toFixed(2)}`).join(' ')
}

export function TemperatureChart({ data }: { data: HourlyPoint[] }) {
  const ref = useRef<SVGSVGElement | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const outdoor = useMemo(() => pathFor(data, 'outdoorC'), [data])
  const indoor = useMemo(() => pathFor(data, 'freeIndoorC'), [data])

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const localX = (e.clientX - box.left) * (W / box.width)
    const ratio = (localX - P.l) / (W - P.l - P.r)
    const i = Math.round(Math.max(0, Math.min(1, ratio)) * (data.length - 1))
    setHover(i)
  }

  const h = hover == null ? null : data[hover]
  const hx = hover == null ? 0 : xFor(hover, data.length)

  return (
    <div className="temperature-chart">
      <div className="chart-legend"><span className="legend-indoor">FREE-RUNNING INDOOR</span><span className="legend-outdoor">OUTDOOR</span><span className="target-key">18–22°C target band</span></div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label="72 hour outdoor and free-running indoor temperature chart">
        <rect className="target-band" x={P.l} y={yFor(20)} width={W-P.l-P.r} height={yFor(18)-yFor(20)} />
        {[-40,-30,-20,-10,0,10,20].map(v => <g key={v}><line className="gridline" x1={P.l} y1={yFor(v)} x2={W-P.r} y2={yFor(v)} /><text className="axis-label" x={P.l-12} y={yFor(v)+4} textAnchor="end">{v}°</text></g>)}
        {[0,24,48,71].map((i) => <g key={i}><line className="vgrid" x1={xFor(i,data.length)} y1={P.t} x2={xFor(i,data.length)} y2={H-P.b} /><text className="axis-label" x={xFor(i,data.length)} y={H-16} textAnchor={i===0?'start':i===71?'end':'middle'}>{formatIST(data[i].timestampIST).replace(',', ' ·')}</text></g>)}
        <path className="series outdoor" d={outdoor} />
        <path className="series indoor" d={indoor} />
        {h && <g className="hover-group"><line className="hover-line" x1={hx} y1={P.t} x2={hx} y2={H-P.b} /><circle className="hover-dot indoor-dot" cx={hx} cy={yFor(h.freeIndoorC)} r="5" /><circle className="hover-dot outdoor-dot" cx={hx} cy={yFor(h.outdoorC)} r="4" /></g>}
      </svg>
      {h && <div className="chart-tooltip" style={{ left: `${Math.min(78, Math.max(12, (hx/W)*100))}%` }}><strong>{formatIST(h.timestampIST)} IST</strong><span>Indoor <b>{h.freeIndoorC.toFixed(1)}°C</b></span><span>Outdoor <b>{h.outdoorC.toFixed(1)}°C</b></span></div>}
    </div>
  )
}
