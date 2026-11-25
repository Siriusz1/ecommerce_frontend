import { useState } from 'react'
import { formatPrice } from '../../utils/format'
import { parseMoney } from '../../utils/admin'

// Código do produto gerado a partir do nome e do volume: "Botanica Renewal" + "90 ml" = "BOT-REN-090". Por isso o campo é
// só leitura (Figma). Um volume que já tem código mantém o dele.
function autoSku(name, volume) {
  const words = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.slice(0, 3))
  const digits = volume.replace(/\D/g, '')
  if (words.length === 0 || !digits) return ''
  return [...words, digits.padStart(3, '0')].join('-')
}

// Estado e validação dos campos de um volume. `siblings` são os outros volumes do mesmo produto (o volume não pode repetir);
// `productName` gera o código automático.
export function useVariantForm({ variant, siblings = [], productName = '' }) {
  const [volume, setVolume] = useState(variant?.volume ?? '')
  const [priceText, setPriceText] = useState(variant ? formatPrice(variant.price) : '')
  const [promoText, setPromoText] = useState(variant?.promoPrice ? formatPrice(variant.promoPrice) : '')
  const [stock, setStock] = useState(variant?.stock ?? 0)

  const price = parseMoney(priceText)
  const promo = promoText.trim() ? parseMoney(promoText) : null
  const promoError =
    promoText.trim() && (promo === null || (price !== null && promo >= price))
      ? 'O preço promocional precisa ser menor que o preço de venda.'
      : undefined
  const volumeError = siblings.some((item) => item.volume.trim().toLowerCase() === volume.trim().toLowerCase())
    ? 'Este produto já tem esse volume.'
    : undefined
  const sku = variant?.sku || autoSku(productName, volume)
  const valid = Boolean(volume.trim() && !volumeError && price !== null && price > 0 && !promoError)

  return {
    volume,
    setVolume,
    priceText,
    setPriceText,
    promoText,
    setPromoText,
    stock,
    setStock,
    price,
    promo,
    sku,
    volumeError,
    promoError,
    valid,
    data: { volume: volume.trim(), price, promoPrice: promo, sku, stock },
  }
}

