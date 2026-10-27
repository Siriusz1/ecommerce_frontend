import { useRef } from 'react'
import EditToggleButton from './EditToggleButton'

// Campo do perfil. Em repouso é somente leitura (valor mascarado, texto cinza); o lápis o transforma em campo
// editável, e aí o lápis vira "Cancelar ✕" (o aspecto da barra não muda, como no Figma; só o texto digitado
// escurece). Sem `editable` (ex.: CPF) o fundo é mais escuro, sem borda e sem lápis.
export default function ProfileField({
  id,
  label,
  display,
  value,
  editable = true,
  editing = false,
  error,
  onToggleEdit,
  className = '',
  ...inputProps
}) {
  const messageId = `${id}-message`
  const inputRef = useRef(null)

  // A caixa inteira é clicável (não só o texto ou o lápis): em repouso, clicar nela começa a edição; já editando,
  // clicar na margem da caixa leva o foco ao texto. O botão (lápis / Cancelar) cuida do próprio clique.
  const handleBoxClick = (event) => {
    if (!editable || event.target.closest('button')) return
    if (!editing) onToggleEdit()
    // O <input> só deixa de ser readOnly depois da re-renderização; focar no próximo quadro evita focar um campo travado.
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  let frame = 'border-card-border bg-field text-neutral-300'
  if (!editable) frame = 'border-transparent bg-field-readonly text-neutral-300'
  else if (editing) frame = 'border-card-border bg-field text-neutral-100'
  if (error) frame = 'border-error bg-field text-neutral-100'

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xl font-semibold">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        <div
          onClick={handleBoxClick}
          // O foco é o contorno de 3px do Figma (o do formulário de senha aberto), em vez do anel escuro padrão.
          className={`flex h-[60px] items-center justify-between gap-3 rounded-card border-2 px-3 py-2.5 transition-shadow duration-200 motion-reduce:transition-none ${
            // Em repouso, clicar em qualquer ponto começa a edição (mãozinha); editando, é um campo de texto (cursor de texto).
            editable ? `focus-within:shadow-ring ${editing ? 'cursor-text' : 'cursor-pointer'}` : ''
          } ${frame}`}
        >
          {/* Um único <input> readOnly/editável: leitores de tela sempre leem o campo e o rótulo. */}
          <input
            ref={inputRef}
            id={id}
            readOnly={!editing}
            value={editing ? value : display}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? messageId : undefined}
            className="min-w-0 flex-1 cursor-[inherit] bg-transparent text-xl font-semibold outline-none placeholder:text-placeholder"
            {...inputProps}
          />
          {editable && (
            <EditToggleButton
              editing={editing}
              editLabel={`Editar ${label}`}
              cancelLabel={`Cancelar edição de ${label}`}
              aria-pressed={editing}
              onClick={onToggleEdit}
            />
          )}
        </div>
        {error && (
          <p id={messageId} role="alert" className="text-xl font-semibold text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
