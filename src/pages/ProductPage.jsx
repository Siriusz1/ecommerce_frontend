import { Link, useParams } from 'react-router'
import Breadcrumb from '../components/Breadcrumb'
import Footer from '../components/Footer'
import Header from '../components/header/Header'
import ProductBuyBox from '../components/product/ProductBuyBox'
import ProductMedia from '../components/product/ProductMedia'
import ProductTabs from '../components/product/ProductTabs'
import { findProduct } from '../data/products'

// Tela de produto (/produto/:id). Duas colunas: à ESQUERDA (846px) as fotos e as abas, que rolam com a
// página; à DIREITA (412px) o painel de compra, que fica FIXO na tela enquanto o resto rola.
export default function ProductPage() {
  const { id } = useParams()
  const product = findProduct(id)

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      {/* Sem `heroRef`: nesta tela a navbar é sempre a escura. */}
      <Header />

      {product ? (
        // pt-[92px]: a trilha de navegação começa 20px abaixo da navbar fixa (72px) e ocupa 20px; o conteúdo
        // vem 12px depois (mb-3), em y=124, como no Figma.
        // pb-[101px]: com os 22px do rodapé, dá os 123px que o Figma deixa até ele (o conteúdo começa em y=124 e o
        // rodapé continua em y=2147). O texto do "Passo 2" tem um espaço em fonte maior que o deixa uns 6px mais
        // alto lá; aqui compensamos para o rodapé cair no mesmo lugar.
        <main className="mx-auto max-w-content pb-[101px] pt-[92px]">
          <Breadcrumb
            className="mb-3"
            items={[
              { label: 'Página Inicial', to: '/' },
              // Ainda não existe tela de categoria: o link leva para a busca já filtrada por ela.
              { label: product.page.category, to: `/busca?categoria=${encodeURIComponent(product.page.category)}` },
              { label: product.name },
            ]}
          />
          {/* items-start é essencial: sem ele a coluna da direita esticaria até a altura da esquerda e o
              `sticky` não teria por onde se mover. */}
          <div className="flex items-start gap-[22px]">
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <ProductMedia images={product.gallery} title={product.name} />
              <ProductTabs product={product} />
            </div>

            {/*
              Painel fixo. `sticky top-[92px]` o prende 20px abaixo da navbar (72px) assim que a rolagem o
              alcança; antes disso ele acompanha a página e começa na posição do Figma. Em janelas baixas, o
              max-h + overflow-y-auto deixa os botões alcançáveis rolando só o painel. O p-1/-m-1 dá espaço
              para o anel de foco dos botões não ser cortado por esse overflow.
            */}
            <aside className="sticky top-[92px] -m-1 max-h-[calc(100dvh-92px)] w-[420px] shrink-0 self-start overflow-y-auto p-1">
              <ProductBuyBox product={product} />
            </aside>
          </div>
        </main>
      ) : (
        // Endereço sem produto correspondente (o Figma não desenha este caso).
        <main className="mx-auto flex max-w-content flex-col items-start gap-4 pb-[55px] pt-[164px]">
          <h1 className="font-heading text-heading font-semibold">Produto não encontrado</h1>
          <Link to="/" className="text-xl font-semibold underline">
            Voltar para o início
          </Link>
        </main>
      )}

      <Footer />
    </div>
  )
}
