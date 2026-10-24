import { useId, useState } from 'react'
import chevronDown from '../../assets/icons/profile/chevron-down-sm.svg'
import chevronUp from '../../assets/icons/profile/chevron-up-sm.svg'
import { formatPrice } from '../../utils/format'
import ProductThumb from './ProductThumb'
import SectionCard from './SectionCard'
import TrackingDetails from './TrackingDetails'

const STATUS_COLOR = { delivered: 'text-green-200', in_transit: 'text-warning' }

export default function OrderCard({ order }) {
  // Pedidos em andamento já abrem com os detalhes de entrega (é o que o Figma mostra); os entregues, fechados.
  const [expanded, setExpanded] = useState(order.status === 'in_transit')
  const detailsId = useId()
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <SectionCard aria-labelledby={`order-${order.id}-title`}>
      <div className="flex flex-col gap-7">
        <header className="flex items-center justify-between text-xl font-medium">
          <h2 id={`order-${order.id}-title`}>Pedido N° {order.id}</h2>
          <p className={`font-semibold ${STATUS_COLOR[order.status]}`}>{order.statusLabel}</p>
        </header>

        <div className="flex flex-col">
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-[26px] border-b border-neutral-400 pb-3">
                <ProductThumb image={item.image} />
                <div className="flex w-[387px] max-w-full flex-col gap-[9px]">
                  <p className="text-2xl font-semibold">{item.name}</p>
                  <p className="text-sm font-medium">{item.description}</p>
                  <p className="text-sm font-medium">Quantidade: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* A margem muda de 8px (fechado) para 28px (aberto): é a diferença de espaçamento entre os dois pedidos do Figma. */}
          <div className={`transition-[margin] duration-300 motion-reduce:transition-none ${expanded ? 'mt-7' : 'mt-2'}`}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded((current) => !current)}
              className="flex items-center gap-2 text-xl font-medium"
            >
              Detalhes da entrega
              <img src={expanded ? chevronUp : chevronDown} alt="" className="size-5" />
            </button>

            {/* Anima a altura (grid-rows 0fr -> 1fr); `inert` evita que o botão de copiar escondido receba foco. */}
            <div
              id={detailsId}
              inert={!expanded}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <TrackingDetails trackingCode={order.trackingCode} steps={order.steps} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl font-semibold">
          {/* O Figma escreve "Total R$340,00" (sem espaço depois do R$), ao contrário dos preços da vitrine. */}
          Total {formatPrice(order.total).replace(/\s/g, '')}{' '}
          <span className="text-neutral-400">
            ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
          </span>
        </p>
      </div>
    </SectionCard>
  )
}
