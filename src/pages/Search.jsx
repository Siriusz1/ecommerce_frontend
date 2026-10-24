import { useSearchParams } from 'react-router'
import heroPhoto from '../assets/images/hero-photo.jpg'
import bannerFade from '../assets/images/search/banner-fade.png'
import Breadcrumb from '../components/Breadcrumb'
import Footer from '../components/Footer'
import Header from '../components/header/Header'
import ProductCard from '../components/ProductCard'
import FiltersPanel from '../components/search/FiltersPanel'
import Pagination from '../components/search/Pagination'
import SortSelect from '../components/search/SortSelect'
import { searchCatalog } from '../data/products'
import { PAGE_SIZE, buildParams, readFilters, searchProducts } from '../utils/search'

// Faixa de foto de 358px no topo (a navbar fixa fica por cima dela). É a mesma foto do banner da Home, mais baixa e
// recortada: no Figma a imagem tem 224,5% da altura da faixa e sobe 53% dela, o que enquadra o frasco.
function SearchBanner() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-[358px] overflow-hidden">
      <img src={heroPhoto} alt="" className="absolute left-0 top-[-53.07%] h-[224.5%] w-full max-w-none object-cover" />
      {/* O mesmo degradê escuro da Home (36%), na altura da faixa. */}
      <img src={bannerFade} alt="" className="absolute inset-0 size-full object-fill opacity-36" />
    </div>
  )
}

// Resultados de busca (/busca). Tudo o que a tela mostra (palavra, filtros, ordem e página) vem do endereço:
// ex. /busca?q=creme&categoria=Rosto&estrelas=4&ordem=menor-preco&pagina=2. Mudar um filtro volta para a página 1.
export default function Search() {
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)

  // `replace`: marcar vários filtros em sequência não deve encher o histórico (o "voltar" sairia da busca).
  const update = (changes) => setParams(buildParams(params, changes), { replace: true })

  const results = searchProducts(searchCatalog, filters)
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  // Uma página fora do intervalo (ex.: ?pagina=99, ou os filtros reduziram os resultados) cai na última.
  const page = Math.min(filters.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const visible = results.slice(start, start + PAGE_SIZE)

  const hrefFor = (number) => `?${buildParams(params, { pagina: number === 1 ? null : number })}`

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      {/* Sem `heroRef`: nesta tela a navbar é sempre a escura (no Figma ela aparece transparente sobre a foto). */}
      <Header />
      <SearchBanner />

      {/* pt-[378px]: 358px de banner + 20px de respiro até a trilha (y=378). */}
      <main className="relative mx-auto max-w-content pb-[83px] pt-[378px]">
        <Breadcrumb className="mb-3" items={[{ label: 'Página Inicial', to: '/' }, { label: 'Busca' }]} />

        <div className="grid grid-cols-[411px_minmax(0,1fr)] items-start gap-x-6">
          <FiltersPanel filters={filters} onChange={update} />

          <section aria-label="Resultados" className="flex flex-col">
            <div className="flex items-center justify-between">
              {/* p-2.5 + gap de 10px: o respiro do bloco de título do Figma. */}
              <div className="flex flex-col gap-2.5 p-2.5 text-red-300">
                <h1 className="text-xl font-bold">
                  {filters.query ? `Resultados de busca para “${filters.query}”` : 'Resultados de busca'}
                </h1>
                {/* role="status": o leitor de tela anuncia a nova contagem quando um filtro muda. */}
                <p role="status" className="text-base font-medium opacity-60">
                  {results.length === 0
                    ? 'Nenhum resultado encontrado'
                    : `Exibindo: ${start + 1}-${start + visible.length} de ${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
                </p>
              </div>
              <SortSelect value={filters.sort} onChange={(sort) => update({ ordem: sort === 'relevancia' ? null : sort })} />
            </div>

            {visible.length > 0 ? (
              <ul className="mt-2 grid grid-cols-2 gap-x-[25px] gap-y-[22px]">
                {visible.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              // O Figma não desenha o estado sem resultados.
              <div className="mt-2 flex flex-col items-start gap-4 rounded-card border-2 border-neutral-500 p-8">
                <p className="text-xl font-semibold">Não encontramos produtos com esses filtros.</p>
                <p className="text-base">Tente outra palavra ou remova alguns filtros.</p>
                <button
                  type="button"
                  onClick={() => update({ q: null, categoria: null, estrelas: null, pele: null, min: null, max: null })}
                  className="text-xl font-semibold underline"
                >
                  Limpar busca e filtros
                </button>
              </div>
            )}

            <div className="mt-7">
              <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
