import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import bagSmall from '../../assets/icons/bag-sm.svg'
import searchDark from '../../assets/icons/search-dark.svg'
import searchSmall from '../../assets/icons/search-sm.svg'

// Sem backend de busca, as sugestões são fixas (as mesmas do Figma). O texto digitado aparece
// como 1ª linha destacada; as demais ficam sempre visíveis, em vez de filtradas pelo texto.
const SUGGESTIONS = ['Kit verão', 'Le Pique-Nique', 'Hidratantes']

// Tempo da animação de fechar (o `search-panel-out` e o `search-bar-out` do index.css somam isto). A caixa só
// é desmontada depois dele; se mudar os tempos lá, ajuste aqui.
const CLOSE_MS = 340
// Cada sugestão entra um pouco depois da anterior, já com o painel quase aberto (ver `search-row-in`).
const ROW_START_MS = 240
const ROW_STEP_MS = 55

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A abertura é uma sequência só (como nos quadros do Figma: lupa -> barra pequena -> barra inteira -> painel
// descendo -> sugestões aparecendo), feita com `clip-path` para o conteúdo nunca ser esticado ou refeito:
//   1. a barra se revela da direita para a esquerda, a partir da lupa do cabeçalho;
//   2. o painel desce de trás da barra (começa antes de a barra terminar, por isso parece uma coisa só);
//   3. as sugestões entram em cascata.
// Fechar é o caminho de volta, mais rápido. `onClosing` avisa o cabeçalho para já devolver o menu de categorias.
export default function SearchBox({ onClose, onClosing }) {
  const [query, setQuery] = useState('')
  const [closing, setClosing] = useState(false)
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const closeTimer = useRef()
  const closingRef = useRef(false)

  // A caixa só existe aberta: o foco vai direto para o campo de texto.
  useEffect(() => {
    inputRef.current?.focus()
    return () => clearTimeout(closeTimer.current)
  }, [])

  // Só o Header desmonta a caixa, depois da animação. `restoreFocus` pede a ele para devolver o foco à lupa.
  const requestClose = useCallback(
    (restoreFocus = false) => {
      if (closingRef.current) return
      closingRef.current = true
      setClosing(true)
      onClosing?.()
      closeTimer.current = setTimeout(() => onClose(restoreFocus), prefersReducedMotion() ? 0 : CLOSE_MS)
    },
    [onClose, onClosing],
  )

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) requestClose()
    }
    const closeOnEscape = (event) => {
      // `true` pede ao Header para devolver o foco ao botão de busca (quem usa teclado não se perde).
      if (event.key === 'Escape') requestClose(true)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [requestClose])

  // Buscar (Enter, lupa ou clicar numa sugestão) leva à tela de resultados e fecha a caixa. Busca vazia não faz nada.
  const search = (text) => {
    const term = text.trim()
    if (!term) return
    navigate(`/busca?q=${encodeURIComponent(term)}`)
    requestClose()
  }

  return (
    // Posicionada em x=340px (logo de 292px + margem de 48px, como no Figma) por cima do menu de categorias, que
    // continua no lugar, só transparente: assim a barra cresce SOBRE ele em vez de empurrá-lo. O max-w reserva o
    // espaço do grupo de ícones da direita em telas estreitas.
    <div ref={rootRef} className="absolute left-[340px] top-3.5 h-11 w-[787px] max-w-[calc(100%-590px)]">
      {/*
        A lista é um painel de 250px que nasce em y=0, atrás da barra de texto: os 60px de padding
        no topo escondem a parte coberta pela barra (44px) mais 16px de respiro.
      */}
      <div
        className={`absolute inset-x-0 top-0 flex flex-col gap-3 rounded-card bg-neutral-700 px-3 pb-[22px] pt-[60px] text-base font-medium text-neutral-200 motion-reduce:animate-none ${
          closing ? 'animate-search-panel-out' : 'animate-search-panel-in'
        }`}
      >
        {query.trim() && (
          <button
            type="button"
            onClick={() => search(query)}
            className="flex items-center gap-2 rounded-card bg-neutral-500 p-2 text-left"
          >
            <img src={searchSmall} alt="" className="size-5" />
            {query.trim()}
          </button>
        )}
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => search(suggestion)}
            // O atraso de cada linha vem do estilo (o da classe é 0); depois de entrar, a linha fica parada.
            style={{ animationDelay: `${ROW_START_MS + index * ROW_STEP_MS}ms` }}
            className="flex animate-search-row items-center rounded-card text-left transition-colors hover:bg-neutral-500/50 motion-reduce:animate-none"
          >
            <span className="flex items-center justify-end p-[7.273px]">
              <img src={bagSmall} alt="" className="size-[17.455px]" />
            </span>
            {suggestion}
          </button>
        ))}
      </div>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          search(query)
        }}
        className={`relative flex h-11 items-center justify-between rounded-t-card bg-neutral-500 pl-4 pr-2 motion-reduce:animate-none ${
          closing ? 'animate-search-bar-out' : 'animate-search-bar-in'
        }`}
      >
        <input
          ref={inputRef}
          // type="text" (e não "search") para o Chrome não desenhar o "×" nativo, que não existe no design.
          type="text"
          enterKeyHint="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar produtos"
          placeholder="Buscar produtos"
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-neutral-100 outline-none placeholder:text-neutral-100/60"
        />
        <button type="submit" aria-label="Buscar" className="flex items-center justify-end rounded-card p-2.5">
          <img src={searchDark} alt="" className="size-6" />
        </button>
      </form>
    </div>
  )
}
