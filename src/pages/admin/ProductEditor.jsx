import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import photoAdd from '../../assets/icons/admin/photo-add.svg'
import photoRemove from '../../assets/icons/admin/photo-remove.svg'
import { Field, Select } from '../../components/admin/AdminField'
import { fieldClass } from '../../components/admin/fieldClass'
import FilterPicker from '../../components/admin/FilterPicker'
import StockStepper from '../../components/admin/StockStepper'
import Breadcrumb from '../../components/Breadcrumb'
import Button from '../../components/Button'
import ProductCard from '../../components/ProductCard'
import {
  addProduct,
  addVariant,
  updateProduct,
  updateVariant,
  useAdminCategories,
  useAdminFilterGroups,
  useAdminProducts,
} from '../../services/adminStore'
import { formatPrice } from '../../utils/format'
import { parseMoney } from '../../utils/admin'

const MAX_PHOTOS = 5

function Section({ title, aside, children }) {
  return (
    <section className="flex flex-col gap-5 rounded-card border border-card-border bg-section p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[23px] font-semibold text-red-300">{title}</h2>
        {aside && <p className="text-sm text-muted">{aside}</p>}
      </div>
      {children}
    </section>
  )
}

// Foto do produto: 220x220, a primeira é a "Principal" (a que aparece no cartão da loja). O X tira a foto.
function PhotoTile({ src, index, locked, onRemove }) {
  return (
    <li className="relative size-[220px] shrink-0 overflow-hidden rounded-card">
      <img src={src} alt={`Foto ${index + 1} do produto`} className="size-full object-cover" />
      <div className="absolute inset-x-3 top-3 flex items-start justify-between">
        {index === 0 ? <span className="rounded-full bg-red-300 px-2.5 py-1 text-xs font-bold text-neutral-700">Principal</span> : <span />}
        {!locked && (
          <button type="button" aria-label={`Remover a foto ${index + 1}`} onClick={onRemove} className="rounded-full bg-neutral-700">
            <img src={photoRemove} alt="" className="size-5" />
          </button>
        )}
      </div>
    </li>
  )
}

// Editar produto (/admin/produtos/:id/editar), Novo produto (/admin/produtos/novo) e Novo volume de um produto que já
// existe (/admin/produtos/:produto/volumes/novo): a mesma tela. `:id` é o do VOLUME (o "ID 1" da tabela): o formulário
// mistura dados do produto (nome, descrição, categoria, filtros, fotos) e do volume (volume, preços, SKU, estoque). Ao
// adicionar um volume, os dados do produto aparecem só para consulta.
export default function ProductEditor() {
  const { variantId, productId } = useParams()
  const products = useAdminProducts()

  let mode = 'new'
  let product
  let variant
  if (variantId) {
    mode = 'edit'
    product = products.find((item) => item.variants.some((candidate) => candidate.id === Number(variantId)))
    variant = product?.variants.find((candidate) => candidate.id === Number(variantId))
  } else if (productId) {
    mode = 'variant'
    product = products.find((item) => item.id === productId)
  }

  if (mode !== 'new' && !product) {
    return (
      <div className="flex flex-col items-start gap-4 text-red-300">
        <h1 className="font-heading text-heading font-semibold">Produto não encontrado</h1>
        <Link to="/admin/produtos" className="text-xl font-semibold underline">
          Voltar para os produtos
        </Link>
      </div>
    )
  }

  // `key`: trocar de produto/volume recria o formulário do zero (nada do que foi digitado vaza de um para o outro).
  return <ProductForm key={`${mode}-${variantId ?? productId ?? 'novo'}`} mode={mode} product={product} variant={variant} />
}

function ProductForm({ mode, product, variant }) {
  const navigate = useNavigate()
  const categories = useAdminCategories()
  const filterGroups = useAdminFilterGroups()

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.category ?? '')
  const [filters, setFilters] = useState(product?.filters ?? {})
  const [photos, setPhotos] = useState(product?.photos ?? [])
  const [volume, setVolume] = useState(variant?.volume ?? '')
  const [priceText, setPriceText] = useState(variant ? formatPrice(variant.price) : '')
  const [promoText, setPromoText] = useState(variant?.promoPrice ? formatPrice(variant.promoPrice) : '')
  const [sku, setSku] = useState(variant?.sku ?? '')
  const [stock, setStock] = useState(variant?.stock ?? 0)
  const fileRef = useRef(null)

  // Ao acrescentar um volume, o que é do produto só se consulta.
  const locked = mode === 'variant'

  const price = parseMoney(priceText)
  const promo = promoText.trim() ? parseMoney(promoText) : null
  const promoError =
    promoText.trim() && (promo === null || (price !== null && promo >= price))
      ? 'O preço promocional precisa ser menor que o preço de venda.'
      : undefined
  const siblings = (product?.variants ?? []).filter((item) => item.id !== variant?.id)
  const volumeError = siblings.some((item) => item.volume.trim().toLowerCase() === volume.trim().toLowerCase())
    ? 'Este produto já tem um volume com esse nome.'
    : undefined
  const filterCount = Object.values(filters).reduce((sum, ids) => sum + ids.length, 0)

  const valid =
    name.trim() &&
    description.trim() &&
    categoryId &&
    volume.trim() &&
    !volumeError &&
    price !== null &&
    price > 0 &&
    !promoError &&
    photos.length > 0 &&
    filterCount > 0

  const titles = { new: 'Novo produto', edit: 'Editar produto', variant: 'Novo volume' }
  const descriptions = {
    new: 'Preencha os dados para cadastrar um novo produto.',
    edit: 'Atualize os detalhes, o preço e a disponibilidade do seu produto.',
    variant: `Cadastre outro volume de “${product?.name}”: preço, SKU e estoque próprios.`,
  }
  const submitLabels = { new: 'Cadastrar produto', edit: 'Salvar alterações', variant: 'Adicionar volume' }

  const addPhotos = (event) => {
    const files = [...event.target.files].filter((file) => file.type.startsWith('image/'))
    event.target.value = '' // permite escolher o mesmo arquivo de novo
    setPhotos((current) => [...current, ...files.slice(0, MAX_PHOTOS - current.length).map((file) => URL.createObjectURL(file))])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!valid) return
    const variantData = { volume: volume.trim(), price, promoPrice: promo, sku: sku.trim(), stock }
    const productData = { name: name.trim(), description: description.trim(), category: categoryId, filters, photos }
    if (mode === 'new') addProduct({ ...productData, variant: variantData })
    else if (mode === 'variant') addVariant(product.id, variantData)
    else {
      updateProduct(product.id, productData)
      updateVariant(variant.id, variantData)
    }
    navigate('/admin/produtos')
  }

  const previewProduct = {
    id: 'preview',
    name: name.trim() || 'Nome do produto',
    description: description.trim() || 'A descrição do produto aparece aqui.',
    price: promo !== null && price !== null && promo < price ? promo : (price ?? 0),
    rating: product?.rating ?? 0,
    reviews: product?.reviews ?? 0,
    image: photos[0],
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

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="flex flex-col gap-[18px]">
        <Breadcrumb items={[{ label: 'Produtos', to: '/admin/produtos' }, { label: titles[mode] }]} />
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-heading font-semibold text-red-300">{titles[mode]}</h1>
          {variant && <span className="rounded-card bg-field-readonly px-3.5 py-2 text-sm font-semibold text-red-300">ID {variant.id}</span>}
        </div>
        <p className="text-lg text-red-300">{descriptions[mode]}</p>
      </div>

      <div className="grid grid-cols-[681px_minmax(0,1fr)] items-start gap-6">
        <div className="flex flex-col gap-6">
          <Section title="Informações do produto">
            <Field label="Nome do produto *">
              {(fieldProps) => (
                <input {...fieldProps} value={name} disabled={locked} onChange={(event) => setName(event.target.value)} className={`${fieldClass} h-[60px]`} />
              )}
            </Field>
            <Field label="Descrição *">
              {(fieldProps) => (
                <textarea
                  {...fieldProps}
                  value={description}
                  disabled={locked}
                  onChange={(event) => setDescription(event.target.value)}
                  className={`${fieldClass} min-h-[116px] resize-y p-3.5 font-normal leading-[1.55]`}
                />
              )}
            </Field>
            <div className="flex items-end gap-5">
              <Field label="Categoria *" className="w-[347px]">
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    height="h-[60px]"
                    disabled={locked}
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    options={[{ value: '', label: 'Selecione' }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
                  />
                )}
              </Field>
              <Field label="Volume *" error={volumeError} className="w-[266px]">
                {(fieldProps) => (
                  <input
                    {...fieldProps}
                    value={volume}
                    placeholder="Ex: 90 ml"
                    onChange={(event) => setVolume(event.target.value)}
                    className={`${fieldClass} h-[60px]`}
                  />
                )}
              </Field>
            </div>
            <Field label="Filtro por característica *" className="w-[347px]">
              {(fieldProps) => <FilterPicker {...fieldProps} value={filters} groups={filterGroups} disabled={locked} onChange={setFilters} />}
            </Field>
          </Section>

          <Section title="Preço e estoque">
            <div className="flex items-start gap-5">
              <Field label="Preço de venda *" className="flex-1">
                {(fieldProps) => <input {...fieldProps} {...moneyField(priceText, setPriceText)} className={`${fieldClass} h-[60px]`} />}
              </Field>
              <Field label="Preço promocional" error={promoError} className="flex-1">
                {(fieldProps) => <input {...fieldProps} {...moneyField(promoText, setPromoText)} className={`${fieldClass} h-[60px]`} />}
              </Field>
            </div>
            <p className="text-[13px] leading-normal text-muted">O preço promocional substitui o preço de venda na loja.</p>
            <div className="flex items-end gap-5">
              <Field label="Código do produto (SKU)" className="flex-1">
                {(fieldProps) => <input {...fieldProps} value={sku} onChange={(event) => setSku(event.target.value)} className={`${fieldClass} h-[60px]`} />}
              </Field>
              <Field label="Estoque disponível *" className="w-[194px] shrink-0">
                {(fieldProps) => <StockStepper id={fieldProps.id} variant="field" label="estoque disponível" value={stock} onChange={setStock} />}
              </Field>
            </div>
            <p className="flex gap-2 rounded-card bg-card p-3 text-sm">
              <span className="font-semibold text-red-300">{stock > 0 ? 'Em estoque' : 'Sem estoque'}</span>
              <span className="text-muted">
                · {stock > 0 ? `${stock} ${stock === 1 ? 'unidade disponível' : 'unidades disponíveis'} para venda` : 'nenhuma unidade disponível'}
              </span>
            </p>
          </Section>

          <Section title="Fotos" aside="É necessário pelo menos uma foto">
            <ul className="-mb-1 flex gap-4 overflow-x-auto pb-1">
              {photos.map((src, index) => (
                <PhotoTile key={src} src={src} index={index} locked={locked} onRemove={() => setPhotos((current) => current.filter((_, i) => i !== index))} />
              ))}
              {!locked &&
                Array.from({ length: MAX_PHOTOS - photos.length }, (_, slot) => (
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
          </Section>
        </div>

        {/* Como o cartão vai aparecer na loja; acompanha a rolagem. */}
        <aside aria-label="Pré-visualização na loja" className="sticky top-[116px]">
          <ProductCard preview product={previewProduct} />
        </aside>
      </div>

      <div className="flex items-center justify-between border-t border-card-border pt-6">
        <p role="status" className="w-[500px] text-sm text-muted">
          {valid ? 'As alterações serão publicadas após salvar.' : 'Preencha os campos com * (e envie ao menos uma foto) para salvar.'}
        </p>
        <div className="flex gap-3">
          <Button as={Link} to="/admin/produtos" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={!valid}>
            {submitLabels[mode]}
          </Button>
        </div>
      </div>
    </form>
  )
}
