import closeIcon from '../../assets/icons/profile/close.svg'
import { formatMoney } from '../../utils/format'
import CouponField from './CouponField'

function Row({ label, value, children }) {
  return (
    <div className="flex items-center justify-between text-base text-red-200">
      <span className="flex items-center gap-1.5">
        {label}
        {children}
      </span>
      <span>{value}</span>
    </div>
  )
}

// Cartão "Resumo da compra": cupom, linhas de valores, subtotal e (em `children`) o botão de ação. A sacola não mostra
// o frete (o Figma o esconde lá); o checkout passa `shipping` e o subtotal passa a incluí-lo.
export default function OrderSummary({
  itemCount,
  productsTotal,
  discount,
  couponCode,
  shipping,
  total,
  onApplyCoupon,
  onRemoveCoupon,
  children,
}) {
  return (
    <div className="flex flex-col items-end gap-10 rounded-[10px] border-2 border-card-border bg-card px-5 py-6">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full flex-col gap-[9px] border-b border-black/40 pb-3">
          <CouponField onApply={onApplyCoupon} />
          <Row label={`Produtos (${itemCount})`} value={formatMoney(productsTotal)} />
          {shipping !== undefined && <Row label="Frete" value={formatMoney(shipping)} />}
          {couponCode && (
            <Row label={`(cupom) ${couponCode}`} value={`-${formatMoney(discount)}`}>
              <button
                type="button"
                onClick={onRemoveCoupon}
                aria-label={`Remover o cupom ${couponCode}`}
                className="rounded-card"
              >
                <img src={closeIcon} alt="" className="size-4" />
              </button>
            </Row>
          )}
        </div>
        <div className="flex w-full items-center justify-between text-2xl font-bold text-red-300">
          <span>Subtotal</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}
