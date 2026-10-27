import { useId } from 'react'
import chevron from '../../assets/icons/admin/filter-chevron.svg'
import searchIcon from '../../assets/icons/search-dark.svg'
import { fieldClass } from './fieldClass'

// Rótulo + campo (+ dica e erro). `children` é uma função que recebe as props de acessibilidade (`id`, `aria-*`) para
// espalhar no campo e ligar o rótulo a ele.
export function Field({ label, error, hint, labelClassName = 'text-[15px]', className = '', children }) {
  const id = useId()
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={`font-semibold text-red-300 ${labelClassName}`}>
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : undefined })}
      {hint && <p className="text-[13px] leading-normal text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}

// Lista de opções com a seta do Figma (<select> nativo: teclado e leitor de tela de graça).
export function Select({ options, className = '', height = 'h-12', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select {...props} className={`${fieldClass} ${height} appearance-none pr-10`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <img src={chevron} alt="" className="pointer-events-none absolute right-2 top-1/2 size-6 -translate-y-1/2" />
    </div>
  )
}

// Campo de busca com a lupa à direita.
export function SearchInput({ className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <input type="search" {...props} className={`${fieldClass} h-12 pr-12 [&::-webkit-search-cancel-button]:hidden`} />
      <img src={searchIcon} alt="" className="pointer-events-none absolute right-3 top-1/2 size-6 opacity-60 -translate-y-1/2" />
    </div>
  )
}
