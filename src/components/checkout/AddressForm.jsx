import { useEffect, useRef, useState } from 'react'
import { formatCep } from '../../utils/format'
import { validateAddress } from '../../utils/checkoutValidation'
import SaveButton from '../profile/SaveButton'
import TextField from './TextField'

const EMPTY = { cep: '', street: '', number: '', complement: '', district: '', city: '', uf: '' }
// Obrigatórios para salvar (o complemento é opcional).
const REQUIRED = ['cep', 'street', 'number', 'district', 'city', 'uf']
const FIELDS = [...REQUIRED, 'complement']

// Formulário de endereço (novo ou edição). Mesmo desenho do Figma: título em Fraunces 24, três linhas de campos
// (CEP + Rua / Número + Complemento / Bairro + Cidade + UF) e o botão à direita. As larguras do Figma viram proporções
// (fr), para a grade acompanhar a coluna. Validação ao enviar (Enter ou botão); cada erro some quando o campo é corrigido.
export default function AddressForm({ initial, title, submitLabel, onSubmit, open }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const firstFieldRef = useRef(null)

  // Ao abrir, o foco vai para o 1º campo. `preventScroll`: o painel ainda está começando a abrir dentro de um recorte.
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => firstFieldRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [open])

  const bind = (field, format = (value) => value) => ({
    value: values[field],
    error: errors[field],
    onChange: (event) => {
      setValues((current) => ({ ...current, [field]: format(event.target.value) }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    },
  })

  // O botão só libera com todos os campos obrigatórios preenchidos E, ao editar, com alguma mudança em relação ao endereço salvo.
  const filled = REQUIRED.every((field) => values[field].trim())
  const changed = !initial || FIELDS.some((field) => values[field].trim() !== (initial[field] ?? '').trim())
  const canSave = filled && changed

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSave) return
    const found = validateAddress(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSubmit({ ...values, uf: values.uf.trim().toUpperCase() })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={title}
      className="flex flex-col items-end gap-6 rounded-card border-2 border-card-border bg-card p-6"
    >
      <div className="flex w-full flex-col gap-6">
        <h3 className="font-heading text-2xl font-semibold text-red-300">{title}</h3>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[262fr_530fr] gap-3">
            <TextField
              ref={firstFieldRef}
              label="CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              {...bind('cep', formatCep)}
            />
            <TextField label="Rua" autoComplete="address-line1" {...bind('street')} />
          </div>
          <div className="grid grid-cols-[215fr_577fr] gap-3">
            <TextField label="Número" autoComplete="off" {...bind('number')} />
            <TextField
              label="Complemento (Apto, bloco, referência)"
              optional
              autoComplete="address-line2"
              {...bind('complement')}
            />
          </div>
          <div className="grid grid-cols-[377fr_289fr_114fr] gap-3">
            <TextField label="Bairro" autoComplete="off" {...bind('district')} />
            <TextField label="Cidade" autoComplete="address-level2" {...bind('city')} />
            <TextField
              label="UF"
              maxLength={2}
              autoComplete="address-level1"
              {...bind('uf', (value) => value.toUpperCase())}
            />
          </div>
        </div>
      </div>
      <SaveButton size="large" disabled={!canSave} className="w-[367px] max-w-full">
        {submitLabel}
      </SaveButton>
    </form>
  )
}
