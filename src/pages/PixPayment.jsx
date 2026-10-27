import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import clock from '../assets/icons/checkout/clock.svg'
import copyIcon from '../assets/icons/checkout/copy.svg'
import pinIcon from '../assets/icons/checkout/pin.svg'
import qrHeading from '../assets/icons/checkout/qr-heading.svg'
import receipt from '../assets/icons/checkout/receipt.svg'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import OrderSummary from '../components/cart/OrderSummary'
import PixQrCode from '../components/checkout/PixQrCode'
import Header from '../components/header/Header'
import ProductThumb from '../components/profile/ProductThumb'
import SectionHeading from '../components/SectionHeading'
import { formatDeliveryAddress } from '../data/checkout'
import { formatPrice } from '../utils/format'
import { PIX_DEMO_CONFIRMATION_MS, PIX_EXPIRY_MS, buildPixCode, formatCountdown } from '../utils/pix'

// A miniatura do Figma tem 38x53: é a de 80x113 reduzida.
const THUMB_SCALE = 38 / 80

const STEPS = [
  { title: 'Copie o código', text: 'Toque em “Copiar código PIX” acima', className: 'w-[263px]', textClassName: 'w-[259px]' },
  { title: 'Cole no app do banco', text: 'Na área PIX, escolha “Pix Copia e Cola” e cole o código', className: 'w-[263px]', textClassName: 'w-[236px]' },
  {
    title: 'Confira e confirme',
    text: 'Verifique o valor e o recebedor Fysikos antes de pagar',
    className: 'w-[251px]',
    textClassName: 'w-[235px]',
  },
]

// Item comprado, na primeira linha do resumo: miniatura, nome, descrição, quantidade/volume e preço.
function SummaryItem({ item }) {
  return (
    <li className="flex w-full items-start gap-3">
      <ProductThumb image={item.image} scale={THUMB_SCALE} />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex w-[189px] flex-col gap-2">
          <div className="flex flex-col gap-1 font-semibold text-red-300">
            <p className="font-heading text-sm">{item.name}</p>
            <p className="text-xs">{item.description}</p>
          </div>
          <p className="flex items-center gap-3 text-[13px] text-muted">
            <span>Qtd. {item.quantity}</span>
            <span>Vol. {item.volume}</span>
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-red-300">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </li>
  )
}

// Pagamento por PIX (/pagamento-pix), logo depois do "Finalizar compra" com PIX. Esquerda: o código (copia e cola e QR
// Code) com o tempo que falta para ele vencer, e o passo a passo; direita: o resumo do que foi comprado e o endereço.
// Os dados do pedido chegam pelo estado da navegação (ver Checkout.jsx); aberta direto, a tela volta para a Home.
//
// Não existe backend: o código é de exemplo (utils/pix.js) e o pagamento é "reconhecido" sozinho, pouco depois de o
// código ser copiado (PIX_DEMO_CONFIRMATION_MS), levando à confirmação do pedido.
export default function PixPayment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  // "Gerar novo código" recomeça os 30 minutos; sem backend, o código em si é o mesmo (só muda o prazo).
  const [expiresAt, setExpiresAt] = useState(order?.expiresAt ?? 0)
  const [now, setNow] = useState(() => Date.now())
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied' | 'selected'
  const copyTimer = useRef()
  const confirmTimer = useRef()
  const codeRef = useRef(null)

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      clearInterval(tick)
      clearTimeout(copyTimer.current)
      clearTimeout(confirmTimer.current)
    }
  }, [])

  if (!order || order.method !== 'pix') return <Navigate to="/" replace />

  const pixCode = buildPixCode(order.total)
  const remaining = Math.max(0, expiresAt - now)
  const expired = remaining === 0
  const progress = Math.min(100, (remaining / PIX_EXPIRY_MS) * 100)

  const showCopyState = (next) => {
    setCopyState(next)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyState('idle'), 2500)
  }

  // Copiou = a pessoa vai pagar no app do banco: dispara o "pagamento reconhecido" de mentira (ver acima).
  const expectPayment = () => {
    clearTimeout(confirmTimer.current)
    confirmTimer.current = setTimeout(
      () => navigate('/pedido-concluido', { state: { order }, replace: true }),
      PIX_DEMO_CONFIRMATION_MS,
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      showCopyState('copied')
      expectPayment()
    } catch {
      // Sem permissão para a área de transferência (ex.: página sem HTTPS): deixa o código selecionado para Ctrl+C.
      const range = document.createRange()
      range.selectNodeContents(codeRef.current)
      window.getSelection()?.removeAllRanges()
      window.getSelection()?.addRange(range)
      showCopyState('selected')
      expectPayment()
    }
  }

  const { address } = order
  const copyLabel = copyState === 'copied' ? 'Código copiado!' : copyState === 'selected' ? 'Código selecionado: Ctrl+C' : 'Copiar código pix'

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-700">
      <Header minimal />

      <main className="mx-auto max-w-content pb-16 pt-[92px]">
        <Breadcrumb
          className="mb-3"
          items={[{ label: 'Página Inicial', to: '/' }, { label: 'Sua sacola', to: '/sacola' }, { label: 'Pagamento PIX' }]}
        />

        <div className="grid grid-cols-[845px_minmax(0,1fr)] items-start gap-x-6">
          <div className="flex flex-col gap-[30px]">
            <section aria-labelledby="pix-title" className="flex flex-col gap-1">
              <div className="flex items-center">
                <img src={qrHeading} alt="" className="size-6 shrink-0" />
                <h1 id="pix-title" className="p-2.5 font-heading text-[2rem] font-semibold leading-[normal] text-red-300">
                  Pix copia e cola
                </h1>
              </div>
              <p className="p-2.5 text-sm font-medium text-red-300">
                Seu pedido #<span className="font-extrabold">{order.code}</span> foi registrado. Assim que o pagamento for
                confirmado, começaremos a separar seus produtos.
              </p>
            </section>

            <section
              aria-label="Pagamento"
              className="flex w-[803px] flex-col gap-8 rounded-card border-2 border-card-border bg-card p-8"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-end justify-between">
                  {/* role="status": quem usa leitor de tela ouve quando o código vence. */}
                  <p
                    role="status"
                    className="flex w-[202px] items-center justify-center rounded-[32px] bg-field p-2.5 text-sm font-bold text-badge"
                  >
                    {expired ? 'Código expirado' : 'Aguardando pagamento'}
                  </p>
                  <div className="flex items-end gap-3">
                    <p className="flex h-[25px] items-center gap-[9px] font-nunito text-sm text-red-100">
                      <img src={clock} alt="" className="size-4" />O código expira em
                    </p>
                    <p className="text-lg font-bold text-red-300">{formatCountdown(remaining)}</p>
                  </div>
                </div>
                {/* Barra de tempo: começa cheia e esvazia até o código vencer (a leitura em texto é o contador). */}
                <div aria-hidden className="h-1 w-full rounded-xl bg-field">
                  <div className="h-1 rounded-xl bg-green-300 transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="px-7">
                  <div className="flex min-w-[146px] flex-col whitespace-nowrap">
                    <p className="text-sm font-medium text-link">Valor a pagar</p>
                    <p className="text-[2rem] font-bold text-red-300">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex w-[735px] items-start justify-center gap-[60px]">
                    <div className="flex w-[489px] flex-col gap-4">
                      <div className="flex flex-col gap-2 text-sm font-medium text-red-300">
                        <p id="pix-code-label">Código PIX copia e cola</p>
                        <div className="flex items-center justify-center rounded-card border-2 border-card-border bg-panel p-2.5">
                          <p ref={codeRef} aria-labelledby="pix-code-label" className="w-[469px] break-all">
                            {pixCode}
                          </p>
                        </div>
                      </div>
                      <Button type="button" size="large" icon={copyIcon} onClick={copy} disabled={expired} className="w-full">
                        {/* aria-live: o leitor de tela anuncia "Código copiado!" sem o foco sair do botão. */}
                        <span aria-live="polite">{copyLabel}</span>
                      </Button>
                    </div>

                    <div className="flex w-[130px] flex-col items-center gap-2 font-medium text-red-300">
                      <p className="w-[130px] text-center text-sm">QR Code</p>
                      <PixQrCode />
                      <p className="w-[130px] py-2.5 text-center text-xs">Escaneie o QR Code pelo app do seu banco</p>
                    </div>
                  </div>
                </div>
              </div>

              {expired && (
                <div className="flex items-center justify-between gap-4 rounded-card bg-field p-3 text-sm font-medium text-red-300">
                  <p>O tempo do código acabou. Gere um novo código para pagar este pedido.</p>
                  <Button type="button" size="small" variant="outline" onClick={() => setExpiresAt(Date.now() + PIX_EXPIRY_MS)}>
                    Gerar novo código
                  </Button>
                </div>
              )}
            </section>

            <section aria-labelledby="how-to-pay" className="flex flex-col gap-3">
              <h2 id="how-to-pay" className="font-heading text-xl font-semibold text-red-300">
                Como pagar
              </h2>
              <ol className="flex items-start justify-between text-base text-red-300">
                {STEPS.map((step, index) => (
                  <li key={step.title} className={`flex items-start gap-1.5 ${step.className ?? ''}`}>
                    <span
                      aria-hidden
                      className="flex size-[21px] shrink-0 items-center justify-center rounded-full border border-red-300 text-[10px] font-extrabold"
                    >
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">{step.title}</p>
                      <p className={`font-medium ${step.textClassName}`}>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            <section aria-labelledby="summary-title" className="flex flex-col gap-3">
              <SectionHeading icon={receipt}>
                <span id="summary-title">Resumo da compra</span>
              </SectionHeading>
              <OrderSummary
                itemCount={order.itemCount}
                productsTotal={order.productsTotal}
                shipping={order.shipping}
                discount={order.discount}
                couponCode={order.couponCode}
                total={order.total}
                items={
                  <ul className="flex w-full flex-col gap-4">
                    {order.items.map((item) => (
                      <SummaryItem key={item.key} item={item} />
                    ))}
                  </ul>
                }
              />
            </section>

            <section aria-label="Entrega" className="flex items-start gap-3">
              <img src={pinIcon} alt="" className="size-6 shrink-0" />
              <div className="flex w-[374px] flex-col justify-center gap-1 text-base text-black">
                <h2 className="font-bold">Entrega em {address.label}</h2>
                <p>{formatDeliveryAddress(address)}</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
