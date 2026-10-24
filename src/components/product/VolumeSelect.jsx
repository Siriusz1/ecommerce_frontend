import { useEffect, useId, useRef, useState } from 'react'
import chevron from '../../assets/icons/product/select-chevron.svg'

// Medidas do Figma: o botão é só uma linha de 47px (sublinhado de 2px); o painel de opções começa logo abaixo dele, com
// bordas nas laterais e embaixo, e cada opção tem 33px de altura com 10px entre elas. Para 3 opções o painel dá 140px
// e o conjunto aberto, 187px. As opções ficam centradas no painel (13,5px acima da 1ª opção e 7,5px abaixo da última).
const BUTTON_HEIGHT = 47
const OPTION_HEIGHT = 33
const OPTION_GAP = 10
const panelHeight = (count) => 21 + count * OPTION_HEIGHT + (count - 1) * OPTION_GAP

// Seletor de volume. Fechado, é a linha "15 ml ⌄" sublinhada. Aberto, o painel de opções se abre colado embaixo e
// EMPURRA o que vem depois (os botões de compra descem), como no desenho. Escolher uma opção atualiza o
// rótulo e fecha; clicar fora ou Esc também fecham. Segue o padrão "listbox" do WAI-ARIA para teclado
// e leitor de tela.
export default function VolumeSelect({ options, value, onChange, label = 'Volume' }) {
  const [open, setOpen] = useState(false)
  // Opção destacada pelo teclado (as setas movem; Enter escolhe). O mouse destaca pelo :hover.
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const openList = () => {
    setHighlighted(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }
  const closeList = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true })
  }
  const choose = (option) => {
    onChange(option)
    closeList(true)
  }

  // Ao abrir, o foco vai para a lista para as setas funcionarem; clicar fora fecha.
  useEffect(() => {
    if (!open) return
    // preventScroll: a lista fica dentro de um contêiner com overflow-hidden que ainda está começando a abrir (47px).
    // Sem isso o navegador ROLA esse contêiner por dentro para mostrar a lista e depois ele volta: era o "pulo" que o
    // seletor dava ao abrir (o botão subia ~90px e descia de novo).
    listRef.current?.focus({ preventScroll: true })
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [open])

  const handleListKeyDown = (event) => {
    const last = options.length - 1
    if (event.key === 'ArrowDown') setHighlighted((current) => Math.min(current + 1, last))
    else if (event.key === 'ArrowUp') setHighlighted((current) => Math.max(current - 1, 0))
    else if (event.key === 'Home') setHighlighted(0)
    else if (event.key === 'End') setHighlighted(last)
    else if (event.key === 'Enter' || event.key === ' ') choose(options[highlighted])
    else if (event.key === 'Escape') closeList(true)
    else if (event.key === 'Tab') setOpen(false) // deixa o Tab seguir para o próximo campo
    else return
    if (event.key !== 'Tab') event.preventDefault()
  }

  const height = open ? BUTTON_HEIGHT + panelHeight(options.length) : BUTTON_HEIGHT

  return (
    <div
      ref={rootRef}
      // A altura é animada (a mesma da pilha de baixo): é isso que faz os botões descerem suavemente.
      // overflow-hidden esconde o painel enquanto fechado, sem ele ocupar espaço.
      style={{ height }}
      className="relative w-[194px] overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
    >
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={label}
        aria-activedescendant={open ? `${listId}-${highlighted}` : undefined}
        tabIndex={-1}
        inert={!open}
        onKeyDown={handleListKeyDown}
        style={{ top: BUTTON_HEIGHT, height: panelHeight(options.length) }}
        // O painel começa logo abaixo da linha do botão e fica escondido pelo overflow-hidden do contêiner enquanto
        // este tem 47px; `inert` o tira do Tab e dos leitores de tela. As bordas (laterais e de baixo) fecham o
        // painel na linha do botão, como no Figma.
        className="absolute inset-x-0 flex flex-col gap-2.5 rounded-b-card border-x-2 border-b-2 border-red-300 px-3 pt-[13.5px] outline-none"
      >
        {options.map((option, index) => {
          const selected = option === value
          return (
            <div
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={selected}
              onClick={() => choose(option)}
              onPointerEnter={() => setHighlighted(index)}
              // 170px (e não os 166px que sobram): é a largura do Figma, que deixa 14px à esquerda e 10px à direita.
              // Selecionada: fundo bege cheio. Destacada pelo mouse/teclado: o mesmo bege mais leve.
              className={`flex h-[33px] w-[170px] shrink-0 cursor-pointer items-center rounded-[2px] px-2.5 text-xl text-red-300 transition-colors duration-150 ${
                selected ? 'bg-neutral-500' : open && index === highlighted ? 'bg-neutral-500/50' : ''
              }`}
            >
              {option}
            </div>
          )
        })}
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${value}`}
        onClick={() => (open ? closeList() : openList())}
        // Seta para baixo/cima também abre a lista (Enter e Espaço já abrem, pelo clique nativo do botão).
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
          event.preventDefault()
          if (!open) openList()
        }}
        // O anel de foco fica POR DENTRO (offset negativo): o overflow-hidden do contêiner cortaria um anel por fora.
        className="absolute inset-x-0 top-0 flex h-[47px] items-center justify-between border-b-2 border-red-300 px-2.5 text-xl text-red-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-red-300"
      >
        {value}
        {/* Fechado a seta aponta para baixo; aberto, para cima (o Figma desenha assim). Ela gira em vez de trocar. */}
        <img
          src={chevron}
          alt=""
          className={`size-6 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}
