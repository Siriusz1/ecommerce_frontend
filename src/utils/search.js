import { CATEGORIES, PRICE_BOUNDS, SKIN_TYPES } from '../data/products'

export const PAGE_SIZE = 16

export const SORTS = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'avaliacao', label: 'Mais bem avaliados' },
]

// Sem acento e em minúsculas: "hidratação" encontra "Hidratacao" e vice-versa.
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

// Toda a tela é guiada pelo endereço (/busca?q=...&categoria=Rosto&estrelas=4...): recarregar, voltar e compartilhar
// o link mantêm a busca. Esta função traduz os parâmetros em filtros, ignorando valores inválidos.
export function readFilters(params) {
  const number = (key, fallback) => {
    const raw = params.get(key)
    const value = Number(raw)
    return raw !== null && raw !== '' && Number.isFinite(value) ? value : fallback
  }
  const rating = Math.round(number('estrelas', 0))
  const sort = params.get('ordem')

  return {
    query: (params.get('q') ?? '').trim(),
    categories: CATEGORIES.filter((category) => params.getAll('categoria').includes(category)),
    skinTypes: SKIN_TYPES.filter((type) => params.getAll('pele').includes(type)),
    minRating: rating >= 1 && rating <= 5 ? rating : 0,
    minPrice: Math.min(Math.max(number('min', PRICE_BOUNDS.min), PRICE_BOUNDS.min), PRICE_BOUNDS.max),
    maxPrice: Math.min(Math.max(number('max', PRICE_BOUNDS.max), PRICE_BOUNDS.min), PRICE_BOUNDS.max),
    sort: SORTS.some((option) => option.value === sort) ? sort : SORTS[0].value,
    page: Math.max(1, Math.floor(number('pagina', 1))),
  }
}

// Aplica `changes` (ex.: { categoria: ['Rosto'], estrelas: 4, min: null }) sobre os parâmetros atuais.
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
      [product.name, product.description, product.category, product.skinType, ...(product.keywords ?? [])].join(' '),
    )
    if (!terms.every((term) => haystack.includes(term))) return false
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false
    if (filters.skinTypes.length > 0 && !filters.skinTypes.includes(product.skinType)) return false
    if (product.rating < filters.minRating) return false
    return product.price >= filters.minPrice && product.price <= filters.maxPrice
  })

  // O JS mantém a ordem original em empates: "Relevância" é a ordem do catálogo.
  if (filters.sort === 'menor-preco') return matches.toSorted((a, b) => a.price - b.price)
  if (filters.sort === 'maior-preco') return matches.toSorted((a, b) => b.price - a.price)
  if (filters.sort === 'avaliacao') return matches.toSorted((a, b) => b.rating - a.rating)
  return matches
}

// Números que a paginação mostra: todos, se forem poucos; senão o primeiro, os vizinhos da página atual e o
// último, com reticências (null) nos buracos. Ex.: 1 ... 4 5 6 ... 50.
export function pageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)
  const wanted = new Set([1, 2, 3, total, current - 1, current, current + 1])
  const pages = [...wanted].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  return pages.flatMap((page, index) => (index > 0 && page - pages[index - 1] > 1 ? [null, page] : [page]))
}
