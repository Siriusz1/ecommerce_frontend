// Funções do painel administrativo.

export const pad = (value) => String(value).padStart(2, '0')

// timestamp -> "27/10/2026"
export const formatDate = (time) => {
  const date = new Date(time)
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}
// timestamp -> "10:42"
export const formatTime = (time) => {
  const date = new Date(time)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const variantsStock = (product) => product.variants.reduce((sum, variant) => sum + variant.stock, 0)

// Preço de venda de verdade: o promocional, quando existe e é menor.
export const effectivePrice = (variant) => (variant.promoPrice && variant.promoPrice < variant.price ? variant.promoPrice : variant.price)

// "R$ 89,90" / "89,90" -> 89.9 (null se não for um número); aceita ponto de milhar e vírgula decimal.
export function parseMoney(text) {
  const cleaned = String(text).replace(/[^\d,.]/g, '')
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned
  const value = Number(normalized)
  return normalized !== '' && Number.isFinite(value) ? value : null
}
