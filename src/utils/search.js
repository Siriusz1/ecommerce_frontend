import { CATEGORIES, HAIR_AREAS, HAIR_TYPES, SKIN_TYPES, TYPES } from '../data/products'

// 18 fecha as linhas tanto na grade de 3 colunas (filtros ocultos) quanto na de 2 (filtros à mostra).
export const PAGE_SIZE = 18

// As opções do Figma, na ordem dele. "Mais recente" = o fim do catálogo primeiro (os itens novos entram no fim da lista).
export const SORTS = [
  { value: 'relevancia', label: 'Mais relevante' },
  { value: 'recente', label: 'Mais recente' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'menor-preco', label: 'Menor preço' },
]

// Notas do filtro "Avaliação" (Figma: de 5 a 1 estrela). Marcar várias soma os resultados (ex.: 5 e 4 estrelas).
export const RATINGS = [5, 4, 3, 2, 1]

// Sem acento e em minúsculas: "hidratação" encontra "Hidratacao" e vice-versa.
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

// Toda a tela é guiada pelo endereço (/busca?q=...&area=Rosto&estrelas=5&estrelas=4...): recarregar, voltar e
// compartilhar o link mantêm a busca. Esta função traduz os parâmetros em filtros, ignorando valores inválidos.
export function readFilters(params) {
  const number = (key, fallback) => {
    const raw = params.get(key)
    const value = Number(raw)
    return raw !== null && raw !== '' && Number.isFinite(value) ? value : fallback
  }
  const sort = params.get('ordem')
  const areas = CATEGORIES.filter((area) => params.getAll('area').includes(area))

  return {
    query: (params.get('q') ?? '').trim(),
    types: TYPES.filter((type) => params.getAll('tipo').includes(type)), // "Categoria": as do menu da navbar
    categories: areas, // "Área de aplicação"
    // Tipo de pele fica sempre à mostra (Figma). Tipo de cabelo só existe com a área Cabelo marcada: um valor solto no
    // endereço (de uma área já desmarcada) é ignorado em vez de filtrar às escondidas.
    skinTypes: SKIN_TYPES.filter((type) => params.getAll('pele').includes(type)),
    hairTypes: areas.some((area) => HAIR_AREAS.includes(area)) ? HAIR_TYPES.filter((type) => params.getAll('cabelo').includes(type)) : [],
    ratings: RATINGS.filter((stars) => params.getAll('estrelas').includes(String(stars))),
    sort: SORTS.some((option) => option.value === sort) ? sort : SORTS[0].value,
    page: Math.max(1, Math.floor(number('pagina', 1))),
  }
}

// Quantos filtros estão marcados (o botão "Mostrar filtros" mostra esse número quando o painel está fechado).
export const activeFilterCount = (filters) =>
  filters.types.length + filters.categories.length + filters.skinTypes.length + filters.hairTypes.length + filters.ratings.length

// Aplica `changes` (ex.: { area: ['Rosto'], estrelas: [5], pele: null }) sobre os parâmetros atuais.
// `null`/vazio remove o parâmetro, e qualquer mudança volta para a página 1 (a menos que `pagina` venha junto).
export function buildParams(current, changes) {
  const next = new URLSearchParams(current)
  if (!('pagina' in changes)) next.delete('pagina')
  for (const [key, value] of Object.entries(changes)) {
    next.delete(key)
    const values = Array.isArray(value) ? value : [value]
    for (const item of values) {
      if (item !== null && item !== undefined && item !== '') next.append(key, String(item))
    }
  }
  return next
}

export function searchProducts(products, filters) {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean)

  const matches = products.filter((product) => {
    // Cada palavra digitada precisa aparecer no nome, na descrição, na categoria ou nas palavras-chave.
    const haystack = normalize(
      [product.name, product.description, product.category, product.type, product.skinType, product.hairType, ...(product.keywords ?? [])].join(' '),
    )
    if (!terms.every((term) => haystack.includes(term))) return false
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false
    // Tipo de cabelo: restringe só os produtos de cabelo.
    if (product.hairType && filters.hairTypes.length > 0 && !filters.hairTypes.includes(product.hairType)) return false
    // Tipo de pele: restringe os produtos de pele. Os de cabelo só continuam se a área Cabelo também estiver marcada
    // (marcar "Seca" sozinho mostra só pele seca; com "Cabelo" marcado junto, o cabelo continua).
    if (filters.skinTypes.length > 0) {
      if (product.skinType ? !filters.skinTypes.includes(product.skinType) : !filters.categories.includes('Cabelo')) return false
    }
    if (filters.types.length > 0 && !filters.types.includes(product.type)) return false
    return filters.ratings.length === 0 || filters.ratings.includes(Math.round(product.rating))
  })

  // O JS mantém a ordem original em empates: "Mais relevante" é a ordem do catálogo.
  if (filters.sort === 'recente') return matches.toReversed()
  if (filters.sort === 'menor-preco') return matches.toSorted((a, b) => a.price - b.price)
  if (filters.sort === 'maior-preco') return matches.toSorted((a, b) => b.price - a.price)
  return matches
}

// Números que a paginação mostra (Figma): na 1ª página, "1 2 3 ... 50"; nas demais, a primeira, a atual, a SEGUINTE e a
// última, com reticências (null) em todo buraco: "1 ... 3 4 ... 50". Na página 2 isso dá "1 2 3 ... 50"; perto do fim,
// "1 ... 49 50". Com poucas páginas o mesmo padrão vale (sem buracos, não há reticências).
export function pageNumbers(current, total) {
  const wanted = new Set(current === 1 ? [1, 2, 3, total] : [1, current, current + 1, total])
  const pages = [...wanted].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  return pages.flatMap((page, index) => (index > 0 && page - pages[index - 1] > 1 ? [null, page] : [page]))
}
