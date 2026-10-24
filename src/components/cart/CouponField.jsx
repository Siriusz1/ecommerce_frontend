import { useId, useRef, useState } from 'react'
import pencil from '../../assets/icons/profile/pencil.svg'
import { checkoutMessages } from '../../utils/checkoutValidation'

// Campo "Cupom de desconto". Como os campos do perfil, a caixa inteira é clicável (leva o foco ao texto) e tem o contorno
// de foco de 3px. O Figma só desenha o lápis; para aplicar o cupom, Enter funciona e, assim que há texto, o lápis dá
// lugar a um botão "Aplicar" (sem ele, quem usa só o mouse não teria como confirmar).
export default function CouponField({ onApply }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState()
  const inputRef = useRef(null)
  const errorId = useId()

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onApply(value)
    if (result.ok) {
      setValue('')
      setError(undefined)
    } else {
      setError(result.reason === 'EMPTY' ? 'Digite o código do cupom.' : checkoutMessages.couponInvalid)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <div
        onClick={(event) => !event.target.closest('button') && inputRef.current?.focus()}
        className={`flex h-16 cursor-text items-center justify-between gap-3 rounded-card border-2 bg-field px-3 transition-shadow duration-200 focus-within:shadow-ring motion-reduce:transition-none ${
          error ? 'border-error' : 'border-card-border'
        }`}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
          aria-label="Cupom de desconto"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="Cupom de desconto"
          autoCapitalize="characters"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-xl font-semibold text-neutral-100 outline-none placeholder:text-neutral-300"
        />
        {value.trim() ? (
          <button type="submit" className="shrink-0 rounded-card text-xl font-semibold text-red-300">
            Aplicar
          </button>
        ) : (
          <img src={pencil} alt="" className="size-6 shrink-0" />
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-base font-semibold text-error">
          {error}
        </p>
      )}
    </form>
  )
}
