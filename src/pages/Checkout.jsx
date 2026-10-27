import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import receipt from '../assets/icons/checkout/receipt.svg'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import OrderSummary from '../components/cart/OrderSummary'
import AddressSection from '../components/checkout/AddressSection'
import BagSection from '../components/checkout/BagSection'
import PaymentSection, { PIX } from '../components/checkout/PaymentSection'
import TermsBox from '../components/checkout/TermsBox'
import Header from '../components/header/Header'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'
import { SHIPPING_PRICE } from '../data/checkout'
import { getCheckoutData, saveCheckoutData } from '../services/checkoutData'
import { PIX_EXPIRY_MS } from '../utils/pix'

// Checkout (/checkout). Esquerda: endereço, pagamento e revisão dos itens; direita: resumo da compra e termos.
// Os endereços e cartões são os da conta (stub em memória, ver services/checkoutData.js): uma conta nova começa sem
// nenhum, e com a lista vazia o formulário correspondente já abre sozinho.
export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedItems, selectedCount, subtotal, discount, couponCode, applyCoupon, removeCoupon, setQuantity, removeSelected } =
    useCart()

  const [stored] = useState(() => getCheckoutData(user.email))
  const [addresses, setAddresses] = useState(stored.addresses)
  const [addressId, setAddressId] = useState(stored.addresses[0]?.id ?? null)
  const [cards, setCards] = useState(stored.cards)
  const [payment, setPayment] = useState(stored.cards[0]?.id ?? null) // id de um cartão, 'pix' ou nenhum ainda

  // O que a pessoa cadastra aqui fica na conta para as próximas compras.
  useEffect(() => {
    saveCheckoutData(user.email, { addresses, cards })
  }, [user.email, addresses, cards])
  const [error, setError] = useState()
  // Pedido de confirmação em andamento (null = nenhum modal aberto). Excluir endereço, cartão ou item da sacola só
  // acontece depois do "Excluir"/"Remover" do modal.
  const [confirmation, setConfirmation] = useState(null)
  // Ao finalizar, a sacola é esvaziada e a tela navega para a confirmação: sem isto, o "sem itens" abaixo mandaria de
  // volta para a sacola no mesmo instante.
  const [finished, setFinished] = useState(false)

  // Sem itens marcados não há o que pagar (ex.: a página foi aberta direto): volta para a sacola.
  if (finished) return null
  if (selectedItems.length === 0) return <Navigate to="/sacola" replace />

  const total = subtotal - discount + SHIPPING_PRICE

  const saveAddress = (address) => {
    setAddresses((current) =>
      current.some((item) => item.id === address.id)
        ? current.map((item) => (item.id === address.id ? address : item))
        : [...current, address],
    )
    setAddressId(address.id) // o endereço que acabou de ser salvo já fica selecionado
    setError(undefined)
  }

  const askToConfirm = ({ title, description, confirmLabel, action }) =>
    setConfirmation({
      title,
      description,
      confirmLabel,
      onConfirm: () => {
        setConfirmation(null)
        action()
      },
    })

  const removeAddress = (id) => {
    const remaining = addresses.filter((address) => address.id !== id)
    setAddresses(remaining)
    // Se o selecionado foi excluído, passa para o primeiro que sobrou (ou nenhum).
    if (addressId === id) setAddressId(remaining[0]?.id ?? null)
  }

  const addCard = (card) => {
    setCards((current) => [...current, card])
    setPayment(card.id)
    setError(undefined)
  }

  const removeCard = (id) => {
    setCards((current) => current.filter((card) => card.id !== id))
    if (payment === id) setPayment(null)
  }

  const finish = () => {
    if (!addressId) return setError('Escolha ou cadastre um endereço de entrega.')
    if (!payment) return setError('Escolha uma forma de pagamento.')
    setError(undefined)
    const isPix = payment === PIX
    const card = cards.find((item) => item.id === payment)
    // Tudo o que as telas seguintes mostram, em dados simples (a sacola é esvaziada logo abaixo e o estado da navegação
    // só guarda o que pode ser copiado). Sem backend, o número do pedido é sorteado aqui.
    const order = {
      code: `FYS-${10000 + Math.floor(Math.random() * 90000)}`,
      method: isPix ? 'pix' : 'card',
      paymentLabel: isPix ? 'Pix à vista' : card.installments > 1 ? `Cartão de crédito em ${card.installments}x` : 'Cartão de crédito à vista',
      total,
      productsTotal: subtotal,
      shipping: SHIPPING_PRICE,
      discount,
      couponCode,
      itemCount: selectedCount,
      items: selectedItems.map(({ key, product, volume, quantity }) => ({
        key,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        volume,
        quantity,
      })),
      address: addresses.find((address) => address.id === addressId),
      // PIX: o código vale 30 minutos a partir de agora.
      expiresAt: isPix ? Date.now() + PIX_EXPIRY_MS : null,
    }
    setFinished(true)
    removeSelected() // o que foi comprado sai da sacola
    // PIX ainda precisa ser pago (tela com o código); cartão já sai aprovado.
    navigate(isPix ? '/pagamento-pix' : '/pedido-concluido', { state: { order } })
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      <Header minimal />

      <main className="mx-auto max-w-content pb-16 pt-[92px]">
        <Breadcrumb className="mb-3" items={[{ label: 'Página Inicial', to: '/' }, { label: 'Sua sacola', to: '/sacola' }, { label: 'Checkout' }]} />

        <div className="grid grid-cols-[845px_minmax(0,1fr)] items-start gap-x-6">
          <div className="flex flex-col gap-[30px]">
            <AddressSection
              addresses={addresses}
              selectedId={addressId}
              onSelect={(id) => {
                setAddressId(id)
                setError(undefined)
              }}
              onSave={saveAddress}
              onRemove={(id) => {
                const address = addresses.find((item) => item.id === id)
                askToConfirm({
                  title: 'Excluir endereço?',
                  description: `O endereço “${address.label}” será excluído e não poderá ser usado nesta compra. Essa ação não pode ser desfeita.`,
                  confirmLabel: 'Excluir',
                  action: () => removeAddress(id),
                })
              }}
            />
            <PaymentSection
              cards={cards}
              selected={payment}
              onSelect={(id) => {
                setPayment(id)
                setError(undefined)
              }}
              onAddCard={addCard}
              onRemoveCard={(id) => {
                const card = cards.find((item) => item.id === id)
                askToConfirm({
                  title: 'Excluir cartão?',
                  description: `O cartão ${card.brand} final ${card.last4} será excluído. Essa ação não pode ser desfeita.`,
                  confirmLabel: 'Excluir',
                  action: () => removeCard(id),
                })
              }}
              onInstallments={(id, installments) =>
                setCards((current) => current.map((card) => (card.id === id ? { ...card, installments } : card)))
              }
              total={total}
            />
            {/* 17px a mais que o gap das outras seções: é a distância que o Figma deixa até "Sua sacola". */}
            <div className="mt-[17px]">
              <BagSection
                items={selectedItems}
                onQuantityChange={(key, quantity) => {
                  // Diminuir de 1 para 0 (a lixeira do contador) tira o item da sacola: antes, pede confirmação.
                  if (quantity > 0) return setQuantity(key, quantity)
                  const { product, volume } = selectedItems.find((item) => item.key === key)
                  askToConfirm({
                    title: 'Remover da sacola?',
                    description: `“${product.name}” (${volume}) sairá da sua sacola.`,
                    confirmLabel: 'Remover',
                    action: () => setQuantity(key, 0),
                  })
                }}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-[29px]">
            <section aria-labelledby="summary-title" className="flex flex-col gap-3">
              <SectionHeading icon={receipt}>
                <span id="summary-title">Resumo da compra</span>
              </SectionHeading>
              <OrderSummary
                itemCount={selectedCount}
                productsTotal={subtotal}
                shipping={SHIPPING_PRICE}
                discount={discount}
                couponCode={couponCode}
                total={total}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
              >
                <div className="flex flex-col gap-3">
                  <Button type="button" size="large" onClick={finish} className="w-full">
                    Finalizar compra
                  </Button>
                  {/* role="alert": o leitor de tela anuncia o que falta assim que o botão é acionado. */}
                  {error && (
                    <p role="alert" className="text-base font-semibold text-error">
                      {error}
                    </p>
                  )}
                </div>
              </OrderSummary>
            </section>
            <TermsBox />
          </aside>
        </div>
      </main>

      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </div>
  )
}
