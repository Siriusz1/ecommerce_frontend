import { useEffect, useId, useRef, useState } from 'react'
import plusWhite from '../../assets/icons/admin/plus-white-sm.svg'
import Button from '../Button'
import { fieldClass } from './fieldClass'

const MESSAGES = { DUPLICATE: 'Já existe um grupo com esse nome.', EMPTY: 'Digite um nome para o grupo.' }

// Modal "Novo grupo" (Admin > Categorias > Filtros por característica). Mesmo padrão do ConfirmDialog: <dialog> nativo com
// showModal() (fundo escurecido, resto da página inerte, foco preso dentro), Esc ou clique no fundo cancelam.
// Quem usa só o monta enquanto está aberto, então cada abertura começa com o campo vazio.
//   onCreate(nome) -> { ok, reason }: cria o grupo; com ok o pai fecha o modal.   onCancel: fecha sem criar.
export default function NewGroupDialog({ onCreate, onCancel }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()
  const errorId = useId()
  const [name, setName] = useState('')
  const [error, setError] = useState()

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const submit = (event) => {
    event.preventDefault()
    const result = onCreate(name)
    if (!result.ok) setError(MESSAGES[result.reason] ?? MESSAGES.EMPTY)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onCancel()
        } else if (event.key === 'Tab') {
          // Tab circula só entre o campo e os botões do modal.
          const focusable = [...event.currentTarget.querySelectorAll('input, button')]
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }}
      onClick={(event) => event.target === event.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-32px)] max-w-[520px] animate-modal-in rounded-[10px] border-2 border-card-border bg-neutral-700 p-0 text-red-300 backdrop:animate-modal-backdrop backdrop:bg-red-800/60 motion-reduce:animate-none motion-reduce:backdrop:animate-none"
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-3">
          <h2 id={titleId} className="font-heading text-2xl font-semibold">
            Novo grupo
          </h2>
          <p id={descriptionId} className="text-base text-red-100">
            Um grupo reúne opções para o cliente filtrar a busca, como “Tipo de pele”. Depois de criar, adicione as opções dele.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${titleId}-name`} className="text-base font-semibold">
            Nome do grupo
          </label>
          <input
            id={`${titleId}-name`}
            // O modal acabou de ser aberto pelo botão "Novo grupo": o cursor já vai para o nome.
            autoFocus
            value={name}
            placeholder="Ex: Tipo de cabelo"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setName(event.target.value)
              setError(undefined)
            }}
            className={`${fieldClass} h-12 ${error ? 'border-error' : ''}`}
          />
          {error && (
            <p id={errorId} role="alert" className="text-sm font-semibold text-error">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" icon={plusWhite}>
            Criar grupo
          </Button>
        </div>
      </form>
    </dialog>
  )
}
