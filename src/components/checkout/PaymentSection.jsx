import { useId, useState } from 'react'
import cardIcon from '../../assets/icons/checkout/card.svg'
import selectChevron from '../../assets/icons/checkout/select-chevron-sm.svg'
import { INSTALLMENT_OPTIONS } from '../../data/checkout'
import { formatMoney } from '../../utils/format'
import Collapsible from '../Collapsible'
import SectionHeading from '../SectionHeading'
import CardForm from './CardForm'
import FormToggleRow from './FormToggleRow'
import RadioCard from './RadioCard'
import { handleRadioGroupKeys } from './radioGroupKeys'

const PIX = 'pix'

const installmentLabel = (count, total) => (count === 1 ? 'Preço à vista' : `${count}x de ${formatMoney(total / count)} sem juros`)

function SubHeading({ children }) {
  return <h3 className="p-2.5 font-heading text-2xl font-semibold text-red-300">{children}</h3>
}

// "Forma de pagamento": cartões salvos (com parcelamento), formulário de novo cartão e PIX. A seleção é UMA só para o
// conjunto (um cartão ou o PIX), por isso os dois grupos de rádio compartilham `selected`. `total` é o valor a pagar,
// usado nas opções de parcelamento.
export default function PaymentSection({ cards, selected, onSelect, onAddCard, onRemoveCard, onInstallments, total }) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const formId = useId()
  const noCards = cards.length === 0
  const formOpen = open || noCards
  const selectableIds = [...cards.map((card) => card.id), PIX]

  const toggleForm = () => {
    if (!open) setFormKey((key) => key + 1) // recria o formulário: nada do que foi descartado volta
    setOpen((current) => !current)
  }

  return (
    <section aria-labelledby="payment-title" className="flex flex-col gap-3">
      <div className="flex flex-col">
        <SectionHeading icon={cardIcon}>
          <span id="payment-title">Forma de pagamento</span>
        </SectionHeading>
        <SubHeading>Cartão de Crédito</SubHeading>

        <div className="flex flex-col gap-3">
          <div
            role="radiogroup"
            aria-label="Cartões de crédito"
            onKeyDown={(event) => handleRadioGroupKeys(event, selectableIds, selected, onSelect)}
            className="flex flex-col gap-3"
          >
            {cards.map((card) => (
              <RadioCard
                key={card.id}
                checked={selected === card.id}
                label={`Cartão ${card.brand} final ${card.last4}`}
                onSelect={() => onSelect(card.id)}
                onDelete={() => onRemoveCard(card.id)}
                className="min-h-[135px]"
                deleteLabel={`Excluir o cartão ${card.brand} final ${card.last4}`}
              >
                <p className="h-[30px] font-heading text-xl font-semibold text-red-300">
                  (Crédito) {card.brand}{' '}
                  <span className="font-sans text-base font-normal">terminando em {card.last4}</span>
                </p>
                <p className="text-[15px] leading-[normal] font-medium text-red-300">
                  {card.holder} - Vencimento: {card.expiry}
                </p>
                {/* Select nativo estilizado: abre a lista do sistema (acessível e com teclado de graça). */}
                <div className="relative w-[342px] max-w-full">
                  <select
                    aria-label={`Parcelamento do cartão ${card.brand} final ${card.last4}`}
                    value={card.installments}
                    onChange={(event) => {
                      onInstallments(card.id, Number(event.target.value))
                      onSelect(card.id) // mexer no parcelamento de um cartão é escolher esse cartão
                    }}
                    className="w-full appearance-none rounded-[4px] border border-red-300 bg-transparent py-1 pl-3 pr-9 text-[15px] leading-[normal] font-semibold text-red-300 outline-none transition-shadow duration-200 focus-visible:shadow-ring motion-reduce:transition-none"
                  >
                    {INSTALLMENT_OPTIONS.map((count) => (
                      <option key={count} value={count}>
                        {installmentLabel(count, total)}
                      </option>
                    ))}
                  </select>
                  <img
                    src={selectChevron}
                    alt=""
                    className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-3 -translate-y-1/2"
                  />
                </div>
              </RadioCard>
            ))}
          </div>

          {/* -mb-3 fechado: cancela o gap de 12px do pai (ver Collapsible). */}
          <Collapsible open={formOpen} id={formId} closedClassName="-mb-3">
            <div className="pt-3">
              <CardForm
                key={formKey}
                open={formOpen}
                onSubmit={(card) => {
                  onAddCard({ ...card, id: `cartao-${Date.now()}`, installments: 1 })
                  setOpen(false)
                }}
              />
            </div>
          </Collapsible>

          {!noCards && (
            <FormToggleRow
              open={open}
              controls={formId}
              openLabel="Usar cartão salvo"
              closedLabel="Adicionar novo cartão"
              onClick={toggleForm}
            />
          )}
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="PIX"
        onKeyDown={(event) => handleRadioGroupKeys(event, selectableIds, selected, onSelect)}
        className="flex flex-col"
      >
        <SubHeading>PIX</SubHeading>
        <RadioCard checked={selected === PIX} label="PIX" onSelect={() => onSelect(PIX)} className="gap-2">
          <h4 className="h-[30px] font-heading text-xl font-semibold text-red-300">PIX</h4>
          <p className="text-[15px] leading-[normal] font-medium text-red-300">
            O código Pix gerado para o pagamento é válido por 30 minutos após a finalização do pedido.
          </p>
        </RadioCard>
      </div>
    </section>
  )
}

export { PIX }
