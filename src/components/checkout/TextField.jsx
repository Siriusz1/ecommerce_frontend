import { useId } from 'react'

// Campo dos formulários do checkout (endereço, cartão): rótulo em cima, caixa de 60px, contorno de foco de 3px e a
// mensagem de erro embaixo, como os campos do perfil.
export default function TextField({ label, error, className = '', ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xl font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-[60px] w-full rounded-card border-2 bg-field px-3 text-xl font-semibold text-neutral-100 outline-none transition-shadow duration-200 placeholder:text-neutral-300 focus:shadow-ring motion-reduce:transition-none ${
          error ? 'border-error' : 'border-card-border'
        }`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="text-base font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}
