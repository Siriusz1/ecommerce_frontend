import { useCallback, useEffect, useRef, useState } from 'react'
import arrowRight from '../assets/icons/arrow-right.svg'
import chevronLeft from '../assets/icons/chevron-left.svg'
import chevronRight from '../assets/icons/chevron-right.svg'
import ProductCard from './ProductCard'

function ChevronButton({ icon, label, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // As setas continuam visíveis nas pontas (como no design), só ficam apagadas e inertes.
      className="flex size-11 shrink-0 items-center justify-center transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
    >
      <img src={icon} alt="" className="size-6" />
    </button>
  )
}

export default function ProductCarousel({ title, products }) {
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    // 1px de tolerância: scrollLeft é fracionário em telas com zoom/DPR diferente de 1.
    setEdges({
      atStart: track.scrollLeft <= 1,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  // Avança exatamente um card (largura + gap) por clique; o scroll-snap do trilho acerta o resto.
  const scrollByCard = (direction) => {
    const track = trackRef.current
    const firstCard = track?.firstElementChild
    if (!firstCard) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: 'smooth' })
  }

  return (
    <section className="mx-auto flex w-full max-w-carousel flex-col gap-6">
      {/* relative z-10: fica acima do respiro invisível (pt-12) do trilho abaixo, para o link "Ver mais" continuar clicável. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1281px] items-end justify-between">
        <h2 className="font-heading text-heading font-semibold">{title}</h2>
        {/*
          No repouso (Figma) é só o texto. No hover/foco a seta nasce de dentro da borda direita: a janela
          `overflow-clip` abre de 0 a 24px e a seta fica colada no fim dela (justify-end), então a PONTA aparece primeiro e
          depois o corpo, como nos quadros de 8px -> 21px -> 24px; junto, o espaço de 12px entre texto e seta abre.
          O link cresce para a esquerda (ele está encostado na borda direita), por isso o texto desliza 36px: é o que o
          Figma desenha. A seta ainda desliza 8px de fora para dentro para o movimento parecer mais fluido.
          Sem hover (celular) a seta não aparece, como no repouso do desenho.
        */}
        <a href="#" className="group flex items-center justify-center pb-[5px] text-xl font-semibold">
          Ver mais
          <span className="flex w-0 items-center justify-end overflow-clip transition-[width,margin] duration-400 ease-reveal group-hover:ml-3 group-hover:w-6 group-focus-visible:ml-3 group-focus-visible:w-6 motion-reduce:transition-none">
            <img
              src={arrowRight}
              alt=""
              className="size-6 max-w-none shrink-0 translate-x-2 opacity-0 transition-[transform,opacity] duration-400 ease-reveal group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
            />
          </span>
        </a>
      </div>

      <div className="flex items-center">
        <ChevronButton icon={chevronLeft} label="Anterior" disabled={edges.atStart} onClick={() => scrollByCard(-1)} />
        <div
          ref={trackRef}
          onScroll={updateEdges}
          // O trilho rola na horizontal, o que também recorta na vertical. A animação do botão de sacola
          // sobe até ~40px acima do card (o tubo vem de cima), então damos 48px de respiro em cima (pt-12)
          // e o cancelamos com -mt-12: o layout não muda, mas o que transborda do card continua visível.
          className="-mt-12 flex min-w-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto pt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            // 3 cards visíveis: cada um ocupa (100% - 2 gaps de 24px) / 3.
            <ProductCard
              key={product.id}
              product={product}
              className="shrink-0 basis-[calc((100%-3rem)/3)] snap-start"
            />
          ))}
        </div>
        <ChevronButton icon={chevronRight} label="Próximo" disabled={edges.atEnd} onClick={() => scrollByCard(1)} />
      </div>
    </section>
  )
}
