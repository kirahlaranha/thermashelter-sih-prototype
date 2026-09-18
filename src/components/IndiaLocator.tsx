import { useState } from 'react'
import indiaOutline from '../assets/india-natural-earth.svg'

export function IndiaLocator() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`india-locator${hovered ? ' is-hovered' : ''}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label="India locator showing Leh in Ladakh"
    >
      <div className="india-map-frame" aria-hidden="true">
        <img src={indiaOutline} alt="" />
        <span className="india-leh-pulse" />
        <span className="india-leh-dot" />
      </div>
      <div className="india-locator-copy">
        <span>INDIA</span>
        <strong>LEH · LADAKH</strong>
        <small>34.1526° N / 77.5770° E</small>
      </div>
    </div>
  )
}
