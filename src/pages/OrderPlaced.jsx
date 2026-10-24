import { Link, Navigate, useLocation } from 'react-router'
import Button from '../components/Button'
import Header from '../components/header/Header'
import { formatMoney } from '../utils/format'

// Confirmação depois de "Finalizar compra". O Figma não desenha esta tela: é a mínima para fechar o fluxo, no mesmo
// estilo das demais. Os dados vêm do checkout (via estado da navegação); aberta direto, volta para a Home.
export default function OrderPlaced() {
  const { state } = useLocation()
  if (!state) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-neutral-700">
      <Header minimal />
      <main className="mx-auto flex max-w-content flex-col items-start gap-6 pb-16 pt-[164px]">
        <h1 className="font-heading text-heading font-semibold text-red-300">Pedido realizado!</h1>
        <p className="max-w-[640px] text-xl">
          Recebemos o seu pedido e o pagamento de {formatMoney(state.total)} por {state.payment}. Você acompanha a entrega
          em “Pedidos”, no seu perfil.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/" size="large" className="px-8">
            Continuar comprando
          </Button>
          <Button as={Link} to="/perfil/pedidos" size="large" variant="outline" className="px-8">
            Ver meus pedidos
          </Button>
        </div>
      </main>
    </div>
  )
}
