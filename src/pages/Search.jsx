import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import filtersIcon from '../assets/icons/search/filters-toggle.svg'
import emptyLeaves from '../assets/images/search/empty-leaves.svg'
import Breadcrumb from '../components/Breadcrumb'
import Footer from '../components/Footer'
import Header from '../components/header/Header'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import FiltersPanel from '../components/search/FiltersPanel'
import Pagination from '../components/search/Pagination'
import SortSelect from '../components/search/SortSelect'
import { searchCatalog } from '../data/products'
import { PAGE_SIZE, activeFilterCount, buildParams, readFilters, searchProducts } from '../utils/search'

// Resultados de busca (/busca). Tudo o que a tela mostra (palavra, filtros, ordem e página) vem do endereço:
// ex. /busca?q=creme&area=Rosto&estrelas=5&ordem=menor-preco&pagina=2. Mudar um filtro volta para a página 1.
//
// Layout (Figma "Resultado de Pesquisa"):
//   - Faixa de 358px no topo com o mesmo cenário do banner da Home ("Botânica Renewal", parado; só as folhas balançam).
//     Fica FIXA atrás da página e a navbar fica transparente sobre ela; ao rolar, os resultados sobem por cima.
//   - "Resultados de busca para / “termo” (80)", e à direita "Mostrar/Ocultar filtros" e "Ordenar por".
//   - Filtros ocultos: 3 colunas de cards. À mostra: a coluna de filtros (com rolagem própria) e 2 colunas de cards.
export default function Search() {
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)
  const activeCount = activeFilterCount(filters)
  // Começa aberto se a busca já chega filtrada (ex.: clicando numa categoria do menu); senão, fechado como no Figma.
  const [showFilters, setShowFilters] = useState(() => activeCount > 0)
  const bannerEndRef = useRef(null)
  const panelId = useId()

  // `replace`: marcar vários filtros em sequência não deve encher o histórico (o "voltar" sairia da busca).
  const update = (changes) => setParams(buildParams(params, changes), { replace: true })

  const results = searchProducts(searchCatalog, filters)
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  // Uma página fora do intervalo (ex.: ?pagina=99, ou os filtros reduziram os resultados) cai na última.
  const page = Math.min(filters.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const visible = results.slice(start, start + PAGE_SIZE)
  // O que a pessoa pediu: a palavra digitada ou, vindo do menu da navbar, a categoria clicada.
  const term = filters.query || filters.types.join(', ')

  const hrefFor = (number) => `?${buildParams(params, { pagina: number === 1 ? null : number })}`

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      {/* A navbar fica transparente sobre a faixa e escurece quando a folha de resultados chega até ela. */}
      <Header heroRef={bannerEndRef} />

      {/* Faixa decorativa: o cenário da Home recortado em 358px (o Hero sobe 66px para mostrar selos, título e o topo dos
          frascos). `inert` + aria-hidden: nada dentro dela é focável nem lido (o título da página é o dos resultados). */}
      <div aria-hidden inert className="fixed inset-x-0 top-0 z-0 h-[358px] overflow-hidden">
        <Hero variant="banner" />
      </div>

      {/* A folha (z-10, fundo da página) começa abaixo da faixa e sobe por cima dela quando a página rola. pt-5: os 20px de
          respiro entre a faixa (358px) e a trilha (y=378). */}
      <div className="relative z-10 mt-[358px] bg-neutral-700">
        <div ref={bannerEndRef} aria-hidden />
        <main className="mx-auto max-w-content pb-[83px] pt-5">
          <Breadcrumb className="pl-1" items={[{ label: 'Página Inicial', to: '/' }, { label: term ? `“${term}”` : 'Busca' }]} />

          {/* Título e controles (y=410 no Figma: 7px abaixo da trilha). */}
          <div className="mt-[7px] flex items-center justify-between">
            <h1 className="py-2.5 font-bold text-red-300">
              {term ? (
                <>
                  <span className="block text-base font-medium">Resultados de busca para</span>
                  <span className="text-2xl">“{term}”</span>
                </>
              ) : (
                <span className="text-2xl">Todos os produtos</span>
              )}{' '}
              <span className="text-xl text-sand-300">({results.length})</span>
            </h1>

            <div className="flex items-center gap-10">
              <button
                type="button"
                aria-expanded={showFilters}
                aria-controls={panelId}
                onClick={() => setShowFilters((open) => !open)}
                className="flex items-center gap-1 rounded-card text-xl font-medium text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              >
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                {/* Fechado com filtros marcados, mostra quantos estão valendo (não aparece no Figma). */}
                {!showFilters && activeCount > 0 && (
                  <span className="ml-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-800 px-1.5 text-sm font-semibold text-neutral-700">
                    <span className="sr-only">(</span>
                    {activeCount}
                    <span className="sr-only"> {activeCount === 1 ? 'filtro ativo' : 'filtros ativos'})</span>
                  </span>
                )}
                <span className="p-2">
                  <img src={filtersIcon} alt="" className="size-5" />
                </span>
              </button>
              <SortSelect value={filters.sort} onChange={(sort) => update({ ordem: sort === 'relevancia' ? null : sort })} />
            </div>
          </div>

          {/* role="status": o leitor de tela anuncia a nova contagem quando um filtro muda. */}
          <p role="status" className="sr-only">
            {results.length === 0
              ? 'Nenhum resultado encontrado'
              : `Exibindo ${start + 1} a ${start + visible.length} de ${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
          </p>

          {/* 24px entre o título (que termina em y=486) e os cards (y=510). */}
          <div className={`mt-6 grid items-start ${showFilters ? 'grid-cols-[346px_minmax(0,1fr)] gap-x-[91px]' : 'grid-cols-1'}`}>
            {showFilters && (
              // A coluna acompanha a rolagem e tem rolagem própria (a barra fina à direita, como no Figma).
              <div
                id={panelId}
                className="sticky top-24 max-h-[calc(100dvh-120px)] animate-dropdown overflow-y-auto pr-8 [scrollbar-color:var(--color-neutral-400)_transparent] [scrollbar-width:thin] motion-reduce:animate-none"
              >
                <FiltersPanel filters={filters} onChange={update} />
              </div>
            )}

            <section aria-label="Resultados" className="flex flex-col">
              {visible.length > 0 ? (
                <ul className={`grid gap-y-[22px] ${showFilters ? 'grid-cols-2 gap-x-6' : 'grid-cols-3 gap-x-[25px]'}`}>
                  {visible.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              ) : (
                // Sem resultados (Figma): folhas, uma frase em destaque e um convite para tentar de novo.
                <div className={showFilters ? '' : 'pl-[87px]'}>
                  <div className="-ml-[53px] -mb-[92px] flex h-[269.328px] w-[381.594px] items-center justify-center" aria-hidden>
                    <img src={emptyLeaves} alt="" className="h-[188.459px] w-[345.263px] max-w-none rotate-[14.58deg]" />
                  </div>
                  <h2 className="relative max-w-[681px] font-heading text-[2.5rem] font-semibold leading-[normal] text-red-300">
                    Procuramos em todas as prateleiras, mas não encontramos nada{' '}
                    {term ? (
                      <>
                        para <span className="text-link">“{term}”</span>
                      </>
                    ) : (
                      'com esses filtros'
                    )}
                    .
                  </h2>
                  <p className="mt-4 max-w-[757px] text-xl font-semibold text-red-300">
                    Que tal tentar de novo ou dar uma olhada no que está em alta por aqui?
                  </p>
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
    </div>
  )
}
