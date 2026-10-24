import { formatMoney } from '../../utils/format'
import ProductThumb from '../profile/ProductThumb'
import FilterCheckbox from '../search/FilterCheckbox'
import QuantityStepper from './QuantityStepper'

// 110/80: a miniatura do pedido (80x113) ampliada para os 110x155 que a sacola usa.
const THUMB_SCALE = 110 / 80

// Uma linha da sacola: caixinha de seleção sobre a foto, nome/descrição/preço e o contador de quantidade. Só as linhas
// marcadas entram no resumo da compra.
export default function CartItemRow({ item, onToggle, onQuantityChange }) {
  const { product, volume, quantity, selected } = item

  return (
    <li className="flex items-end gap-[26px] border-b border-card-border px-3 pb-6 pt-3">
      <div className="flex items-center gap-5">
        {/* 149px: a caixinha (24px) fica no canto e a foto (110px) encostada à direita, com 15px de folga entre as duas. */}
        <div className="relative h-[155px] w-[149px] shrink-0">
          <div className="absolute left-0 top-0">
            <FilterCheckbox checked={selected} onChange={onToggle}>
              <span className="sr-only">Incluir {product.name} na compra</span>
            </FilterCheckbox>
          </div>
          <div className="absolute right-0 top-0">
            <ProductThumb image={product.image} scale={THUMB_SCALE} />
          </div>
        </div>

        <div className="flex h-[155px] w-[357px] flex-col justify-between pb-[17px]">
          <div className="flex flex-col gap-2">
            <h3 className="h-6 font-heading text-xl font-semibold text-red-200">{product.name}</h3>
            <div className="flex flex-col gap-1 text-base font-medium text-red-100">
              <p>{product.description}</p>
              <p>Tamanho: {volume}</p>
            </div>
          </div>
          <p className="font-heading text-2xl font-semibold text-red-300">{formatMoney(product.price * quantity)}</p>
        </div>
      </div>

      <div className="flex h-[155px] min-w-px flex-1 flex-col items-end justify-end py-[17px]">
        <QuantityStepper quantity={quantity} name={product.name} onChange={onQuantityChange} />
      </div>
    </li>
  )
}
