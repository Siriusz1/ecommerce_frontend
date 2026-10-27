// Constantes do checkout. Os endereços e cartões "salvos" de cada conta ficam em services/checkoutData.js (uma conta nova
// começa sem nenhum).

export const SHIPPING_PRICE = 45 // o Figma mostra "Frete R$45,00"
export const DELIVERY_DAYS = 5 // a entrega prevista é sempre daqui a 5 dias

// "Rua Paula Ney, 700, 1502 - Aldeota - Fortaleza, CE - CEP: 60140-200"
export function formatAddress({ street, number, complement, district, city, uf, cep }) {
  const line = [street, number, complement].filter(Boolean).join(', ')
  return `${line} - ${district} - ${city}, ${uf} - CEP: ${cep}`
}

// Parcelamento: 1x é "Preço à vista"; as demais são sem juros.
export const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6]

// "Rua Paula Ney, 700, 1502 - Aldeota, Fortaleza - CE, CEP 60140-200" (tela do PIX)
export function formatDeliveryAddress({ street, number, complement, district, city, uf, cep }) {
  const line = [street, number, complement].filter(Boolean).join(', ')
  return `${line} - ${district}, ${city} - ${uf}, CEP ${cep}`
}

// "Rua Paula Ney, 700, 1502 - Aldeota, Fortaleza - CE" (confirmação do pedido, sem o CEP)
export function formatShortAddress({ street, number, complement, district, city, uf }) {
  const line = [street, number, complement].filter(Boolean).join(', ')
  return `${line} - ${district}, ${city} - ${uf}`
}
