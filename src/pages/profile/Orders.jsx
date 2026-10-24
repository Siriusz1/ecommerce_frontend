import OrderCard from '../../components/profile/OrderCard'
import { orders } from '../../data/orders'

export default function Orders() {
  return (
    // -mt-px: o menu começa em y=217 e o 1º pedido, no Figma, em y=216.
    <div className="-mt-px flex flex-col gap-8">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
