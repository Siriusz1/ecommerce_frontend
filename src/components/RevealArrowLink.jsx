import arrowRight from '../assets/icons/arrow-right.svg'

// Link "texto + seta" do site ("Ver mais" nos carrosséis, "Confira as regras" nos benefícios). No repouso é só o texto
// (como no Figma). No hover/foco a seta nasce de dentro da borda direita do link: a janela `overflow-clip` abre de 0 a
// 24px e a seta fica colada no fim dela (justify-end), então a PONTA aparece primeiro e depois o corpo, como nos quadros
// de 8px -> 21px -> 24px do desenho; junto, o espaço de 12px entre texto e seta abre. A seta ainda desliza 8px de fora
// para dentro para o movimento parecer mais fluido. Se o link está encostado à direita (como o "Ver mais"), ele cresce
// para a esquerda e o texto desliza 36px: é o que o Figma desenha. Sem hover (celular) a seta não aparece.
export default function RevealArrowLink({ href = '#', className = '', children }) {
  return (
    <a href={href} className={`group flex items-center ${className}`}>
      {children}
      <span className="flex w-0 items-center justify-end overflow-clip transition-[width,margin] duration-400 ease-reveal group-hover:ml-3 group-hover:w-6 group-focus-visible:ml-3 group-focus-visible:w-6 motion-reduce:transition-none">
        <img
          src={arrowRight}
          alt=""
          className="size-6 max-w-none shrink-0 translate-x-2 opacity-0 transition-[transform,opacity] duration-400 ease-reveal group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
        />
      </span>
    </a>
  )
}
