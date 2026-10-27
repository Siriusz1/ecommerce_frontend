import { useEffect, useId, useRef, useState } from 'react'
import chevron from '../../assets/icons/admin/filter-chevron.svg'
import FilterCheckbox from '../search/FilterCheckbox'
import { fieldClass } from './fieldClass'

// "Filtro por característica": escolhe, para cada grupo (Área de aplicação, Tipo de pele...), as opções que o produto
// tem. Um produto pode ter várias opções do mesmo grupo. O campo fechado resume a escolha ("Área de aplicação: Corpo,
// Rosto · Tipo de pele: Seca"); aberto, abaixo dele aparece a lista dos grupos com as caixinhas dos filtros da loja.
//   value: { [grupo]: [id das opções] }   groups: os grupos do painel (Categorias > Filtros por característica)
export default function FilterPicker({ id, value, groups, onChange, disabled = false, ...props }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const summary = groups
    .map((group) => {
      const labels = group.options.filter((option) => value[group.id]?.includes(option.id)).map((option) => option.label)
      return labels.length > 0 ? `${group.name}: ${labels.join(', ')}` : null
    })
    .filter(Boolean)
    .join(' · ')

  const toggle = (groupId, optionId) => {
    const current = value[groupId] ?? []
    const next = current.includes(optionId) ? current.filter((item) => item !== optionId) : [...current, optionId]
    onChange({ ...value, [groupId]: next })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className={`${fieldClass} relative flex h-[60px] items-center pr-12 text-left`}
        {...props}
      >
        <span className={`truncate ${summary ? '' : 'text-placeholder'}`}>{summary || 'Selecione as opções'}</span>
        <img src={chevron} alt="" className={`absolute right-2 top-1/2 size-6 -translate-y-1/2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Filtros por característica"
          className="absolute left-0 top-full z-20 mt-2 flex max-h-[360px] w-[420px] max-w-[calc(100vw-48px)] animate-dropdown flex-col gap-5 overflow-y-auto rounded-card border border-card-border bg-field p-4 shadow-ring"
        >
          {groups.length === 0 && <p className="text-base text-muted">Nenhum grupo cadastrado. Crie um em Categorias.</p>}
          {groups.map((group) => (
            <fieldset key={group.id} className="flex flex-col gap-3">
              <legend className="mb-3 text-base font-bold text-red-300">{group.name}</legend>
              {group.options.map((option) => (
                <FilterCheckbox key={option.id} checked={value[group.id]?.includes(option.id) ?? false} onChange={() => toggle(group.id, option.id)}>
                  {option.label}
                </FilterCheckbox>
              ))}
            </fieldset>
          ))}
        </div>
      )}
    </div>
  )
}
