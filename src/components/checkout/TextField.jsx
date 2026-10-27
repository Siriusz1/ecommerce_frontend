import { useId } from 'react'

// Campo dos formulários do checkout (endereço, cartão): caixa de 60px com o contorno de foco de 3px e a mensagem de erro
// embaixo, como os campos do perfil. O nome do campo ("CEP", "Rua"...) é o próprio placeholder, sem título em cima, e os
// obrigatórios levam "*" ("CEP*"); o rótulo existe só para leitor de tela (sr-only), já que o placeholder some quando
// a pessoa digita. `optional` tira o asterisco.
export default function TextField({ label, optional = false, error, className = '', ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        placeholder={optional ? label : `${label}*`}
        aria-required={optional ? undefined : true}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-[60px] w-full rounded-card border-2 bg-field px-3 text-xl font-semibold text-neutral-100 outline-none transition-shadow duration-200 placeholder:text-placeholder focus:shadow-ring motion-reduce:transition-none ${
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
