// Dados de exemplo do checkout (não há backend): o endereço e os cartões "já salvos" que o Figma mostra.

export const SHIPPING_PRICE = 45 // o Figma mostra "Frete R$45,00"
export const DELIVERY_DAYS = 5 // a entrega prevista é sempre daqui a 5 dias

export const initialAddresses = [
  {
    id: 'casa',
    label: 'Casa',
    cep: '60140-200',
    street: 'Rua Paula Ney',
    number: '700',
    complement: '1502',
    district: 'Aldeota',
    city: 'Fortaleza',
    uf: 'CE',
  },
]

// O Figma desenha dois cartões idênticos (Visa final 9915); o segundo só existe para mostrar a lista.
export const initialCards = [
  { id: 'visa-1', brand: 'Visa', last4: '9915', holder: 'Márcio Freires da Costa', expiry: '02/2029', installments: 1 },
  { id: 'visa-2', brand: 'Visa', last4: '9915', holder: 'Márcio Freires da Costa', expiry: '02/2029', installments: 1 },
]

// "Rua Paula Ney, 700, 1502 - Aldeota - Fortaleza, CE - CEP: 60140-200"
export function formatAddress({ street, number, complement, district, city, uf, cep }) {
  const line = [street, number, complement].filter(Boolean).join(', ')
  return `${line} - ${district} - ${city}, ${uf} - CEP: ${cep}`
}

// Parcelamento: 1x é "Preço à vista"; as demais são sem juros.
export const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6]
