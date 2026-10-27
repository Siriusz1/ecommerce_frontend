import productPhoto from '../assets/images/admin/product-photo.jpg'

// Dados de exemplo do painel administrativo (não há backend). O catálogo da loja (data/products.js) é outro: o painel
// parte destes dados e as alterações feitas nele valem só enquanto a página estiver aberta (ver services/adminStore.js).

export const SEED_CATEGORIES = [
  { id: 'limpeza', name: 'Limpeza' },
  { id: 'tratamento', name: 'Tratamento e Nutrição' },
  { id: 'hidratacao', name: 'Hidratação' },
  { id: 'tonificacao', name: 'Tonificação' },
  { id: 'protecao', name: 'Proteção' },
  { id: 'kits', name: 'Kits' },
]

// Grupos de "filtro por característica": são os filtros da busca da loja (Área de aplicação, Tipo de pele, Tipo de cabelo).
// Um produto pode ter várias opções do mesmo grupo (ex.: um creme para rosto e corpo).
export const SEED_FILTER_GROUPS = [
  {
    id: 'area',
    name: 'Área de aplicação',
    options: [
      { id: 'corpo', label: 'Corpo' },
      { id: 'rosto', label: 'Rosto' },
      { id: 'cabelo', label: 'Cabelo' },
    ],
  },
  {
    id: 'pele',
    name: 'Tipo de pele',
    options: [
      { id: 'seca', label: 'Seca' },
      { id: 'oleosa', label: 'Oleosa' },
      { id: 'mista', label: 'Mista' },
      { id: 'normal', label: 'Normal' },
    ],
  },
  {
    id: 'cabelo',
    name: 'Tipo de cabelo',
    options: [
      { id: 'liso', label: 'Liso' },
      { id: 'ondulado', label: 'Ondulado' },
      { id: 'cacheado', label: 'Cacheado' },
      { id: 'crespo', label: 'Crespo' },
    ],
  },
]

// 8 produtos, 94 unidades em estoque e 2 produtos sem estoque, como no Figma. Cada produto tem 1 ou mais volumes
// (variantes), cada um com preço, SKU e estoque próprios; o `id` do volume é o "ID 1", "ID 2" da tabela.
export const SEED_PRODUCTS = [
  {
    id: 'p1',
    name: 'Botanica Renewal',
    description: 'Creme noturno regenerador para renovação celular e firmeza.',
    category: 'tratamento',
    filters: { area: ['rosto', 'corpo'], pele: ['seca', 'mista'] },
    photos: [productPhoto],
    rating: 5,
    reviews: 250,
    variants: [
      { id: 1, volume: '30 ml', price: 100, promoPrice: null, sku: 'BOT-REN-030', stock: 8 },
      { id: 2, volume: '60 ml', price: 150, promoPrice: null, sku: 'BOT-REN-060', stock: 8 },
    ],
  },
  {
    id: 'p2',
    name: 'Botanica Cleanse',
    description: 'Gel de limpeza suave que remove impurezas sem ressecar.',
    category: 'limpeza',
    filters: { area: ['rosto'], pele: ['oleosa', 'mista', 'normal'] },
    photos: [productPhoto],
    rating: 4,
    reviews: 128,
    variants: [
      { id: 3, volume: '90 ml', price: 89.9, promoPrice: 79.9, sku: 'BOT-CLE-090', stock: 12 },
      { id: 4, volume: '200 ml', price: 129.9, promoPrice: null, sku: 'BOT-CLE-200', stock: 10 },
    ],
  },
  {
    id: 'p3',
    name: 'Botanica Hydra',
    description: 'Hidratante leve de rápida absorção para o uso diário.',
    category: 'hidratacao',
    filters: { area: ['rosto', 'corpo'], pele: ['seca', 'normal'] },
    photos: [productPhoto],
    rating: 5,
    reviews: 312,
    variants: [{ id: 5, volume: '90 ml', price: 120, promoPrice: null, sku: 'BOT-HYD-090', stock: 15 }],
  },
  {
    id: 'p4',
    name: 'Botanica Shield',
    description: 'Protetor com ação antioxidante para o dia a dia.',
    category: 'protecao',
    filters: { area: ['rosto'], pele: ['normal', 'mista'] },
    photos: [productPhoto],
    rating: 4,
    reviews: 87,
    variants: [{ id: 6, volume: '50 ml', price: 99.9, promoPrice: null, sku: 'BOT-SHI-050', stock: 20 }],
  },
  {
    id: 'p5',
    name: 'Botanica Tonic',
    description: 'Tônico facial que equilibra e prepara a pele para o cuidado seguinte.',
    category: 'tonificacao',
    filters: { area: ['rosto'], pele: ['oleosa', 'mista'] },
    photos: [productPhoto],
    rating: 4,
    reviews: 54,
    variants: [{ id: 7, volume: '120 ml', price: 75, promoPrice: null, sku: 'BOT-TON-120', stock: 9 }],
  },
  {
    id: 'p6',
    name: 'Kit Verão Botanica',
    description: 'Limpeza, hidratação e proteção para a rotina de verão.',
    category: 'kits',
    filters: { area: ['rosto', 'corpo'], pele: ['normal'] },
    photos: [productPhoto],
    rating: 5,
    reviews: 41,
    variants: [{ id: 8, volume: 'Kit 3 itens', price: 289.9, promoPrice: 249.9, sku: 'BOT-KIT-003', stock: 12 }],
  },
  {
    id: 'p7',
    name: 'Botanica Body Oil',
    description: 'Óleo corporal nutritivo com toque seco e perfume suave.',
    category: 'hidratacao',
    filters: { area: ['corpo'], pele: ['seca'] },
    photos: [productPhoto],
    rating: 3,
    reviews: 19,
    variants: [{ id: 9, volume: '100 ml', price: 110, promoPrice: null, sku: 'BOT-OIL-100', stock: 0 }],
  },
  {
    id: 'p8',
    name: 'Botanica Hair Mask',
    description: 'Máscara de tratamento intensivo para cabelos ressecados.',
    category: 'tratamento',
    filters: { area: ['cabelo'], cabelo: ['ondulado', 'cacheado', 'crespo'] },
    photos: [productPhoto],
    rating: 5,
    reviews: 203,
    variants: [{ id: 10, volume: '250 g', price: 139.9, promoPrice: null, sku: 'BOT-MAS-250', stock: 0 }],
  },
]

// ---- Pedidos (tela de Vendas) ----

const CUSTOMERS = [
  ['Mariana Oliveira', 'mariana.oliveira@email.com'],
  ['Beatriz Lima', 'beatriz.lima@email.com'],
  ['Ana Rodrigues', 'ana.rodrigues@email.com'],
  ['Camila Santos', 'camila.santos@email.com'],
  ['Juliana Costa', 'juliana.costa@email.com'],
  ['Letícia Ferreira', 'leticia.ferreira@email.com'],
  ['Fernanda Alves', 'fernanda.alves@email.com'],
  ['Larissa Gomes', 'larissa.gomes@email.com'],
  ['Carolina Rocha', 'carolina.rocha@email.com'],
  ['Patrícia Souza', 'patricia.souza@email.com'],
]
const PAYMENTS = ['Pix', 'Cartão de crédito', 'Boleto', 'Pix', 'Cartão de crédito']

// Gerador pseudoaleatório simples (sempre os mesmos pedidos para os mesmos dados).
function makeRandom(seed) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

// 98 pedidos no mês de `now` (como no Figma: "98 pedidos") e mais 40 do mês anterior, para o filtro de período ter o que
// filtrar. Cerca de 1 em 8 aguarda pagamento e 4 foram cancelados. A numeração cresce com a data.
export function buildSeedOrders(now = new Date()) {
  const random = makeRandom(7)
  const lines = SEED_PRODUCTS.flatMap((product) => product.variants.map((variant) => ({ product, variant })))
  const year = now.getFullYear()
  const month = now.getMonth()
  const orders = []

  const make = (index, monthOffset, day) => {
    const [name, email] = CUSTOMERS[Math.floor(random() * CUSTOMERS.length)]
    const itemCount = 1 + Math.floor(random() * 2)
    const items = Array.from({ length: itemCount }, () => {
      const { product, variant } = lines[Math.floor(random() * lines.length)]
      return {
        name: `${product.name} ${variant.volume}`,
        quantity: 1 + Math.floor(random() * 2),
        price: variant.promoPrice ?? variant.price,
      }
    })
    const date = new Date(year, month + monthOffset, day, 8 + Math.floor(random() * 12), Math.floor(random() * 60))
    const status = index % 8 === 3 ? 'aguardando' : index % 25 === 7 ? 'cancelado' : 'pago'
    return {
      id: 0,
      customer: { name, email },
      date: date.getTime(),
      payment: PAYMENTS[index % PAYMENTS.length],
      status,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }
  }

  const today = now.getDate()
  for (let i = 0; i < 40; i++) orders.push(make(i + 100, -1, 1 + Math.floor((i * 27) / 40)))
  for (let i = 0; i < 98; i++) orders.push(make(i, 0, 1 + Math.floor((i * today) / 98)))

  // Numeração pela data (os mais antigos primeiro) e lista dos mais recentes para os mais antigos.
  orders.sort((a, b) => a.date - b.date).forEach((order, index) => (order.id = 1000 + index + 1))
  return orders.reverse()
}
