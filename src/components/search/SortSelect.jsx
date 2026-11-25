import { useEffect, useId, useRef, useState } from 'react'
import chevron from '../../assets/icons/search/sort-chevron.svg'
import { SORTS } from '../../utils/search'

// "Ordenar por:" + seletor (Figma: o valor em marrom com a seta; aberta, a lista "Mais relevante / Mais recente / Maior
// preço / Menor preço" no fundo da página, com a opção escolhida no marrom claro).
// Segue o padrão "listbox" do WAI-ARIA, como o seletor de volume da tela de produto.
export default function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const current = SORTS.find((option) => option.value === value) ?? SORTS[0]

  const openList = () => {
    setHighlighted(Math.max(0, SORTS.indexOf(current)))
    setOpen(true)
  }
  const closeList = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true })
  }
  const choose = (option) => {
    onChange(option.value)
    closeList(true)
  }

  // Ao abrir, o foco vai para a lista para as setas funcionarem; clicar fora fecha.
  useEffect(() => {
    if (!open) return
    listRef.current?.focus({ preventScroll: true })
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [open])

  const handleListKeyDown = (event) => {
    const last = SORTS.length - 1
    if (event.key === 'ArrowDown') setHighlighted((index) => Math.min(index + 1, last))
    else if (event.key === 'ArrowUp') setHighlighted((index) => Math.max(index - 1, 0))
    else if (event.key === 'Home') setHighlighted(0)
    else if (event.key === 'End') setHighlighted(last)
    else if (event.key === 'Enter' || event.key === ' ') choose(SORTS[highlighted])
    else if (event.key === 'Escape') closeList(true)
    else if (event.key === 'Tab') setOpen(false) // deixa o Tab seguir para o próximo campo
    else return
    if (event.key !== 'Tab') event.preventDefault()
  }

  return (
    <div className="flex items-center gap-1 text-xl">
      <span className="font-medium text-red-300">Ordenar por:</span>
      <div ref={rootRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`Ordenar por: ${current.label}`}
          onClick={() => (open ? closeList() : openList())}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
            event.preventDefault()
            if (!open) openList()
          }}
          className="flex items-center gap-3 rounded-card p-2 font-semibold text-brown-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          {current.label}
          <img src={chevron} alt="" className={`size-6 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          // z-20: a lista cobre os cards, cujos botões de sacola/favorito têm z-10.
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Ordenar por"
            aria-activedescendant={`${listId}-${highlighted}`}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            // Figma: lista no fundo da página (sem caixa), logo abaixo do valor e alinhada à direita. A sombra suave é nossa: no
            // Figma a lista cai por cima dos cards e, sem ela, parece cortar o card de baixo.
            className="absolute right-0 top-full z-20 flex w-[207px] animate-dropdown flex-col items-center gap-2 rounded-card bg-neutral-600 py-2 shadow-[0_8px_24px_-8px_rgb(53_26_24/0.25)] outline-none"
          >
            {SORTS.map((option, index) => (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option === current}
                onClick={() => choose(option)}
                onPointerEnter={() => setHighlighted(index)}
                // A opção escolhida fica no marrom claro (Figma); a destacada pelo mouse/teclado ganha o fundo dos cartões.
                className={`flex h-9 w-[183px] cursor-pointer items-center rounded-card px-3 text-xl font-medium transition-colors duration-150 ${
                  option === current ? 'text-brown-400' : 'text-ink'
                } ${index === highlighted ? 'bg-card' : ''}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
