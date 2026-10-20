import arrowRight from '../assets/icons/arrow-right-small.svg'
import heroFade from '../assets/images/hero-fade.png'
import heroPhoto from '../assets/images/hero-photo.jpg'

export default function Hero({ ref }) {
  return (
    <section ref={ref} className="relative h-[544px] overflow-hidden">
      {/*
        A foto (2752x1536) é mais alta que o hero (1440x544) depois de escalar para a largura toda.
        object-position em 73% desce o recorte para mostrar o frasco, como no Figma.
      */}
      <img src={heroPhoto} alt="" className="absolute inset-0 size-full object-cover object-[50%_73%]" />

      {/* Degradê do Figma a 36% de opacidade por cima da foto (escurece/uniformiza a faixa do menu). */}
      <img src={heroFade} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-36" />

      <div className="relative flex h-full flex-col justify-center pl-[126px]">
        <h1 className="font-heading text-heading font-semibold text-white">LE PIQUE-NIQUE</h1>
        <a href="#" className="ml-[5px] flex items-end gap-2 font-heading text-base text-white">
          Confira agora
          <img src={arrowRight} alt="" className="h-5 w-6" />
        </a>
      </div>
    </section>
  )
}
