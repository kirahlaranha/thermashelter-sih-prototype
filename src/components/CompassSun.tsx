export function CompassSun() {
  return (
    <svg className="sun-compass" viewBox="0 0 240 180" role="img" aria-label="Compass and winter sun path from east to south-facing glazing">
      <circle className="compass-ring" cx="92" cy="94" r="54" />
      <line className="compass-cross" x1="92" y1="34" x2="92" y2="154" /><line className="compass-cross" x1="32" y1="94" x2="152" y2="94" />
      <text x="92" y="24" textAnchor="middle">N</text><text x="165" y="99">E</text><text x="92" y="172" textAnchor="middle">S</text><text x="15" y="99">W</text>
      <path className="sun-path" d="M153 91 C180 73 180 145 91 150" />
      <circle className="sun" cx="174" cy="104" r="9" />
      <path className="orientation-arrow" d="M151 89 C142 120 122 141 97 148" />
    </svg>
  )
}
