import { useEffect, useState } from 'react'
import { IndiaLocator } from './IndiaLocator'
import { TerrainScene } from './TerrainScene'

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function TerrainMap() {
  const [supportsWebGL, setSupportsWebGL] = useState(false)
  const [webglReady, setWebglReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [beaconHovered, setBeaconHovered] = useState(false)

  useEffect(() => {
    setSupportsWebGL(webglAvailable())
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  return (
    <div className={`terrain-wrap${webglReady ? ' is-webgl-ready' : ''}`} aria-label="Stylized high-altitude terrain visualization for the Leh reference site">
      <div className="terrain-atmosphere" aria-hidden="true" />
      <div className="terrain-fallback" aria-hidden="true">
        <svg viewBox="0 0 900 650" preserveAspectRatio="xMidYMid slice">
          <path d="M-30 530 L105 410 L185 452 L306 276 L392 354 L520 190 L603 262 L735 102 L930 315 V700 H-30 Z" />
          <path d="M-40 578 L145 470 L248 506 L365 365 L470 425 L596 297 L684 338 L804 214 L940 349" />
          <g>
            {Array.from({ length: 10 }).map((_, i) => <line key={`fh-${i}`} x1="10" y1={180 + i * 42} x2="890" y2={180 + i * 42} />)}
            {Array.from({ length: 12 }).map((_, i) => <line key={`fv-${i}`} x1={65 + i * 72} y1="120" x2={65 + i * 72} y2="640" />)}
          </g>
        </svg>
      </div>
      {supportsWebGL && (
        <div className="terrain-canvas-shell" aria-hidden="true">
          <TerrainScene reducedMotion={reducedMotion} onBeaconHover={setBeaconHovered} onReady={() => setWebglReady(true)} />
        </div>
      )}
      <IndiaLocator />
      <div className={`leh-terrain-label${beaconHovered ? ' is-active' : ''}`}>
        <i />
        <div>
          <span>LEH REFERENCE SITE</span>
          <strong>34.1526° N · 77.5770° E</strong>
          <small>≈3500 M</small>
        </div>
      </div>
      <div className="terrain-classification"><span>HIGH-ALTITUDE</span><span>COLD-ARID</span></div>
      <div className="terrain-disclaimer">STYLIZED HIGH-ALTITUDE TERRAIN</div>
      <div className="terrain-north" aria-hidden="true"><span>N</span><i /></div>
    </div>
  )
}
