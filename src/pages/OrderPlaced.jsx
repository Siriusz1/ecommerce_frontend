import { Link, Navigate, useLocation } from 'react-router'
import Button from '../components/Button'
import Header from '../components/header/Header'
import OrderBottle from '../components/OrderBottle'
import { useAuth } from '../context/useAuth'
import { formatShortAddress } from '../data/checkout'
import { formatPrice } from '../utils/format'

function Detail({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-6 p-2.5">
      <dt>{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

// Confirmação do pedido (/pedido-concluido), depois de pagar. Os dados vêm do checkout (estado da navegação, ver
// Checkout.jsx); aberta direto, volta para a Home. O frasco do topo se desenha sozinho (ver OrderBottle).
export default function OrderPlaced() {
  const { state } = useLocation()
  const { user } = useAuth()
  const order = state?.order
  if (!order) return <Navigate to="/" replace />

  const firstName = user?.name?.trim().split(/\s+/)[0]

  return (
    <div className="min-h-screen bg-neutral-700">
      <Header minimal />

      <main className="mx-auto flex w-[657px] max-w-[calc(100%-32px)] flex-col items-center gap-5 pb-16 pt-[137px] text-red-300">
        <div className="flex w-full flex-col items-start gap-8">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-center gap-[11px]">
              <OrderBottle className="h-[137.616px] w-[89.749px]" />
              <div className="flex w-full flex-col items-center gap-4">
                <h1 className="text-center font-heading text-5xl font-semibold leading-[normal]">Pedido realizado!</h1>
                <p className="p-2.5 text-center text-base font-medium min-[700px]:whitespace-nowrap">
                  {firstName ? `Obrigado, ${firstName}. ` : 'Obrigado. '}Seu pagamento foi confirmado e já estamos separando
                  seus produtos.
                </p>
              </div>
            </div>
            <p className="text-sm font-medium opacity-80">Enviamos os detalhes do pedido para o seu e-mail.</p>
          </div>

          <div className="flex w-[647px] max-w-full flex-col items-end gap-4">
            <section aria-label="Resumo do pedido" className="flex w-full flex-col rounded-card border border-card-border bg-card p-3">
              <dl className="flex flex-col text-sm">
                <Detail label="Código do Pedido">#{order.code}</Detail>
                <Detail label="Pagamento">{order.paymentLabel}</Detail>
                <Detail label="Itens">
                  {order.itemCount} {order.itemCount === 1 ? 'produto' : 'produtos'}
                </Detail>
                <Detail label="Entrega">{formatShortAddress(order.address)}</Detail>
              </dl>
              <div className="flex items-center justify-between border-t border-card-border p-2.5 text-xl">
                <p className="font-extrabold">Total pago</p>
                <p className="font-bold">{formatPrice(order.total)}</p>
              </div>
            </section>

            <div className="flex items-center gap-3">
              <Button as={Link} to="/" variant="outline">
                Voltar à Página Inicial
              </Button>
              <Button as={Link} to="/perfil/pedidos">
                Acompanhar pedido
              </Button>
            </div>
          </div>
        </div>

        <p className="p-2.5 text-sm font-medium">
          Dúvidas? Fale com a gente pelo{' '}
          <a href="#" className="font-bold text-green-300 underline decoration-from-font">
            WhatsApp
          </a>{' '}
          ou por{' '}
          <a href="mailto:fusikos@gmail.com" className="font-bold text-red-600 underline decoration-from-font">
            E-mail
          </a>
          .
        </p>
      </main>
    </div>
  )
}
