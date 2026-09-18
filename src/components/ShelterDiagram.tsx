import type { Scenario } from '../types/thermal'
import { cardinalFromAzimuth, one, two } from '../utils/format'

export function ShelterDiagram({ scenario }: { scenario: Scenario }) {
  const c = scenario.configuration
  const angle = c.primaryGlazedFacadeAzimuthDeg - 90
  return (
    <div className="shelter-visual">
      <svg viewBox="0 0 720 470" role="img" aria-label={`Technical shelter diagram for ${scenario.name}`}>
        <g className="shelter-ground">
          <path d="M96 375 L339 452 L636 315 L397 246 Z" />
          <path d="M96 375 L96 386 L339 463 L636 326 L636 315" />
        </g>
        <g className="shelter-body">
          <path className="face face-left" d="M171 223 L397 293 L397 412 L171 342 Z" />
          <path className="face face-right" d="M397 293 L574 211 L574 330 L397 412 Z" />
          <path className="roof" d="M139 214 L362 147 L605 210 L397 307 Z" />
          <path className="roof-rib" d="M177 204 L397 272 L563 196" />
          <path className="window" d="M431 299 L523 257 L523 312 L431 355 Z" />
          <path className="door" d="M218 276 L284 296 L284 375 L218 355 Z" />
        </g>
        <g className="callouts">
          <path d="M257 174 L206 113 L88 113" /><circle cx="257" cy="174" r="3" />
          <text x="88" y="94">ROOF INSULATION</text><text className="value" x="88" y="120">{one(c.roofInsulationMm)} mm</text>
          <path d="M182 288 L112 286 L56 242" /><circle cx="182" cy="288" r="3" />
          <text x="24" y="221">WALL INSULATION</text><text className="value" x="24" y="247">{one(c.wallInsulationMm)} mm</text>
          <path d="M490 298 L598 258 L669 258" /><circle cx="490" cy="298" r="3" />
          <text x="585" y="235">WINDOW U-VALUE</text><text className="value" x="585" y="261">{two(c.windowUValueWm2K)} W/m²K</text>
          <path d="M333 427 L278 441 L200 441" /><circle cx="333" cy="427" r="3" />
          <text x="58" y="432">FLOOR INSULATION</text><text className="value" x="58" y="458">{one(c.floorInsulationMm)} mm</text>
        </g>
        <g className="compass" transform="translate(594 98)">
          <circle r="52" />
          <circle r="35" />
          <text x="0" y="-64">N</text><text x="64" y="5">E</text><text x="0" y="76">S</text><text x="-66" y="5">W</text>
          <g transform={`rotate(${angle})`}><path className="needle" d="M0 -38 L8 7 L0 0 L-8 7 Z" /></g>
          <text className="compass-label" x="0" y="100">PRIMARY GLAZING · {cardinalFromAzimuth(c.primaryGlazedFacadeAzimuthDeg)}</text>
        </g>
      </svg>
      <div className="diagram-caption">6.0 × 4.0 × 2.7 m · {one(c.windowAreaM2)} m² glazing · raised exposed floor</div>
    </div>
  )
}
