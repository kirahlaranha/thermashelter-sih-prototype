import { productConfig } from '../config/product'

const links = [
  ['pilot', 'PILOT'],
  ['configuration', 'CONFIGURATION'],
  ['analysis', 'ANALYSIS'],
  ['comparison', 'COMPARISON'],
] as const

export function Header({ onMethodology }: { onMethodology: () => void }) {
  return (
    <header className="topbar">
      <a className="brand" href="#pilot" aria-label={`${productConfig.productName} home`}>
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>
          <strong>{productConfig.productName}</strong>
          <small>{productConfig.descriptor}</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <button className="text-button" onClick={onMethodology}>MODEL NOTES</button>
    </header>
  )
}
