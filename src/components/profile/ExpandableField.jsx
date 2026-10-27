import { useEffect, useRef } from 'react'
import EditToggleButton from './EditToggleButton'

// Campo de "Dados de acesso" (e-mail e senha). Em repouso é uma barra somente leitura com um lápis; o lápis
// abre, logo abaixo e colado nela, um painel com os campos da troca (e o botão de salvar). Aberto, o lápis vira
// "Cancelar ✕": clicar nele fecha o painel (o chamador descarta o que foi digitado).
export default function ExpandableField({
  id,
  label,
  display,
  // Para a senha, os asteriscos são só enfeite e o leitor de tela não deve lê-los; o e-mail mascarado, sim.
  decorativeDisplay = false,
  open,
  onToggle,
  openLabel,
  closedLabel,
  // Travado: só mostra o valor (sem lápis nem painel), com um aviso do porquê (ex.: o e-mail do administrador).
  locked = false,
  lockedHint,
  children,
}) {
  const panelId = `${id}-panel`
  const panelRef = useRef(null)

  // Ao abrir, o foco vai para o 1º campo do painel. `preventScroll`: o painel está dentro de um recorte (overflow) que
  // acabou de começar a abrir, e focar sem isso faria o recorte rolar por dentro (o conteúdo "pulava" por um instante).
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector('input')?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [open])

  // A barra inteira abre o painel (não só o lápis). Fechar é só pelo "Cancelar": um clique perdido na barra não
  // deve descartar o que a pessoa digitou. O botão trata do próprio clique.
  const handleBarClick = (event) => {
    if (!open && !event.target.closest('button')) onToggle()
  }

  if (locked) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xl font-semibold">{label}</span>
        <div className="flex h-16 items-center rounded-card border-2 border-card-border bg-field-readonly px-3 py-2.5 text-xl font-semibold text-neutral-300">
          {display}
        </div>
        {lockedHint && <p className="text-base text-muted">{lockedHint}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xl font-semibold">{label}</span>
      {/*
        Aberto, a barra e o painel formam UM bloco: um contorno de 3px (#E9E6CC) em volta de tudo, como no Figma.
        O overflow-clip só vale aberto, para os cantos do painel não vazarem do contorno arredondado.
      */}
      <div
        className={`flex flex-col transition-shadow duration-300 motion-reduce:transition-none ${
          open ? 'overflow-clip rounded-[6px] bg-white shadow-ring' : 'shadow-[0_0_0_0_var(--color-ring)]'
        }`}
      >
        {/* Aberta, a barra perde a borda de baixo (o painel começa ali): 62px em vez dos 64px do repouso. */}
        <div
          onClick={handleBarClick}
          className={`flex items-center justify-between gap-3 border-2 border-card-border bg-field px-3 py-2.5 text-xl font-semibold text-neutral-300 transition-shadow duration-200 focus-within:shadow-ring motion-reduce:transition-none ${
            open ? 'h-[62px] rounded-t-card border-b-0' : 'h-16 cursor-pointer rounded-card'
          }`}
        >
          <span aria-hidden={decorativeDisplay || undefined}>{display}</span>
          <EditToggleButton
            editing={open}
            editLabel={closedLabel}
            cancelLabel={openLabel}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
          />
        </div>

        {/* Abre/fecha animando a altura (grid-rows 0fr -> 1fr); `inert` tira os campos escondidos do Tab. */}
        <div
          ref={panelRef}
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            {/* pt-[35px]: o Figma deixa 35px entre o topo do painel e o 1º campo; embaixo, 24px + a borda. */}
            <div className="flex flex-col items-end gap-3 rounded-b-card border-x-2 border-b-2 border-card-border bg-panel px-3 pb-6 pt-[35px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
