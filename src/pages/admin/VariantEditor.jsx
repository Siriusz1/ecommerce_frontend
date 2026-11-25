import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { FormActions, Section, VariantFields } from '../../components/admin/productForm'
import { useVariantForm } from '../../components/admin/useVariantForm'
import Breadcrumb from '../../components/Breadcrumb'
import Button from '../../components/Button'
import ProductCard from '../../components/ProductCard'
import { addVariant, useAdminCategories, useAdminFilterGroups, useAdminProducts } from '../../services/adminStore'

// Novo volume de um produto (/admin/produtos/:produto/volumes/novo). Um volume só tem o que muda de um para o outro:
// volume, código, estoque e preços. Nome, descrição, categoria, filtros e fotos vêm do produto: aparecem aqui só para
// consulta, com um atalho para editar o produto. Depois de cadastrado, o volume não tem tela própria: preço e estoque mudam
// na lista de produtos e na edição do produto; para trocar o volume, exclua e cadastre outro.
// Ao salvar ou cancelar, volta para quem abriu a tela (`state.back`: a edição do produto) ou para a lista de produtos.
export default function VariantEditor() {
  const { productId } = useParams()
  const products = useAdminProducts()
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return (
      <div className="flex flex-col items-start gap-4 text-red-300">
        <h1 className="font-heading text-heading font-semibold">Produto não encontrado</h1>
        <Link to="/admin/produtos" className="text-xl font-semibold underline">
          Voltar para os produtos
        </Link>
      </div>
    )
  }

  return <VariantForm key={productId} product={product} />
}

function VariantForm({ product }) {
  const navigate = useNavigate()
  const location = useLocation()
  const categories = useAdminCategories()
  const filterGroups = useAdminFilterGroups()
  const back = location.state?.back ?? '/admin/produtos'

  const form = useVariantForm({ siblings: product.variants, productName: product.name })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.valid) return
    addVariant(product.id, form.data)
    navigate(back)
  }

  const categoryName = categories.find((item) => item.id === product.category)?.name ?? '—'
  // "Área de aplicação: Rosto, Corpo · Tipo de pele: Seca"
  const filterSummary =
    filterGroups
      .map((group) => {
        const labels = group.options.filter((option) => product.filters[group.id]?.includes(option.id)).map((option) => option.label)
        return labels.length ? `${group.name}: ${labels.join(', ')}` : null
      })
      .filter(Boolean)
      .join(' · ') || '—'

  const previewProduct = {
    id: 'preview',
    name: product.name,
    description: product.description,
    price: form.promo !== null && form.price !== null && form.promo < form.price ? form.promo : (form.price ?? 0),
    rating: product.rating,
    reviews: product.reviews,
    image: product.photos[0],
  }
  const productLink = { pathname: `/admin/produtos/${product.id}/editar` }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="flex flex-col gap-[18px]">
        <Breadcrumb
          items={[
            { label: 'Produtos', to: '/admin/produtos' },
            { label: product.name, to: productLink.pathname },
            { label: 'Novo volume' },
          ]}
        />
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-heading font-semibold text-red-300">Novo volume</h1>
        </div>
        <p className="text-lg text-red-300">
          Cadastre outro volume de “{product.name}”. As informações e as fotos
          vêm do produto.
        </p>
      </div>

      <div className="grid grid-cols-[681px_minmax(0,1fr)] items-start gap-6">
        <div className="flex flex-col gap-6">
          <Section title="Estoque e preços" strong>
            <VariantFields form={form} />
          </Section>

          {/* O que o volume herda do produto: só leitura. Mudar aqui mudaria todos os volumes, por isso fica na tela do produto. */}
          <Section
            title="Herdado do produto"
            heading="serif"
            aside={
              <Link to={productLink.pathname} className="text-base font-semibold text-link underline decoration-from-font">
                Editar produto
              </Link>
            }
          >
            <p className="-mt-2 text-sm text-muted">Nome, descrição, categoria, filtros e fotos são os mesmos em todos os volumes.</p>
            <ul aria-label="Fotos do produto" className="flex gap-3">
              {product.photos.map((src, index) => (
                <li key={src} className="relative size-[88px] shrink-0 overflow-hidden rounded-card border border-card-border">
                  <img src={src} alt={`Foto ${index + 1} do produto`} className="size-full object-cover" />
                  {index === 0 && (
                    <span className="absolute inset-x-1 bottom-1 rounded-full bg-red-300 py-0.5 text-center text-[10px] font-bold text-neutral-700">Principal</span>
                  )}
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 gap-y-3 text-base">
              <dt className="font-semibold text-red-300">Nome</dt>
              <dd className="text-red-800">{product.name}</dd>
              <dt className="font-semibold text-red-300">Categoria</dt>
              <dd className="text-red-800">{categoryName}</dd>
              <dt className="font-semibold text-red-300">Filtros</dt>
              <dd className="text-red-800">{filterSummary}</dd>
              <dt className="font-semibold text-red-300">Descrição</dt>
              <dd className="leading-normal text-red-800">{product.description}</dd>
            </dl>
          </Section>
        </div>

        <aside aria-label="Pré-visualização na loja" className="sticky top-[116px]">
          <ProductCard preview product={previewProduct} />
        </aside>
      </div>

      <FormActions note={form.valid ? 'As alterações serão publicadas após salvar.' : 'Escolha o volume e informe o preço de venda para salvar.'}>
        <Button as={Link} to={back} variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={!form.valid}>
          Adicionar volume
        </Button>
      </FormActions>
    </form>
  )
}
