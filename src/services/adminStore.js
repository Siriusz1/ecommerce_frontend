import { useSyncExternalStore } from 'react'
import { SEED_CATEGORIES, SEED_FILTER_GROUPS, SEED_PRODUCTS, buildSeedOrders } from '../data/adminSeed'

// STUB dos dados do painel administrativo: produtos, categorias, grupos de filtro e pedidos vivem só em memória (partem dos
// dados de exemplo em data/adminSeed.js e voltam a eles ao recarregar a página). Cada ação devolve `{ ok: true, ... }` ou
// `{ ok: false, reason }`, o mesmo formato do services/auth.js, para a troca pelo backend não mexer nas telas.
// As telas leem pelos hooks `useAdmin*` (useSyncExternalStore): qualquer ação abaixo atualiza todas as que estão abertas.

let state = {
  products: SEED_PRODUCTS,
  categories: SEED_CATEGORIES,
  filterGroups: SEED_FILTER_GROUPS,
  orders: buildSeedOrders(),
}
const listeners = new Set()

function update(patch) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useAdminProducts = () => useSyncExternalStore(subscribe, () => state.products)
export const useAdminCategories = () => useSyncExternalStore(subscribe, () => state.categories)
export const useAdminFilterGroups = () => useSyncExternalStore(subscribe, () => state.filterGroups)
export const useAdminOrders = () => useSyncExternalStore(subscribe, () => state.orders)

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()
const uniqueId = (base, taken) => {
  let id = base || 'item'
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`
  return id
}
const nextVariantId = () => Math.max(0, ...state.products.flatMap((product) => product.variants.map((variant) => variant.id))) + 1

// ---------- Produtos ----------

export const findVariant = (variantId) => {
  for (const product of state.products) {
    const variant = product.variants.find((item) => item.id === variantId)
    if (variant) return { product, variant }
  }
  return null
}

// Produto novo, já com o primeiro volume. `variant` não traz `id`.
export function addProduct({ variant, ...product }) {
  const id = `p${Date.now()}`
  update({ products: [...state.products, { ...product, id, rating: 0, reviews: 0, variants: [{ ...variant, id: nextVariantId() }] }] })
  return { ok: true, id }
}

export function updateProduct(productId, changes) {
  update({ products: state.products.map((product) => (product.id === productId ? { ...product, ...changes } : product)) })
  return { ok: true }
}

// Volume novo num produto que já existe.
export function addVariant(productId, variant) {
  const id = nextVariantId()
  update({
    products: state.products.map((product) =>
      product.id === productId ? { ...product, variants: [...product.variants, { ...variant, id }] } : product,
    ),
  })
  return { ok: true, id }
}

export function updateVariant(variantId, changes) {
  update({
    products: state.products.map((product) => ({
      ...product,
      variants: product.variants.map((variant) => (variant.id === variantId ? { ...variant, ...changes } : variant)),
    })),
  })
  return { ok: true }
}

// Tirar o último volume leva o produto junto (um produto sem volume não teria preço nem estoque).
export function deleteVariant(variantId) {
  update({
    products: state.products
      .map((product) => ({ ...product, variants: product.variants.filter((variant) => variant.id !== variantId) }))
      .filter((product) => product.variants.length > 0),
  })
  return { ok: true }
}

export function deleteProduct(productId) {
  update({ products: state.products.filter((product) => product.id !== productId) })
  return { ok: true }
}

// ---------- Categorias ----------
// Todo produto pertence a uma categoria: só se exclui uma categoria vazia.

export function addCategory(name) {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, reason: 'EMPTY' }
  if (state.categories.some((category) => sameName(category.name, trimmed))) return { ok: false, reason: 'DUPLICATE' }
  const id = uniqueId(slugify(trimmed), state.categories.map((category) => category.id))
  update({ categories: [...state.categories, { id, name: trimmed }] })
  return { ok: true, id }
}

export function renameCategory(id, name) {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, reason: 'EMPTY' }
  if (state.categories.some((category) => category.id !== id && sameName(category.name, trimmed))) {
    return { ok: false, reason: 'DUPLICATE' }
  }
  update({ categories: state.categories.map((category) => (category.id === id ? { ...category, name: trimmed } : category)) })
  return { ok: true }
}

export function deleteCategory(id) {
  const used = state.products.filter((product) => product.category === id).length
  if (used > 0) return { ok: false, reason: 'IN_USE', count: used }
  update({ categories: state.categories.filter((category) => category.id !== id) })
  return { ok: true }
}

// ---------- Filtros por característica ----------

export function addFilterGroup(name) {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, reason: 'EMPTY' }
  if (state.filterGroups.some((group) => sameName(group.name, trimmed))) return { ok: false, reason: 'DUPLICATE' }
  const id = uniqueId(slugify(trimmed), state.filterGroups.map((group) => group.id))
  update({ filterGroups: [...state.filterGroups, { id, name: trimmed, options: [] }] })
  return { ok: true, id }
}

export function renameFilterGroup(id, name) {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, reason: 'EMPTY' }
  if (state.filterGroups.some((group) => group.id !== id && sameName(group.name, trimmed))) return { ok: false, reason: 'DUPLICATE' }
  update({ filterGroups: state.filterGroups.map((group) => (group.id === id ? { ...group, name: trimmed } : group)) })
  return { ok: true }
}

// Excluir um grupo tira as opções dele de todos os produtos.
export function deleteFilterGroup(id) {
  update({
    filterGroups: state.filterGroups.filter((group) => group.id !== id),
    products: state.products.map(({ filters, ...product }) => {
      const { [id]: removed, ...rest } = filters
      void removed
      return { ...product, filters: rest }
    }),
  })
  return { ok: true }
}

export function addFilterOption(groupId, label) {
  const trimmed = label.trim()
  const group = state.filterGroups.find((item) => item.id === groupId)
  if (!group) return { ok: false, reason: 'NOT_FOUND' }
  if (!trimmed) return { ok: false, reason: 'EMPTY' }
  if (group.options.some((option) => sameName(option.label, trimmed))) return { ok: false, reason: 'DUPLICATE' }
  const id = uniqueId(slugify(trimmed), group.options.map((option) => option.id))
  update({
    filterGroups: state.filterGroups.map((item) =>
      item.id === groupId ? { ...item, options: [...item.options, { id, label: trimmed }] } : item,
    ),
  })
  return { ok: true, id }
}

// Remover uma opção tira ela de todos os produtos que a tinham.
export function deleteFilterOption(groupId, optionId) {
  update({
    filterGroups: state.filterGroups.map((group) =>
      group.id === groupId ? { ...group, options: group.options.filter((option) => option.id !== optionId) } : group,
    ),
    products: state.products.map((product) =>
      product.filters[groupId]?.includes(optionId)
        ? { ...product, filters: { ...product.filters, [groupId]: product.filters[groupId].filter((id) => id !== optionId) } }
        : product,
    ),
  })
  return { ok: true }
}
