import botanicals from '../assets/images/category-botanicos.png'
import essentials from '../assets/images/category-essenciais.png'
import skinTone from '../assets/images/category-tom-de-pele.png'
import Pill from './Pill'

// Faixa de largura total com 3 fotos de categoria. Os textos e pílulas são posicionados em px
// dentro de cada foto porque cada uma tem um canto diferente (o design não segue uma grade).
export default function CategoriesSection() {
  return (
    <section className="grid h-[545px] grid-cols-3">
      <article className="relative overflow-hidden">
        <img src={skinTone} alt="" className="absolute inset-0 size-full object-cover" />
        <p className="absolute left-[27px] top-[37px] w-[353px] text-xl tracking-snug text-white">
          Tecnologia e ativos botânicos unidos para uma pele radiante e saudável todos os dias.
        </p>
        <Pill className="absolute bottom-9 left-[27px] bg-red-400">Tom de pele</Pill>
      </article>

      <article className="relative overflow-hidden">
        <img src={botanicals} alt="" className="absolute inset-0 size-full object-cover" />
        {/*
          Escurece a base da foto para o texto branco ter contraste sobre o verde claro.
          Medido no Figma: a opacidade sobe de ~0 no topo a ~70% na base (não chega a preto sólido).
        */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <Pill className="absolute right-[37px] top-[26px] bg-red-400">Botânicos</Pill>
        <p className="absolute bottom-9 left-[47px] w-[353px] text-xl font-medium tracking-snug text-white">
          Ativos puros da natureza unidos à alta tecnologia dermatológica.
        </p>
      </article>

      <article className="relative overflow-hidden">
        <img src={essentials} alt="" className="absolute inset-0 size-full object-cover" />
        <Pill className="absolute left-11 top-[402px] bg-red-400">Essênciais</Pill>
        <p className="absolute bottom-[41px] left-[49px] w-[353px] text-xl tracking-snug text-white">
          Os indispensáveis para elevar a sua rotina de skincare todos os dias.
        </p>
      </article>
    </section>
  )
}
