import productImage from '../assets/images/product.png'

// Dados de exemplo (não há API de pedidos). O pedido 153 reproduz o que o Figma mostra;
// o 154 está "Entregue" no Figma mas sem os detalhes desenhados, então a linha do tempo dele é inventada.
const botanicaRenewal = {
  name: 'Botanica Renewal',
  description: 'Creme noturno regenerador para renovação celular e firmeza.',
  quantity: 1,
  image: productImage,
}

// Etapas de cima (mais recente/futura) para baixo (mais antiga). `status`:
//   done    -> círculo verde preenchido com check
//   current -> círculo verde vazado (onde o pedido está agora)
//   pending -> círculo cinza vazado (ainda não aconteceu)
export const orders = [
  {
    id: 154,
    status: 'delivered',
    statusLabel: 'Entregue 10 de agosto de 2026',
    items: [
      { ...botanicaRenewal, id: 'botanica-1' },
      { ...botanicaRenewal, id: 'botanica-2' },
    ],
    total: 340,
    trackingCode: 'BR987654321SP',
    steps: [
      { status: 'done', date: '10 de agosto', title: 'Entregue', place: 'Paula Ney, 700 - 15:40' },
      { status: 'done', date: '10 de agosto', title: 'Saiu para entrega', place: 'Fortaleza, CE - 08:15' },
      { status: 'done', date: '05 de agosto', title: 'Saiu da distribuidora', place: 'São Paulo, SP - 16:02' },
    ],
  },
  {
    id: 153,
    status: 'in_transit',
    statusLabel: 'Última atualização: saiu para entrega', // o Figma escreve "Ultima" (sem acento)
    items: [{ ...botanicaRenewal, id: 'botanica-3' }],
    total: 170,
    trackingCode: 'BR123456789SP',
    steps: [
      { status: 'pending', date: 'Previsto', title: 'Entregue', place: 'Paula Ney, 700 - até às 18:00' },
      { status: 'current', date: '12 de agosto', title: 'Saiu para entrega', place: 'Fortaleza, CE - 08:02' },
      { status: 'done', date: '05 de agosto', title: 'Saiu da distribuidora', place: 'São Paulo, SP - 16:02' },
    ],
  },
]
