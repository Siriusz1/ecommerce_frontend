import { useId, useState } from 'react'

// As 4 abas do Figma. Só "Como utilizar" tem conteúdo desenhado; as outras ficam com um aviso até
// existirem os textos (ingredientes, comentários e sustentabilidade).
const TABS = [
  { id: 'how-to-use', label: 'COMO UTILIZAR' },
  { id: 'ingredients', label: 'INGREDIENTES' },
  { id: 'reviews', label: 'COMENTÁRIOS' },
  { id: 'sustainability', label: 'SUSTENTABILIDADE' },
]

export default function ProductTabs({ product }) {
  const [activeId, setActiveId] = useState(TABS[0].id)
  const baseId = useId()

  // Padrão de abas do WAI-ARIA: setas esquerda/direita (e Home/End) movem o foco E selecionam a aba.
  const handleKeyDown = (event, index) => {
    const lastIndex = TABS.length - 1
    let next
    if (event.key === 'ArrowRight') next = index === lastIndex ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? lastIndex : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = lastIndex
    else return
    event.preventDefault()
    setActiveId(TABS[next].id)
    document.getElementById(`${baseId}-tab-${TABS[next].id}`)?.focus()
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <div role="tablist" aria-label="Informações do produto" className="flex items-center justify-between border-b border-red-100 px-1">
        {TABS.map((tab, index) => {
          const selected = tab.id === activeId
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              // Só a aba selecionada entra na ordem do Tab; as outras se alcançam pelas setas.
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              // -mb-px: o sublinhado de 2px da aba selecionada cobre a linha de 1px da barra, como no Figma.
              className={`-mb-px border-b-2 py-1 font-heading text-xl font-semibold transition-colors duration-200 ${
                selected ? 'border-red-300 text-red-300' : 'border-transparent text-red-100 hover:text-red-300'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="flex flex-col gap-4 text-base text-red-100"
        >
          {tab.id === 'how-to-use' ? (
            product.page.howToUse.map((step) => (
              <p key={step.label}>
                <strong className="font-bold">{step.label}</strong> {step.text}
              </p>
            ))
          ) : (
            <p className="text-red-100/70">Conteúdo em breve.</p>
          )}
        </div>
      ))}
    </div>
  )
}
