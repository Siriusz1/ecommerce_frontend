import { useState } from 'react'
import bagTitle from '../../assets/icons/checkout/bag-title.svg'
import { DELIVERY_DAYS } from '../../data/checkout'
import { formatDeliveryDate, formatMoney } from '../../utils/format'
import QuantityStepper from '../cart/QuantityStepper'
import ProductThumb from '../profile/ProductThumb'

// Foto de 172x154 no Figma; a miniatura (80x113) é ampliada para caber na altura.
const THUMB_SCALE = 154 / 113

// "Sua sacola(n)" do checkout: revisão dos itens que serão comprados, com a data de entrega prevista e o mesmo contador
// de quantidade da sacola (a lixeira com 1 unidade remove o item). A data é "hoje + 5 dias" e vale para todos os itens.
export default function BagSection({ items, onQuantityChange }) {
  // Calculada uma vez, quando a tela abre (a data não muda enquanto a pessoa está nela).
  const [delivery] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + DELIVERY_DAYS)
    return date
  })
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <section aria-labelledby="checkout-bag-title" className="flex flex-col gap-3">
      {/* O Figma recua este título: o ícone fica numa caixa de 44px com 10px de margem (o texto começa em x=64). */}
      <div className="ml-2.5 flex h-[59px] items-center gap-2.5 py-2.5">
        <span className="flex items-center p-2.5">
          <img src={bagTitle} alt="" className="size-6" />
        </span>
        <h2
          id="checkout-bag-title"
          className="font-heading text-[2rem] font-semibold leading-[normal] text-red-300"
        >
          Sua sacola({count})
        </h2>
      </div>

      <ul className="flex flex-col">
        {items.map(({ key, product, volume, quantity }) => (
          <li key={key} className="flex items-start justify-end gap-5 border-b border-card-border px-3 pb-6 pt-3">
            <div className="flex items-center gap-[9px]">
              <div className="flex h-[154px] w-[172px] shrink-0 items-center justify-center rounded-[10px]">
                <ProductThumb image={product.image} scale={THUMB_SCALE} />
              </div>
              <div className="flex w-[357px] flex-col gap-[33px]">
                <div className="flex flex-col gap-2">
                  <h3 className="h-6 font-heading text-xl font-semibold text-red-200">{product.name}</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 text-base font-medium text-red-100">
                      <p>{product.description}</p>
                      <p>Tamanho: {volume}</p>
                    </div>
                    <p className="font-heading text-2xl font-semibold text-red-300">
                      {formatMoney(product.price * quantity)}
                    </p>
                  </div>
                </div>
                <QuantityStepper quantity={quantity} name={product.name} onChange={(next) => onQuantityChange(key, next)} />
              </div>
            </div>
            <p className="w-[261px] text-right text-base font-medium text-black">
              <span className="sr-only">Entrega prevista: </span>
              {formatDeliveryDate(delivery)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
