import { useId, useState } from 'react'
import editIcon from '../../assets/icons/checkout/edit-sm.svg'
import pinIcon from '../../assets/icons/checkout/pin.svg'
import { formatAddress } from '../../data/checkout'
import Collapsible from '../Collapsible'
import SectionHeading from '../SectionHeading'
import AddressForm from './AddressForm'
import FormToggleRow from './FormToggleRow'
import RadioCard from './RadioCard'
import { handleRadioGroupKeys } from './radioGroupKeys'

// "Endereço de entrega": lista de endereços salvos (um selecionado), formulário de novo endereço/edição e a linha que o
// abre. Como no Figma, o formulário abre ENTRE a lista e a linha, que passa a dizer "Usar endereço salvo" (fecha e
// descarta o que foi digitado). Sem nenhum endereço salvo o formulário fica aberto e a linha some.
export default function AddressSection({ addresses, selectedId, onSelect, onSave, onRemove }) {
  const [open, setOpen] = useState(false)
  // null = endereço novo; um id = editando aquele endereço. Fica guardado mesmo com o formulário fechado (ele ainda está
  // na tela durante a animação de fechar).
  const [editingId, setEditingId] = useState(null)
  // Muda a cada abertura: o formulário é recriado e nunca mostra o que foi digitado (e descartado) da vez anterior.
  const [formKey, setFormKey] = useState(0)
  const formId = useId()

  const noAddresses = addresses.length === 0
  const formOpen = open || noAddresses
  const editing = addresses.find((address) => address.id === editingId)

  const openForm = (id = null) => {
    setEditingId(id)
    setFormKey((key) => key + 1)
    setOpen(true)
  }

  const handleSubmit = (values) => {
    onSave(editing ? { ...editing, ...values } : { ...values, id: `endereco-${Date.now()}`, label: `Endereço ${addresses.length + 1}` })
    setOpen(false)
  }

  return (
    <section aria-labelledby="address-title" className="flex flex-col gap-3">
      <SectionHeading icon={pinIcon}>
        <span id="address-title">Endereço de entrega</span>
      </SectionHeading>

      <div className="flex flex-col gap-3">
        <div
          role="radiogroup"
          aria-label="Endereço de entrega"
          onKeyDown={(event) =>
            handleRadioGroupKeys(
              event,
              addresses.map((address) => address.id),
              selectedId,
              onSelect,
            )
          }
          className="flex flex-col gap-3"
        >
          {addresses.map((address) => (
            <RadioCard
              key={address.id}
              checked={address.id === selectedId}
              label={address.label}
              onSelect={() => onSelect(address.id)}
              onDelete={() => onRemove(address.id)}
              deleteLabel={`Excluir o endereço ${address.label}`}
            >
              <h3 className="h-[30px] font-heading text-2xl font-semibold text-red-300">{address.label}</h3>
              <p className="max-w-[344px] text-[15px] leading-[normal] font-medium text-red-300">{formatAddress(address)}</p>
              <button
                type="button"
                onClick={() => openForm(address.id)}
                className="flex items-center gap-2 self-start rounded-card text-base font-medium text-link"
              >
                <img src={editIcon} alt="" className="size-4" />
                Editar endereço
              </button>
            </RadioCard>
          ))}
        </div>

        {/* -mb-3 fechado: cancela o gap de 12px do pai, para a linha "Adicionar" ficar a 12px da lista, como no Figma. */}
        <Collapsible open={formOpen} id={formId} closedClassName="-mb-3">
          {/* pt-3 + o gap de 12px do pai = os 24px entre a lista e o formulário (dentro do recorte, para fecharem juntos). */}
          <div className="pt-3">
            <AddressForm
              key={formKey}
              open={formOpen}
              initial={editing}
              title={editing ? 'Editar endereço' : 'Novo endereço'}
              submitLabel={editing ? 'Salvar endereço' : 'Adicionar endereço'}
              onSubmit={handleSubmit}
            />
          </div>
        </Collapsible>

        {!noAddresses && (
          <FormToggleRow
            open={open}
            controls={formId}
            openLabel="Usar endereço salvo"
            closedLabel="Adicionar novo endereço"
            onClick={() => (open ? setOpen(false) : openForm())}
          />
        )}
      </div>
    </section>
  )
}
