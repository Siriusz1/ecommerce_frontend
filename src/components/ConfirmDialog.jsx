import { useEffect, useId, useRef, useState } from 'react'
import Button from './Button'

// Modal de confirmação ("Excluir endereço?", "Remover da sacola?"...). Usa o <dialog> nativo com `showModal()`: o
// navegador já prende o foco dentro dele, deixa o resto da página inerte, fecha com Esc e devolve o foco ao botão que o
// abriu. O foco inicial vai para "Cancelar" (o botão seguro): Enter sem querer não apaga nada.
//   - Esc ou clique no fundo escuro = cancelar.
//   - `request` é null (fechado) ou { title, description, confirmLabel, onConfirm }.
export default function ConfirmDialog({ request, onCancel }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (request && !dialog.open) dialog.showModal()
    else if (!request && dialog.open) dialog.close()
  }, [request])

  // O texto fica guardado até o próximo pedido: enquanto o <dialog> fecha ele não pode ficar vazio de repente.
  const [shown, setShown] = useState(request)
  if (request && request !== shown) setShown(request)

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // O Esc dispara `cancel`: sem o preventDefault o navegador fecharia o <dialog> sozinho e o estado do pai ficaria
      // dessincronizado (o pedido continuaria "aberto").
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      // Esc: o evento `cancel` acima cobre o caso normal; este trata a tecla direto para funcionar também quando o
      // navegador não dispara o `cancel` (ex.: sem interação prévia com a página). Tab fica preso entre os dois botões.
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onCancel()
        } else if (event.key === 'Tab') {
          const buttons = [...event.currentTarget.querySelectorAll('button')]
          const first = buttons[0]
          const last = buttons[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }}
      // O <dialog> ocupa a tela toda por baixo do cartão: um clique que cai nele mesmo (e não no cartão) é no fundo escuro.
      onClick={(event) => event.target === event.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-32px)] max-w-[480px] animate-modal-in rounded-[10px] border-2 border-card-border bg-neutral-700 p-0 text-red-300 backdrop:animate-modal-backdrop backdrop:bg-red-800/60 motion-reduce:animate-none motion-reduce:backdrop:animate-none"
    >
      {shown && (
        <div className="flex flex-col gap-6 p-8">
          <div className="flex flex-col gap-3">
            <h2 id={titleId} className="font-heading text-2xl font-semibold">
              {shown.title}
            </h2>
            <p id={descriptionId} className="text-base text-red-100">
              {shown.description}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" autoFocus onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={shown.onConfirm}>
              {shown.confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  )
}
