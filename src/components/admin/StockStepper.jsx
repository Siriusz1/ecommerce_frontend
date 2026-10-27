import minus from '../../assets/icons/admin/minus.svg'
import plus from '../../assets/icons/admin/plus.svg'

const MAX_STOCK = 9999

// Contador de estoque: "−", o número (dá para digitar) e "+". Nunca passa de 0 para baixo.
//   variant="compact": o da linha de volume da tabela (caixa branca de borda dupla);
//   variant="field": o do formulário do produto (do tamanho de um campo, com o número no meio).
export default function StockStepper({ value, onChange, label, variant = 'compact', id }) {
  const set = (next) => onChange(Math.min(MAX_STOCK, Math.max(0, next)))
  const box =
    variant === 'field'
      ? 'flex h-[60px] w-[194px] justify-between rounded-card border border-card-border bg-field px-2'
      : 'inline-flex gap-[15px] rounded-card border-2 border-card-border bg-white p-1'

  return (
    <div role="group" aria-label={label} className={`items-center transition-shadow focus-within:shadow-ring ${box}`}>
      <button type="button" aria-label={`Diminuir ${label}`} disabled={value <= 0} onClick={() => set(value - 1)} className="rounded-card disabled:opacity-40">
        <img src={minus} alt="" className="size-6" />
      </button>
      <input
        id={id}
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => set(Number(event.target.value.replace(/\D/g, '')) || 0)}
        className={`bg-transparent text-center text-base font-medium text-red-300 outline-none ${variant === 'field' ? 'w-16' : 'w-6 min-w-[2ch] [field-sizing:content]'}`}
      />
      <button type="button" aria-label={`Aumentar ${label}`} disabled={value >= MAX_STOCK} onClick={() => set(value + 1)} className="rounded-card disabled:opacity-40">
        <img src={plus} alt="" className="size-6" />
      </button>
    </div>
  )
}
