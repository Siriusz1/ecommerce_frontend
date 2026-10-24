import { useState } from 'react'
import { PRICE_BOUNDS } from '../../data/products'
import { formatPrice } from '../../utils/format'

// Aceita "50", "50,5", "R$ 1.250,00"...: com vírgula, o ponto é separador de milhar; sem vírgula, o ponto é decimal.
function parsePrice(text) {
  const cleaned = text.replace(/[^\d,.]/g, '')
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned
  const value = Number(normalized)
  return normalized !== '' && Number.isFinite(value) ? value : null
}

// Campo de preço. Em repouso mostra o valor formatado ("R$ 500,00"); ao focar, vira texto livre para digitar.
// O valor só é aplicado ao sair do campo ou com Enter (a cada tecla, a lista de produtos mudaria sozinha).
function PriceField({ label, value, onCommit }) {
  const [draft, setDraft] = useState(null) // null = não está editando

  const commit = () => {
    if (draft === null) return
    const parsed = parsePrice(draft)
    setDraft(null)
    if (parsed !== null) onCommit(parsed)
  }

  return (
    <label className="flex w-[141px] flex-col gap-[5px] rounded-input border-2 border-red-300 px-2 py-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-red-300">
      <span className="text-sm font-semibold text-red-100/50">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={draft ?? formatPrice(value)}
        onFocus={(event) => {
          setDraft(String(value).replace('.', ','))
          event.target.select()
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur() // o blur aplica o valor
          else if (event.key === 'Escape') setDraft(null) // descarta o que foi digitado
        }}
        className="w-full bg-transparent text-xl font-medium text-red-300 outline-none"
      />
    </label>
  )
}

// Faixa de preço. Os dois limites se respeitam: o mínimo nunca passa do máximo e vice-versa, e ambos ficam
// dentro da faixa do catálogo (R$ 0 a R$ 500).
export default function PriceRange({ min, max, onChange }) {
  const clamp = (value) => Math.min(Math.max(value, PRICE_BOUNDS.min), PRICE_BOUNDS.max)

  return (
    <div className="flex items-center gap-5" role="group" aria-label="Faixa de preço">
      <PriceField label="Mínimo" value={min} onCommit={(value) => onChange({ min: Math.min(clamp(value), max), max })} />
      <PriceField label="Máximo" value={max} onCommit={(value) => onChange({ min, max: Math.max(clamp(value), min) })} />
    </div>
  )
}
