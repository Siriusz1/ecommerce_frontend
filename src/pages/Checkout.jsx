import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import receipt from '../assets/icons/checkout/receipt.svg'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import OrderSummary from '../components/cart/OrderSummary'
import AddressSection from '../components/checkout/AddressSection'
import BagSection from '../components/checkout/BagSection'
import PaymentSection, { PIX } from '../components/checkout/PaymentSection'
import TermsBox from '../components/checkout/TermsBox'
import Header from '../components/header/Header'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/useCart'
import { SHIPPING_PRICE, initialAddresses, initialCards } from '../data/checkout'

// Checkout (/checkout). Esquerda: endereço, pagamento e revisão dos itens; direita: resumo da compra e termos.
// Os endereços e cartões "salvos" são dados de exemplo (não há backend) e vivem só enquanto a tela está aberta.
export default function Checkout() {
  const navigate = useNavigate()
  const { selectedItems, selectedCount, subtotal, discount, couponCode, applyCoupon, removeCoupon, setQuantity, removeSelected } =
    useCart()

  const [addresses, setAddresses] = useState(initialAddresses)
  const [addressId, setAddressId] = useState(initialAddresses[0].id)
  const [cards, setCards] = useState(initialCards)
  const [payment, setPayment] = useState(initialCards[0].id) // id de um cartão ou 'pix'
  const [error, setError] = useState()
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
    setFinished(true)
    removeSelected() // o que foi comprado sai da sacola
    navigate('/pedido-concluido', { state: { total, payment: payment === PIX ? 'PIX' : 'Cartão de crédito' } })
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
              onRemove={removeAddress}
            />
            <PaymentSection
              cards={cards}
              selected={payment}
              onSelect={(id) => {
                setPayment(id)
                setError(undefined)
              }}
              onAddCard={addCard}
              onRemoveCard={removeCard}
              onInstallments={(id, installments) =>
                setCards((current) => current.map((card) => (card.id === id ? { ...card, installments } : card)))
              }
              total={total}
            />
            {/* 17px a mais que o gap das outras seções: é a distância que o Figma deixa até "Sua sacola". */}
            <div className="mt-[17px]">
              <BagSection items={selectedItems} onQuantityChange={setQuantity} />
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
    </div>
  )
}
