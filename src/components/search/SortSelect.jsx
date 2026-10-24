import { useEffect, useId, useRef, useState } from 'react'
import chevron from '../../assets/icons/search/sort-chevron.svg'
import { SORTS } from '../../utils/search'

// "Ordenar por:" + seletor. O Figma só desenha o botão fechado ("Relevância"); a lista aberta (e as opções) é nossa.
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
    <div className="flex items-center gap-6">
      <span className="text-base font-medium">Ordenar por:</span>
      <div ref={rootRef} className="relative w-[181px]">
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
          className="flex w-full items-center justify-between rounded-card bg-red-300 p-2 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          {current.label}
          <img src={chevron} alt="" className="size-6" />
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
            className="absolute inset-x-0 top-full z-20 mt-1 flex animate-dropdown flex-col rounded-card bg-red-300 p-1 outline-none"
          >
            {SORTS.map((option, index) => (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option === current}
                onClick={() => choose(option)}
                onPointerEnter={() => setHighlighted(index)}
                className={`flex h-9 cursor-pointer items-center rounded-card px-1 text-base text-white transition-colors duration-150 ${
                  option === current ? 'font-bold' : 'font-medium'
                } ${index === highlighted ? 'bg-red-400' : ''}`}
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
