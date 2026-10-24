import { useRef } from 'react'
import BenefitsStrip from '../components/BenefitsStrip'
import CategoriesSection from '../components/CategoriesSection'
import EditorialSection from '../components/EditorialSection'
import FeaturedDuo from '../components/FeaturedDuo'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ProductCarousel from '../components/ProductCarousel'
import Header from '../components/header/Header'
import { duo, kits, launches, routine } from '../data/products'

export default function Home() {
  // O Header é fixo e transparente sobre o hero; ele observa este elemento para saber quando
  // a página rolou além dele e o fundo escuro deve entrar.
  const heroRef = useRef(null)

  return (
    // overflow-x-clip: a página ainda não tem layout para telas estreitas (o design é desktop). Sem isto, o rodapé,
    // agora fora do container de 1440px, faria a página rolar na horizontal quando a janela é menor que o conteúdo.
    <div className="overflow-x-clip">
      <Header heroRef={heroRef} />
      {/* O banner e o rodapé ocupam a largura toda da tela; por isso ficam FORA do container de 1440px abaixo. */}
      <Hero ref={heroRef} />

      {/* O conteúdo segue o frame desktop de 1440px do Figma; acima disso fica centralizado. */}
      <div className="mx-auto max-w-page overflow-x-clip">
        {/* 44px entre as seções, que é o espaçamento padrão do Figma. */}
        <main className="flex flex-col gap-11 pt-11">
          <ProductCarousel title="Lançamentos" products={launches} />
          <EditorialSection />
          {/* Kits e a vitrine do duo são um bloco só: ficam a 32px, e não a 44px, um do outro. */}
          <div className="flex flex-col gap-8">
            <ProductCarousel title="Kits" products={kits} />
            <FeaturedDuo products={duo} />
          </div>
          <CategoriesSection />
          <ProductCarousel title="Sua rotina" products={routine} />
          {/* O Figma deixa 60px acima desta faixa: 44px do gap + 16px extra. */}
          <div className="mt-4">
            <BenefitsStrip />
          </div>
        </main>
      </div>

      {/* mt-11 refaz os 44px que o `gap-11` do <main> dava antes de o rodapé sair de dentro dele. */}
      <div className="mt-11">
        <Footer />
      </div>
    </div>
  )
}
