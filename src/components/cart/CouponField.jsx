import { useId, useRef, useState } from 'react'
import editIcon from '../../assets/icons/cart/coupon-edit.svg'
import ticketIcon from '../../assets/icons/cart/coupon-ticket.svg'
import { checkoutMessages } from '../../utils/checkoutValidation'

// Campo "Cupom de desconto". Como os campos do perfil, a caixa inteira é clicável (leva o foco ao texto) e tem o contorno
// de foco de 3px. Dois estados, como no Figma:
//   - sem cupom: o texto de dica "Cupom de desconto" e o ícone de ingresso;
//   - com cupom aplicado (`appliedCode`): o campo mostra o código e um lápis. Tocar nele (ou na caixa) libera a edição:
//     digitar outro código e "Aplicar" troca o cupom; apagar tudo e "Remover" o tira. Esc desiste.
// O Figma só desenha os ícones; para aplicar, Enter funciona e, assim que há algo para confirmar, o ícone dá lugar a um
// botão de texto (sem ele, quem só usa o mouse não teria como confirmar).
export default function CouponField({ appliedCode, onApply, onRemove }) {
  const [value, setValue] = useState('')
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState()
  const inputRef = useRef(null)
  const errorId = useId()

  const applied = Boolean(appliedCode)
  const showingApplied = applied && !editing
  const shown = showingApplied ? appliedCode : value
  const typed = shown.trim()

  const startEdit = () => {
    setValue(appliedCode)
    setEditing(true)
    // O campo só deixa de ser somente leitura depois deste render: o foco e a seleção do código vão no quadro seguinte.
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const stopEdit = () => {
    setEditing(false)
    setValue('')
    setError(undefined)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (showingApplied) return startEdit()
    if (applied && !typed) {
      onRemove()
      return stopEdit()
    }
    if (applied && typed.toUpperCase() === appliedCode) return stopEdit() // não mudou nada
    const result = onApply(value)
    if (result.ok) stopEdit()
    else setError(result.reason === 'EMPTY' ? 'Digite o código do cupom.' : checkoutMessages.couponInvalid)
  }

  // Texto do botão de confirmação (null = mostra só o ícone).
  const actionLabel = applied && editing && !typed ? 'Remover' : typed && !showingApplied ? 'Aplicar' : null

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <div
        onClick={(event) => {
          if (event.target.closest('button')) return
          if (showingApplied) startEdit()
          else inputRef.current?.focus()
        }}
        className={`flex h-16 cursor-text items-center justify-between gap-3 rounded-card border-2 bg-field px-3 transition-shadow duration-200 focus-within:shadow-ring motion-reduce:transition-none ${
          error ? 'border-error' : 'border-card-border'
        }`}
      >
        <input
          ref={inputRef}
          value={shown}
          readOnly={showingApplied}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && editing) stopEdit()
          }}
          onBlur={() => {
            // Saiu do campo sem mexer no código: volta a mostrá-lo (se mexeu, a pessoa ainda pode confirmar).
            if (editing && value === appliedCode) stopEdit()
          }}
          aria-label="Cupom de desconto"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="Cupom de desconto"
          autoCapitalize="characters"
          autoComplete="off"
          // Com o cupom aplicado o código aparece na cor da dica (Figma); ao editar, volta à cor do texto digitado.
          className={`min-w-0 flex-1 bg-transparent text-xl font-semibold outline-none placeholder:text-placeholder ${
            showingApplied ? 'cursor-text text-placeholder' : 'text-neutral-100'
          }`}
        />
        {actionLabel ? (
          <button type="submit" className="shrink-0 rounded-card text-xl font-semibold text-red-300">
            {actionLabel}
          </button>
        ) : (
          <button
            type="button"
            tabIndex={showingApplied ? 0 : -1}
            aria-label={showingApplied ? 'Editar cupom' : undefined}
            aria-hidden={showingApplied ? undefined : true}
            onClick={showingApplied ? startEdit : () => inputRef.current?.focus()}
            className="shrink-0 rounded-card"
          >
            <img src={applied ? editIcon : ticketIcon} alt="" className="size-6" />
          </button>
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
