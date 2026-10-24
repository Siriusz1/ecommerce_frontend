import { Link } from 'react-router'
import bagTitle from '../assets/icons/checkout/bag-title.svg'
import receipt from '../assets/icons/checkout/receipt.svg'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import CartItemRow from '../components/cart/CartItemRow'
import OrderSummary from '../components/cart/OrderSummary'
import SectionHeading from '../components/SectionHeading'
import Header from '../components/header/Header'
import { useCart } from '../context/useCart'

// Tela de sacola (/sacola). Duas colunas: à esquerda a lista de itens (845px); à direita o resumo da compra (411px).
// O "(3)" do título e o "Produtos (3)" do resumo contam unidades: o resumo só conta as linhas marcadas.
export default function Cart() {
  const { items, count, selectedCount, subtotal, discount, couponCode, setQuantity, toggleSelected, applyCoupon, removeCoupon } =
    useCart()

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      <Header />

      {/* pt-[92px]: a trilha começa 20px abaixo da navbar fixa; o conteúdo vem 12px depois dela (y=124). */}
      <main className="mx-auto max-w-content pb-16 pt-[92px]">
        <Breadcrumb className="mb-3" items={[{ label: 'Página Inicial', to: '/' }, { label: 'Sua sacola' }]} />

        <div className="grid grid-cols-[845px_minmax(0,1fr)] items-start gap-x-6">
          <section aria-labelledby="bag-title" className="flex flex-col gap-3">
            <SectionHeading icon={bagTitle}>
              <span id="bag-title">Sua sacola({count})</span>
            </SectionHeading>

            {items.length > 0 ? (
              <ul className="flex flex-col">
                {items.map((item) => (
                  <CartItemRow
                    key={item.key}
                    item={item}
                    onToggle={() => toggleSelected(item.key)}
                    onQuantityChange={(quantity) => setQuantity(item.key, quantity)}
                  />
                ))}
              </ul>
            ) : (
              // O Figma não desenha a sacola vazia.
              <div className="flex flex-col items-start gap-4 border-y border-card-border px-3 py-10">
                <p className="text-xl font-semibold">Sua sacola está vazia.</p>
                <Link to="/" className="text-xl font-semibold underline">
                  Continuar comprando
                </Link>
              </div>
            )}
          </section>

          <aside aria-labelledby="summary-title" className="flex flex-col gap-3">
            <SectionHeading icon={receipt}>
              <span id="summary-title">Resumo da compra</span>
            </SectionHeading>
            <OrderSummary
              itemCount={selectedCount}
              productsTotal={subtotal}
              discount={discount}
              couponCode={couponCode}
              total={subtotal - discount}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
            >
              {/* Sem nada marcado não há o que comprar: o botão fica cinza, como o "Disable" do botão-base. */}
              <Button
                as={Link}
                to="/checkout"
                size="large"
                disabled={selectedCount === 0}
                // Link desabilitado continuaria navegável: só o visual cinza não basta.
                onClick={(event) => selectedCount === 0 && event.preventDefault()}
                className="w-full"
              >
                Finalizar compra
              </Button>
            </OrderSummary>
          </aside>
        </div>
      </main>
    </div>
  )
}
