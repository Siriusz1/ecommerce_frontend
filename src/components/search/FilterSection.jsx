import { useId, useState } from 'react'
import chevron from '../../assets/icons/search/accordion-chevron.svg'

// Seção do painel de filtros: o título é um botão que abre/fecha o conteúdo. No Figma a seta aparece sempre
// para baixo (inclusive nas seções abertas), por isso ela não gira; quem usa leitor de tela ouve o estado por aria-expanded.
export default function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          // leading-[30px]: o Figma dá 30px de altura ao título (o `normal` da fonte rende 29px), e é o que
          // empurra cada seção para o lugar certo (1px a mais por título, acumulando até "Avaliação").
          className="flex w-full items-start justify-between rounded-card text-left font-heading text-2xl font-semibold leading-[30px] text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          {title}
          <img src={chevron} alt="" className="size-6" />
        </button>
      </h3>

      {/* Abre/fecha animando a altura (grid-rows 0fr -> 1fr); `inert` tira o conteúdo escondido do Tab. */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {/* pt-5: os 20px entre o título e as opções (dentro do recorte, para fecharem juntos). */}
          <div className="pt-5">{children}</div>
        </div>
      </div>
    </section>
  )
}
