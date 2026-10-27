import { formatMoney } from '../../utils/format'
import CouponField from './CouponField'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-base text-red-200">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

// Cartão "Resumo da compra": cupom, linhas de valores, subtotal e (em `children`) o botão de ação. A sacola não mostra
// o frete (o Figma o esconde lá); o checkout passa `shipping` e o subtotal passa a incluí-lo.
// O cupom aplicado aparece no próprio campo (que vira lápis, ver CouponField) e como linha de desconto; é pelo campo que
// ele se troca ou se remove. Na tela do PIX o pedido já está fechado: não há campo de cupom (sem `onApplyCoupon`, ele some
// e o cupom usado aparece só como linha) e os itens comprados vêm no topo (`items`), com as linhas de valores entre duas
// divisórias.
export default function OrderSummary({
  itemCount,
  productsTotal,
  discount,
  couponCode,
  shipping,
  total,
  items,
  onApplyCoupon,
  onRemoveCoupon,
  children,
}) {
  return (
    <div className="flex flex-col items-end gap-10 rounded-card border-2 border-card-border bg-card px-5 py-6">
      {items}
      <div className="flex w-full flex-col items-center gap-8">
        <div
          className={`flex w-full flex-col gap-[9px] border-b border-black/40 ${onApplyCoupon ? 'pb-3' : 'border-t py-3'}`}
        >
          {onApplyCoupon && <CouponField appliedCode={couponCode} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />}
          <Row label={`Produtos (${itemCount})`} value={formatMoney(productsTotal)} />
          {shipping !== undefined && <Row label="Frete" value={formatMoney(shipping)} />}
          {couponCode && <Row label={`(cupom) ${couponCode}`} value={`-${formatMoney(discount)}`} />}
        </div>
        <div className="flex w-full items-center justify-between text-2xl font-bold text-red-300">
          <span>Subtotal</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>
      {children && <div className="w-full">{children}</div>}
    </div>
  )
}
