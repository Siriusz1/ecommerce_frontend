import { useRef } from 'react'
import fieldEdit from '../../assets/icons/admin/field-edit.svg'
import photoAdd from '../../assets/icons/admin/photo-add.svg'
import photoRemove from '../../assets/icons/admin/photo-remove.svg'
import { formatPrice } from '../../utils/format'
import { parseMoney } from '../../utils/admin'
import { Field, Select } from './AdminField'
import { fieldClass } from './fieldClass'
import StockStepper from './StockStepper'

// Peças compartilhadas pelas telas de produto do painel:
//   - ProductEditor (/admin/produtos/novo e /admin/produtos/:produto/editar): o que é do PRODUTO (nome, descrição,
//     categoria, filtros e fotos), igual para todos os volumes;
//   - VariantEditor (/admin/produtos/:produto/volumes/...): o que é de cada VOLUME (volume, código, estoque e preços).
// Um volume herda tudo do produto; ele só existe para ter preço, estoque e código próprios.

export const MAX_PHOTOS = 5
export const LABEL = 'text-xl' // rótulos dos campos: Mulish 20px (o peso semibold vem do Field)
// Volumes oferecidos na lista (Figma: o volume é escolhido, não digitado). O volume atual entra na lista mesmo que não
// esteja aqui (ex.: "Kit 3 itens").
const VOLUMES = ['15 ml', '30 ml', '50 ml', '60 ml', '90 ml', '100 ml', '120 ml', '150 ml', '200 ml', '250 ml', '400 ml', '50 g', '100 g', '250 g']

// Bloco do formulário. Títulos em Mulish 24px; o de fotos (e os blocos de apoio), Fraunces 23px (Figma).
export function Section({ title, aside, heading = 'sans', strong = false, children }) {
  return (
    <section className={`flex flex-col gap-5 rounded-card border-card-border bg-card p-6 ${strong ? 'border-2' : 'border'}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={heading === 'serif' ? 'font-heading text-[23px] font-semibold text-red-300' : 'text-2xl font-semibold text-red-300'}>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

// Campo de texto com o lápis à direita (Figma): só um indicativo de que dá para editar.
export function EditableInput({ multiline = false, className = '', ...props }) {
  const Element = multiline ? 'textarea' : 'input'
  return (
    <div className="relative">
      <Element {...props} className={`${fieldClass} pr-11 ${className}`} />
      {!props.disabled && (
        <img src={fieldEdit} alt="" className={`pointer-events-none absolute right-3 size-6 ${multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}`} />
      )}
    </div>
  )
}

// Fotos do produto (valem para todos os volumes): 220x220, a primeira é a "Principal" (a do cartão da loja). Cada foto pode
// virar a principal ou sair; os espaços tracejados abrem o seletor de arquivos.
export function PhotoManager({ photos, onChange }) {
  const fileRef = useRef(null)

  const addPhotos = (event) => {
    const files = [...event.target.files].filter((file) => file.type.startsWith('image/'))
    event.target.value = '' // permite escolher o mesmo arquivo de novo
    onChange([...photos, ...files.slice(0, MAX_PHOTOS - photos.length).map((file) => URL.createObjectURL(file))])
  }
  const makePrincipal = (index) => onChange([photos[index], ...photos.filter((_, i) => i !== index)])

  return (
    <>
      <ul className="-mb-1 flex gap-4 overflow-x-auto pb-3 [scrollbar-color:var(--color-neutral-400)_transparent]">
        {photos.map((src, index) => (
          <li key={src} className="group relative size-[220px] shrink-0 overflow-hidden rounded-card">
            <img src={src} alt={`Foto ${index + 1} do produto`} className="size-full object-cover" />
            <div className="absolute inset-x-3 top-3 flex items-start justify-between">
              {index === 0 ? <span className="rounded-full bg-red-300 px-2.5 py-1 text-xs font-bold text-neutral-700">Principal</span> : <span />}
              <button
                type="button"
                aria-label={`Remover a foto ${index + 1}`}
                onClick={() => onChange(photos.filter((_, i) => i !== index))}
                className="rounded-full bg-neutral-700"
              >
                <img src={photoRemove} alt="" className="size-5" />
              </button>
            </div>
            {/* Aparece ao passar o mouse (ou ao chegar pelo teclado) nas fotos que não são a principal. */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => makePrincipal(index)}
                className="absolute inset-x-3 bottom-3 rounded-card bg-neutral-700/95 py-2 text-sm font-semibold text-red-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none"
              >
                Tornar principal
              </button>
            )}
          </li>
        ))}
        {Array.from({ length: MAX_PHOTOS - photos.length }, (_, slot) => (
          <li key={`slot-${slot}`} className="shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-[220px] flex-col items-center justify-center gap-2 rounded-card border-[1.5px] border-dashed border-photo-border bg-panel text-[13px] font-medium text-placeholder"
            >
              <img src={photoAdd} alt="" className="size-6" />
              <span className="text-center">
                Foto
                <br />
                {photos.length + slot + 1}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} aria-label="Adicionar fotos" />
    </>
  )
}

const moneyField = (value, setValue) => ({
  inputMode: 'decimal',
  value,
  placeholder: 'R$ 0,00',
  onChange: (event) => setValue(event.target.value),
  onFocus: (event) => event.target.select(),
  // Ao sair do campo o valor vira "R$ 89,90"; o que não é número fica como está (o erro aparece embaixo).
  onBlur: () => {
    const parsed = parseMoney(value)
    if (parsed !== null) setValue(formatPrice(parsed))
  },
})

// Campos do volume (bloco "Estoque e preços" do Figma): código, volume, estoque, preço de venda e promocional.
export function VariantFields({ form }) {
  const volumeOptions = [...new Set([...(form.volume && !VOLUMES.includes(form.volume) ? [form.volume] : []), ...VOLUMES])]
  return (
    <>
      <div className="flex items-start gap-5">
        <Field label="Código do produto" labelClassName={LABEL} className="w-[183px] shrink-0">
          {(fieldProps) => (
            <input
              {...fieldProps}
              readOnly
              value={form.sku}
              placeholder="Automático"
              title="Gerado a partir do nome do produto e do volume"
              className={`${fieldClass} h-14 bg-field-readonly! font-semibold text-red-800/60!`}
            />
          )}
        </Field>
        <Field label="Volume *" labelClassName={LABEL} error={form.volumeError} className="w-[216px] shrink-0">
          {(fieldProps) => (
            <Select
              {...fieldProps}
              height="h-14"
              value={form.volume}
              onChange={(event) => form.setVolume(event.target.value)}
              options={[{ value: '', label: 'Selecione' }, ...volumeOptions.map((item) => ({ value: item, label: item }))]}
            />
          )}
        </Field>
        <Field label="Estoque disponível *" labelClassName={LABEL} className="w-[194px] shrink-0">
          {(fieldProps) => <StockStepper id={fieldProps.id} variant="field" label="estoque disponível" value={form.stock} onChange={form.setStock} />}
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-5">
          <Field label="Preço de venda *" labelClassName={LABEL} className="flex-1">
            {(fieldProps) => <EditableInput {...fieldProps} {...moneyField(form.priceText, form.setPriceText)} className="h-14 text-xl" />}
          </Field>
          <Field label="Preço promocional" labelClassName={LABEL} error={form.promoError} className="flex-1">
            {(fieldProps) => <EditableInput {...fieldProps} {...moneyField(form.promoText, form.setPromoText)} className="h-14 text-xl" />}
          </Field>
        </div>
        <p className="text-sm leading-normal text-muted">
          O preço promocional será aplicado na loja por 30 dias. Após esse período, o preço de venda será restaurado
          automaticamente.
        </p>
      </div>
    </>
  )
}

// Rodapé das telas de produto: aviso à esquerda, Cancelar e a ação principal à direita.
export function FormActions({ note, children }) {
  return (
    <div className="flex items-center justify-between border-t border-card-border pt-6">
      <p role="status" className="w-[500px] text-sm text-muted">
        {note}
      </p>
      <div className="flex gap-5">{children}</div>
    </div>
  )
}
