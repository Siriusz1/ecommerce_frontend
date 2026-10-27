// STUB do PIX: não existe backend, então o código "copia e cola" é montado aqui. O formato é o do Figma (um BR Code
// de exemplo); só o valor (campo 54) acompanha o total da compra. O CRC final é fixo, então nenhum banco vai aceitar
// este código: quando houver API, ele passa a vir do servidor junto com o prazo de validade.

export const PIX_EXPIRY_MS = 30 * 60 * 1000 // o código vale 30 minutos

// STUB: sem banco para avisar que o PIX caiu, a tela "reconhece" o pagamento este tempo depois de o código ser copiado
// (quem copia está indo pagar no app do banco). Com backend, isto vira a consulta do status do pedido.
export const PIX_DEMO_CONFIRMATION_MS = 6000

const BASE = '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986'
const TAIL = '5802BR5920Sua Loja Exemplo LTDA6009SAO PAULO62070503***6304E2D8'

export function buildPixCode(total) {
  const amount = total.toFixed(2)
  return `${BASE}54${String(amount.length).padStart(2, '0')}${amount}${TAIL}`
}

// 1659000 ms -> "27:39"
export function formatCountdown(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}
