import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import plusIcon from '../../assets/icons/admin/plus.svg'
import saveDisabledIcon from '../../assets/icons/admin/save-disabled.svg'
import saveIcon from '../../assets/icons/admin/save.svg'
import trashIcon from '../../assets/icons/admin/trash.svg'
import { Field, Select } from '../../components/admin/AdminField'
import FilterPicker from '../../components/admin/FilterPicker'
import IconAction from '../../components/admin/IconAction'
import { EditableInput, FormActions, LABEL, PhotoManager, Section, VariantFields } from '../../components/admin/productForm'
import { useVariantForm } from '../../components/admin/useVariantForm'
import PriceInput from '../../components/admin/PriceInput'
import StockStepper from '../../components/admin/StockStepper'
import Breadcrumb from '../../components/Breadcrumb'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import ProductCard from '../../components/ProductCard'
import { addProduct, deleteVariant, updateProduct, updateVariant, useAdminCategories, useAdminFilterGroups, useAdminProducts } from '../../services/adminStore'
import { effectivePrice } from '../../utils/admin'

// Produto (/admin/produtos/novo e /admin/produtos/:produto/editar): o que é comum a TODOS os volumes do produto (nome,
// descrição, categoria, filtros e fotos). Os volumes herdam essas informações e só guardam volume, código, estoque e
// preços (ver VariantEditor, que só cadastra volumes novos).
//   - Novo produto: além das informações do produto, pede o primeiro volume (um produto sem volume não teria preço).
//   - Editar produto: o "Salvar alterações" só acende quando algo do produto muda. Embaixo, a lista de volumes: preço e
//     estoque mudam ali mesmo (e valem na hora), dá para excluir um volume ou ir cadastrar outro.
export default function ProductEditor() {
  const { productId } = useParams()
  const products = useAdminProducts()
  const product = productId ? products.find((item) => item.id === productId) : undefined

  if (productId && !product) {
    return (
      <div className="flex flex-col items-start gap-4 text-red-300">
        <h1 className="font-heading text-heading font-semibold">Produto não encontrado</h1>
        <Link to="/admin/produtos" className="text-xl font-semibold underline">
          Voltar para os produtos
        </Link>
      </div>
    )
  }

  // `key`: trocar de produto recria o formulário do zero (nada do que foi digitado vaza de um para o outro).
  return <ProductForm key={productId ?? 'novo'} product={product} />
}

// Volumes: volume, código, preço, estoque e excluir.
const VOLUME_GRID = 'grid grid-cols-[84px_minmax(0,1fr)_132px_118px_24px] items-center gap-4'

const sameList = (a, b) => a.length === b.length && a.every((item, index) => item === b[index])
const sameFilters = (a, b) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].every((key) => sameList(a[key] ?? [], b[key] ?? []))
}

function ProductForm({ product }) {
  const navigate = useNavigate()
  const categories = useAdminCategories()
  const filterGroups = useAdminFilterGroups()
  const editing = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.category ?? '')
  const [filters, setFilters] = useState(product?.filters ?? {})
  const [photos, setPhotos] = useState(product?.photos ?? [])
  const firstVariant = useVariantForm({ productName: name }) // só no cadastro
  const [confirmation, setConfirmation] = useState(null)

  const filterCount = Object.values(filters).reduce((sum, ids) => sum + ids.length, 0)
  const productValid = Boolean(name.trim() && description.trim() && categoryId && filterCount > 0 && photos.length > 0)
  const valid = productValid && (editing || firstVariant.valid)
  const dirty =
    editing &&
    (name.trim() !== product.name ||
      description.trim() !== product.description ||
      categoryId !== product.category ||
      !sameFilters(filters, product.filters) ||
      !sameList(photos, product.photos))

  // Editando, só dá para salvar o que mudou (e continua válido); cadastrando, basta estar tudo preenchido.
  const canSave = valid && (!editing || dirty)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSave) return
    const productData = { name: name.trim(), description: description.trim(), category: categoryId, filters, photos }
    if (editing) updateProduct(product.id, productData)
    else addProduct({ ...productData, variant: firstVariant.data })
    navigate('/admin/produtos')
  }

  // Sair para a tela de um volume com alterações não salvas: pergunta antes, para nada se perder sem querer. A tela do
  // volume recebe `back` para voltar para cá ao salvar ou cancelar.
  const leaveTo = (to) => {
    const go = () => navigate(to, { state: { back: `/admin/produtos/${product.id}/editar` } })
    if (!dirty) return go()
    setConfirmation({
      title: 'Sair sem salvar?',
      description: 'As alterações nas informações e nas fotos do produto ainda não foram salvas e serão perdidas.',
      confirmLabel: 'Sair sem salvar',
      onConfirm: () => {
        setConfirmation(null)
        go()
      },
    })
  }

  const askToDeleteVariant = (variant) =>
    setConfirmation({
      title: 'Excluir volume?',
      description: `O volume ${variant.volume} de “${product.name}” será excluído. Essa ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      onConfirm: () => {
        setConfirmation(null)
        deleteVariant(variant.id)
      },
    })

  const volumes = product?.variants ?? []
  // O cartão da loja mostra o menor preço entre os volumes (no cadastro, o do primeiro volume).
  const firstPrice =
    firstVariant.promo !== null && firstVariant.price !== null && firstVariant.promo < firstVariant.price ? firstVariant.promo : (firstVariant.price ?? 0)
  const previewProduct = {
    id: 'preview',
    name: name.trim() || 'Nome do produto',
    description: description.trim() || 'A descrição do produto aparece aqui.',
    price: editing ? Math.min(...volumes.map(effectivePrice)) : firstPrice,
    rating: product?.rating ?? 0,
    reviews: product?.reviews ?? 0,
    image: photos[0],
  }
  const title = editing ? 'Editar produto' : 'Novo produto'

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="flex flex-col gap-[18px]">
        <Breadcrumb items={[{ label: 'Produtos', to: '/admin/produtos' }, { label: title }]} />
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-heading font-semibold text-red-300">{title}</h1>
          {editing && (
            <span className="rounded-card bg-field-readonly px-3.5 py-2 text-sm font-semibold text-red-300">
              {volumes.length} {volumes.length === 1 ? 'volume' : 'volumes'}
            </span>
          )}
        </div>
        <p className="text-lg text-red-300">
          {editing
            ? 'Nome, descrição, categoria, filtros e fotos valem para todos os volumes deste produto.'
            : 'Cadastre o produto e o primeiro volume. Os volumes que você adicionar depois herdam estas informações e fotos.'}
        </p>
      </div>

      <div className="grid grid-cols-[681px_minmax(0,1fr)] items-start gap-6">
        <div className="flex flex-col gap-6">
          <Section title="Informações do produto" strong>
            <Field label="Nome do produto *" labelClassName={LABEL}>
              {(fieldProps) => <EditableInput {...fieldProps} value={name} onChange={(event) => setName(event.target.value)} className="h-14 text-xl" />}
            </Field>
            <Field label="Descrição *" labelClassName={LABEL}>
              {(fieldProps) => (
                <EditableInput
                  {...fieldProps}
                  multiline
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[116px] resize-y p-3.5 text-xl leading-[1.55]"
                />
              )}
            </Field>
            <div className="flex items-start gap-5">
              <Field label="Filtro por característica *" labelClassName={LABEL} className="w-[347px]">
                {(fieldProps) => <FilterPicker {...fieldProps} value={filters} groups={filterGroups} onChange={setFilters} />}
              </Field>
              <Field label="Categoria *" labelClassName={LABEL} className="w-[265px]">
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    height="h-14"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    options={[{ value: '', label: 'Selecione' }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
                  />
                )}
              </Field>
            </div>
          </Section>

          <Section title="Fotos" heading="serif" aside={<p className="text-sm font-medium text-muted">É necessário pelo menos uma foto.</p>}>
            <PhotoManager photos={photos} onChange={setPhotos} />
          </Section>

          {editing ? (
            <Section title="Volumes" heading="serif" aside={<p className="text-sm font-medium text-muted">Preço e estoque são salvos na hora.</p>}>
              {/* Os volumes herdam tudo do produto: aqui só se muda preço e estoque (valem na hora, como na lista de produtos)
                  ou se exclui o volume. Não fazem parte do "Salvar alterações", que é só das informações e fotos. */}
              <div className="overflow-hidden rounded-card border border-card-border bg-row-open">
                <div role="row" className={`${VOLUME_GRID} border-b border-card-border px-4 py-2.5 text-base font-semibold text-row-head`}>
                  <span>Volume</span>
                  <span>Código</span>
                  <span>Preço</span>
                  <span>Estoque</span>
                  <span className="sr-only">Ações</span>
                </div>
                <ul>
                  {volumes.map((variant) => (
                    <li
                      key={variant.id}
                      className={`${VOLUME_GRID} border-b border-card-border px-4 py-3 text-base font-medium text-red-800 last:border-b-0 ${variant.stock === 0 ? 'bg-danger-bg' : ''}`}
                    >
                      <span className="rounded-card border-2 border-card-border bg-field-readonly p-2 text-center">{variant.volume}</span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{variant.sku || 'Sem código'}</span>
                        {variant.stock === 0 && <span className="text-xs font-semibold text-link">Sem estoque</span>}
                      </div>
                      <PriceInput
                        label={`Preço do volume ${variant.volume}`}
                        value={variant.price}
                        promoPrice={variant.promoPrice}
                        onCommit={(price) => updateVariant(variant.id, { price })}
                      />
                      <div>
                        <StockStepper label={`estoque do volume ${variant.volume}`} value={variant.stock} onChange={(stock) => updateVariant(variant.id, { stock })} />
                      </div>
                      {/* Um produto precisa de pelo menos um volume: o último só sai excluindo o produto (na lista de produtos). */}
                      {volumes.length > 1 ? (
                        <IconAction icon={trashIcon} label={`Excluir o volume ${variant.volume}`} onClick={() => askToDeleteVariant(variant)} />
                      ) : (
                        <span title="O produto precisa de pelo menos um volume" className="cursor-not-allowed opacity-40">
                          <img src={trashIcon} alt="" className="size-6" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => leaveTo(`/admin/produtos/${product.id}/volumes/novo`)}
                className="flex w-max items-center gap-3 rounded-card text-base font-semibold text-red-800"
              >
                <img src={plusIcon} alt="" className="size-5" />
                Adicionar volume
              </button>
            </Section>
          ) : (
            <Section title="Primeiro volume" aside={<p className="text-sm font-medium text-muted">Outros volumes podem ser adicionados depois.</p>}>
              <VariantFields form={firstVariant} />
            </Section>
          )}
        </div>

        {/* Como o cartão vai aparecer na loja; acompanha a rolagem. */}
        <aside aria-label="Pré-visualização na loja" className="sticky top-[116px]">
          <ProductCard preview product={previewProduct} />
          {editing && volumes.length > 1 && <p className="mt-2 text-sm text-muted">O cartão mostra o menor preço entre os volumes.</p>}
        </aside>
      </div>

      <FormActions
        note={
          editing
            ? !dirty
              ? 'Altere as informações ou as fotos do produto para salvar.'
              : valid
                ? 'As alterações serão publicadas após salvar.'
                : 'Preencha os campos com * (e mantenha ao menos uma foto) para salvar.'
            : valid
              ? 'O produto será publicado após cadastrar.'
              : 'Preencha os campos com *, envie ao menos uma foto e defina o primeiro volume para cadastrar.'
        }
      >
        <Button as={Link} to="/admin/produtos" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={!canSave} icon={editing ? saveIcon : undefined} disabledIcon={editing ? saveDisabledIcon : undefined}>
          {editing ? 'Salvar alterações' : 'Cadastrar produto'}
        </Button>
      </FormActions>

      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </form>
  )
}
