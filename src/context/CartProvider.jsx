import { useEffect, useMemo, useState } from 'react'
import { findProduct } from '../data/products'
import { CartContext } from './cartContext'

// Cupons aceitos (não há backend): código em maiúsculas -> desconto em reais. O do Figma é o "15REAISOFF".
const COUPONS = { '15REAISOFF': 15 }

// Chave da linha: o mesmo produto em volumes diferentes são linhas diferentes.
const lineKey = (product, volume) => `${product.id}|${volume}`

const STORAGE_KEY = 'fysikos:cart'

// O carrinho é guardado no localStorage: quem ainda não tem perfil pode adicionar itens (a sacola em si exige login) e
// eles esperam, mesmo depois de recarregar a página ou fechar o navegador, até a pessoa criar a conta e entrar. Guardamos só
// o essencial (id do produto, volume, quantidade, marcação e cupom) e remontamos o produto a partir do catálogo, em vez
// de gravar o objeto inteiro. O storage pode estar bloqueado (aba anônima): aí o carrinho vive só com a página aberta.
function readStoredCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const items = (stored?.items ?? []).flatMap(({ id, volume, quantity, selected }) => {
      const product = findProduct(id)
      // Produto que não existe mais no catálogo é descartado em silêncio.
      return product && quantity > 0 ? [{ key: lineKey(product, volume), product, volume, quantity, selected: selected !== false }] : []
    })
    return { items, couponCode: stored?.couponCode in COUPONS ? stored.couponCode : null }
  } catch {
    return { items: [], couponCode: null }
  }
}

// Carrinho. Cada linha é { key, product, volume, quantity, selected }: `selected` é a caixinha da tela de sacola, e só as
// linhas marcadas entram no resumo e no checkout.
export function CartProvider({ children }) {
  const [initial] = useState(readStoredCart)
  const [items, setItems] = useState(initial.items)
  const [couponCode, setCouponCode] = useState(initial.couponCode)

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: items.map(({ product, volume, quantity, selected }) => ({ id: product.id, volume, quantity, selected })),
          couponCode,
        }),
      )
    } catch {
      // sem storage: ignora
    }
  }, [items, couponCode])

  const value = useMemo(() => {
    const selectedItems = items.filter((item) => item.selected)
    const subtotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    // O desconto nunca passa do valor dos produtos.
    const discount = couponCode ? Math.min(COUPONS[couponCode], subtotal) : 0

    return {
      items,
      selectedItems,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      selectedCount: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      couponCode,
      discount,

      // Adicionar o mesmo produto (e volume) de novo soma a quantidade em vez de duplicar a linha.
      // A tela de produto adiciona várias unidades de uma vez (`quantity`) e informa o volume escolhido; os cards,
      // sempre 1 unidade do primeiro volume.
      addItem: (product, quantity = 1, volume = product.page?.volumes?.[0]) =>
        setItems((current) => {
          const key = lineKey(product, volume)
          const existing = current.find((item) => item.key === key)
          if (!existing) return [...current, { key, product, volume, quantity, selected: true }]
          return current.map((item) => (item === existing ? { ...item, quantity: item.quantity + quantity } : item))
        }),
      // Chegar a 0 remove a linha (é o que a lixeira do contador faz quando a quantidade é 1).
      setQuantity: (key, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.key !== key)
            : current.map((item) => (item.key === key ? { ...item, quantity } : item)),
        ),
      removeItem: (key) => setItems((current) => current.filter((item) => item.key !== key)),
      toggleSelected: (key) =>
        setItems((current) => current.map((item) => (item.key === key ? { ...item, selected: !item.selected } : item))),
      // Depois de finalizar a compra, só saem da sacola as linhas que foram compradas (as marcadas).
      removeSelected: () => setItems((current) => current.filter((item) => !item.selected)),

      // { ok: true } | { ok: false, reason: 'EMPTY' | 'INVALID' }
      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase()
        if (!normalized) return { ok: false, reason: 'EMPTY' }
        if (!(normalized in COUPONS)) return { ok: false, reason: 'INVALID' }
        setCouponCode(normalized)
        return { ok: true }
      },
      removeCoupon: () => setCouponCode(null),
    }
  }, [items, couponCode])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
