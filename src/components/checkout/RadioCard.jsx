import radioOff from '../../assets/icons/checkout/radio-off.svg'
import radioOn from '../../assets/icons/checkout/radio-on.svg'
import trash from '../../assets/icons/checkout/trash.svg'

// Cartão branco selecionável (endereço, cartão de crédito, PIX). O cartão INTEIRO seleciona ao clicar, menos os
// controles que ele traz dentro (lixeira, "Editar", seletor de parcelas), que cuidam do próprio clique. O botão com
// `role="radio"` é o que o teclado e o leitor de tela enxergam; as setas navegam entre as opções de um `radiogroup`.
// Quem usa este componente envolve os cartões de um mesmo grupo num <div role="radiogroup">.
export default function RadioCard({ checked, label, onSelect, onDelete, deleteLabel, children, className = '' }) {
  return (
    <div
      onClick={(event) => {
        if (!event.target.closest('button, select, a, input')) onSelect()
      }}
      className={`flex cursor-pointer gap-5 rounded-card border-2 border-card-border bg-white p-3 ${className}`}
    >
      {/* Só o cartão selecionado entra no Tab (padrão "roving tabindex"); as setas trocam a seleção. */}
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-label={label}
        tabIndex={checked ? 0 : -1}
        onClick={onSelect}
        className="flex h-full shrink-0 items-start rounded-full pt-1"
      >
        <img src={checked ? radioOn : radioOff} alt="" className="size-6" />
      </button>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
        {onDelete && (
          <button type="button" aria-label={deleteLabel} onClick={onDelete} className="shrink-0 rounded-card">
            <img src={trash} alt="" className="size-6" />
          </button>
        )}
      </div>
    </div>
  )
}
