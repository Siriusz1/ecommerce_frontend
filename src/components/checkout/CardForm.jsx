import { useEffect, useRef, useState } from 'react'
import saveIcon from '../../assets/icons/profile/save-white.svg'
import { formatCardNumber, formatExpiry, onlyDigits } from '../../utils/format'
import { cardBrand, validateCard } from '../../utils/checkoutValidation'
import Button from '../Button'
import TextField from './TextField'

const EMPTY = { number: '', holder: '', expiry: '', cvv: '' }

// Formulário de novo cartão. O Figma não o desenha: segue o mesmo padrão do formulário de endereço (cartão bege, campos
// de 60px, botão à direita) e as mesmas regras de funcionamento. O número é validado pelo dígito verificador (Luhn); um
// número de teste que passa é 4111 1111 1111 1111.
export default function CardForm({ open, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const firstFieldRef = useRef(null)

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

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validateCard(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const digits = onlyDigits(values.number)
    onSubmit({
      brand: cardBrand(values.number),
      last4: digits.slice(-4),
      holder: values.holder.trim(),
      // O formulário pede "MM/AA"; a lista mostra "MM/AAAA", como no Figma.
      expiry: `${values.expiry.slice(0, 3)}20${values.expiry.slice(3)}`,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Novo cartão"
      className="flex flex-col items-end gap-6 rounded-card border border-card-border bg-card p-6"
    >
      <div className="flex w-full flex-col gap-6">
        <h3 className="font-heading text-2xl font-semibold text-red-300">Novo cartão</h3>
        <div className="flex flex-col gap-2">
          <TextField
            ref={firstFieldRef}
            label="Número do cartão"
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            {...bind('number', formatCardNumber)}
          />
          <TextField
            label="Nome impresso no cartão"
            placeholder="Como está no cartão"
            autoComplete="cc-name"
            {...bind('holder')}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Validade"
              placeholder="MM/AA"
              inputMode="numeric"
              autoComplete="cc-exp"
              {...bind('expiry', formatExpiry)}
            />
            <TextField
              label="Código de segurança"
              placeholder="123"
              inputMode="numeric"
              maxLength={4}
              autoComplete="cc-csc"
              {...bind('cvv', onlyDigits)}
            />
          </div>
        </div>
      </div>
      <Button type="submit" size="large" icon={saveIcon} className="w-[367px] max-w-full">
        Adicionar cartão
      </Button>
    </form>
  )
}
