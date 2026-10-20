import { useEffect, useRef, useState } from 'react'
import bagSmall from '../../assets/icons/bag-sm.svg'
import searchDark from '../../assets/icons/search-dark.svg'
import searchSmall from '../../assets/icons/search-sm.svg'

// Sem backend de busca, as sugestões são fixas (as mesmas do Figma). O texto digitado aparece
// como 1ª linha destacada; as demais ficam sempre visíveis, em vez de filtradas pelo texto.
const SUGGESTIONS = ['Kit verão', 'Le Pique-Nique', 'Hidratantes']

export default function SearchBox({ onClose }) {
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  // A caixa só existe aberta: o foco vai direto para o campo de texto.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose()
    }
    const closeOnEscape = (event) => {
      // `true` pede ao Header para devolver o foco ao botão de busca (quem usa teclado não se perde).
      if (event.key === 'Escape') onClose(true)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const pickSuggestion = (text) => {
    setQuery(text)
    inputRef.current?.focus()
  }

  return (
    // mr-auto encosta a busca no logo (x = 340px, como no Figma) em vez de centralizá-la entre o
    // logo e o grupo da direita; assim ela não "anda" quando esse grupo muda de largura
    // (ex.: "Login" é mais curto que "Olá, Letícia!").
    <div ref={rootRef} className="relative mr-auto h-11 w-[787px] min-w-0 shrink">
      {/*
        A lista é um painel de 250px que nasce em y=0, atrás da barra de texto: os 60px de padding
        no topo escondem a parte coberta pela barra (44px) mais 16px de respiro.
      */}
      <div className="absolute inset-x-0 top-0 flex animate-dropdown flex-col gap-3 rounded-card bg-neutral-700 px-3 pb-[22px] pt-[60px] text-base font-medium text-neutral-200">
        {query.trim() && (
          <button
            type="button"
            onClick={() => pickSuggestion(query.trim())}
            className="flex items-center gap-2 rounded-card bg-neutral-500 p-2 text-left"
          >
            <img src={searchSmall} alt="" className="size-5" />
            {query.trim()}
          </button>
        )}
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => pickSuggestion(suggestion)}
            className="flex items-center rounded-card text-left transition-colors hover:bg-neutral-500/50"
          >
            <span className="flex items-center justify-end p-[7.273px]">
              <img src={bagSmall} alt="" className="size-[17.455px]" />
            </span>
            {suggestion}
          </button>
        ))}
      </div>

      {/* Ainda não existe página de resultados: enviar o formulário não navega (só evita o reload). */}
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative flex h-11 items-center justify-between rounded-t-card bg-neutral-500 pl-4 pr-2"
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
