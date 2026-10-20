// Campo de texto do design: caixa de 60px com borda de 2px e, opcionalmente, uma ação
// à direita (ex.: o olho de "mostrar senha") e uma mensagem embaixo.
//
// `error` e `hint` ocupam o mesmo lugar: quando há erro, ele substitui a dica (é assim que o
// Figma mostra o campo de senha do cadastro: dica normal -> mensagem vermelha).
export default function TextField({ id, label, hint, error, action, ...inputProps }) {
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-3">
      {/* O design só mostra o placeholder; o label fica oculto, mas leitores de tela o usam. */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {/* O foco é desenhado no contêiner (focus-within) porque o <input> não tem borda própria. */}
      <div
        className={`flex h-[60px] items-center justify-between gap-3 rounded-input border-2 px-3 py-2.5 focus-within:outline-2 focus-within:outline-offset-2 ${
          error ? 'border-error focus-within:outline-error' : 'border-red-300 focus-within:outline-red-300'
        }`}
      >
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent text-xl font-semibold text-red-300 outline-none placeholder:text-red-300/60"
          {...inputProps}
        />
        {action}
      </div>
      {message && (
        // role="alert" faz o leitor de tela anunciar o erro assim que ele aparece.
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={`text-xl font-semibold ${error ? 'text-error' : ''}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
