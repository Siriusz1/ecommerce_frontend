import { useRef, useState } from 'react'
import fieldEdit from '../../assets/icons/admin/field-edit.svg'
import { parseMoney } from '../../utils/admin'
import { formatPrice } from '../../utils/format'

// Preço editável direto na linha do volume (tabela de produtos e lista de volumes do produto). Parece um campo (borda,
// fundo branco e o lápis) para deixar claro que dá para mudar. Como o contador de estoque ao lado, a mudança vale na hora:
// salva ao sair do campo ou com Enter; Esc desfaz o que foi digitado. Um valor inválido não é salvo e mostra o motivo.
//   value: preço atual   promoPrice: o promocional do volume (o preço de venda precisa continuar maior que ele)
//   onCommit(preço): grava o novo preço   label: para leitor de tela
export default function PriceInput({ value, promoPrice, onCommit, label }) {
  const [text, setText] = useState(formatPrice(value))
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState()
  const cancelled = useRef(false) // Esc: o blur que vem em seguida não deve salvar
  const justFocused = useRef(false) // o clique que deu foco não pode desfazer a seleção do valor

  // Fora da edição o campo acompanha o valor salvo (ex.: mudou em outra tela).
  const shown = editing ? text : formatPrice(value)

  const commit = () => {
    setEditing(false)
    if (cancelled.current) {
      cancelled.current = false
      return
    }
    const parsed = parseMoney(text)
    if (parsed === null || parsed <= 0) {
      setError('Digite um preço maior que zero.')
      return
    }
    if (promoPrice && parsed <= promoPrice) {
      setError(`Precisa ser maior que o promocional (${formatPrice(promoPrice)}).`)
      return
    }
    setError(undefined)
    if (parsed !== value) onCommit(parsed)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="relative w-[132px]">
        <input
          inputMode="decimal"
          aria-label={label}
          aria-invalid={error ? true : undefined}
          title="Clique para alterar o preço"
          value={shown}
          onFocus={(event) => {
            setText(formatPrice(value))
            setEditing(true)
            setError(undefined)
            // Seleciona tudo: digitar já substitui o preço. O mouseup do clique desfaria a seleção, por isso ele é ignorado.
            event.target.select()
            justFocused.current = true
          }}
          onMouseUp={(event) => {
            if (justFocused.current) event.preventDefault()
            justFocused.current = false
          }}
          onChange={(event) => setText(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
            if (event.key === 'Escape') {
              cancelled.current = true
              setText(formatPrice(value))
              setError(undefined)
              setEditing(false)
              event.currentTarget.blur()
            }
          }}
          className={`h-9 w-full rounded-card border-2 bg-white pl-2.5 pr-8 text-base font-medium text-red-800 outline-none transition-[border-color,box-shadow] duration-200 hover:border-red-300/50 focus:border-card-border focus:shadow-ring motion-reduce:transition-none ${
            error ? 'border-error' : 'border-card-border'
          }`}
        />
        <img src={fieldEdit} alt="" className="pointer-events-none absolute right-2 top-1/2 size-[18px] -translate-y-1/2" />
      </div>
      {error && (
        <p role="alert" className="w-[180px] text-xs font-semibold leading-tight text-error">
          {error}
        </p>
      )}
      {!error && promoPrice ? <p className="text-xs text-muted">Promocional: {formatPrice(promoPrice)}</p> : null}
    </div>
  )
}
