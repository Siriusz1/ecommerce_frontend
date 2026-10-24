import arrowRight from '../assets/icons/arrow-right-small.svg'
import heroFade from '../assets/images/hero-fade.png'
import heroPhoto from '../assets/images/hero-photo.jpg'

export default function Hero({ ref }) {
  return (
    // Ocupa a tela toda. `dvh` (e não `vh`) acompanha a barra de endereço do celular, que aparece e some;
    // o min-h evita que o banner fique mais baixo que os 544px do Figma em janelas muito baixas.
    // A navbar é fixa e transparente por cima dele, então não se desconta a altura dela.
    <section ref={ref} className="relative h-[544px] w-full overflow-hidden">
      {/*
        A foto (2752x1536) é quase 16:9. Com o banner na proporção da tela ela quase não é cortada; em telas
        mais "quadradas" ou em retrato, object-cover corta os lados, e object-center mantém o frasco (que
        fica no meio da foto) à vista. (No Figma, com 1440x544, o recorte descia a foto para 73%.)
      */}
      <img src={heroPhoto} alt="" className="absolute inset-0 size-full object-cover object-center" />

      {/*
        Degradê do Figma a 36% de opacidade (escurece a faixa da navbar). Ele tem altura FIXA de 544px
        (a do desenho) e não a do banner: assim a sombra de cima continua do mesmo tamanho em qualquer
        tela, em vez de crescer e escurecer metade da foto. object-fill só estica o degradê na horizontal.
      */}
      <img
        src={heroFade}
        alt=""
        aria-hidden
        className="absolute inset-x-0 top-0 h-[544px] w-full object-fill opacity-36"
      />

      {/* 8.75vw = os 126px do Figma em 1440px de largura; o recuo acompanha a largura da tela. */}
      <div className="relative flex h-full flex-col justify-center pl-[8.75vw]">
        <h1 className="font-heading text-heading font-semibold text-white">LE PIQUE-NIQUE</h1>
        <a href="#" className="ml-[5px] flex items-end gap-2 font-heading text-base text-white">
          Confira agora
          <img src={arrowRight} alt="" className="h-5 w-6" />
        </a>
      </div>
    </section>
  )
}
