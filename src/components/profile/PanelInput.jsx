// Campo de texto "solto" dos painéis de troca de e-mail e senha: borda escura, fundo transparente (estilo dos
// campos abertos do Figma), com a mensagem de erro embaixo quando houver. O rótulo só existe para leitor de
// tela: visualmente o próprio placeholder (com "*") diz o que digitar, como no desenho.
export default function PanelInput({ id, label, error, type = 'text', ...props }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-message` : undefined}
        placeholder={`${label}*`}
        className={`h-[60px] w-full rounded-card border-2 bg-field px-3 text-xl font-semibold text-neutral-100 outline-none transition-shadow duration-200 placeholder:text-neutral-300 focus:shadow-ring motion-reduce:transition-none ${
          error ? 'border-error' : 'border-card-border'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-message`} role="alert" className="text-xl font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}
