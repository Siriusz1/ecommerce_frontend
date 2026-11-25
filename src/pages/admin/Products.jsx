import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import editIcon from '../../assets/icons/admin/edit.svg'
import plusIcon from '../../assets/icons/admin/plus.svg'
import plusWhite from '../../assets/icons/admin/plus-white-sm.svg'
import expandedIcon from '../../assets/icons/admin/row-expanded.svg'
import collapsedIcon from '../../assets/icons/admin/row-collapsed.svg'
import statOut from '../../assets/icons/admin/stat-out.svg'
import statProducts from '../../assets/icons/admin/stat-products.svg'
import statUnits from '../../assets/icons/admin/stat-units.svg'
import trashIcon from '../../assets/icons/admin/trash.svg'
import { Field, SearchInput, Select } from '../../components/admin/AdminField'
import AdminPagination from '../../components/admin/AdminPagination'
import IconAction from '../../components/admin/IconAction'
import PageTitle from '../../components/admin/PageTitle'
import PriceInput from '../../components/admin/PriceInput'
import StatCard from '../../components/admin/StatCard'
import StatusChip from '../../components/admin/StatusChip'
import StockStepper from '../../components/admin/StockStepper'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import { deleteProduct, deleteVariant, updateVariant, useAdminCategories, useAdminProducts } from '../../services/adminStore'
import { variantsStock } from '../../utils/admin'

// Colunas dos volumes de um produto aberto (Figma): volume, código, preço, estoque, situação e ações. O cabeçalho das colunas
// e as linhas usam a mesma grade.
// Barra de filtros (Buscar e Categoria): sem preenchimento, só a borda, como no Figma. O `!` vence o fundo branco padrão.
const FILTER_FILL = 'bg-transparent!'

// A coluna do preço é mais larga que no Figma (154px) porque o preço virou um campo editável.
const GRID = 'grid grid-cols-[145px_205px_154px_191px_190px_minmax(0,1fr)] items-center'

// Busca sem acento, sem maiúsculas e sem espaços: "Botânica Renewal 60ml" encontra o volume "60 ml" da "Botanica Renewal".
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')

// Produtos (/admin/produtos): indicadores, busca, filtro de categoria e a tabela de produtos. Cada produto abre e mostra os
// volumes dele (código, preço, estoque e situação de cada um); o estoque se ajusta ali mesmo.
// O lápis da linha do PRODUTO abre a edição de informações e fotos (valem para todos os volumes). Os VOLUMES não têm tela de
// edição: preço e estoque mudam na própria linha (e na edição do produto); o resto é herdado do produto.
export default function Products() {
  const navigate = useNavigate()
  const products = useAdminProducts()
  const categories = useAdminCategories()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [onlySoldOut, setOnlySoldOut] = useState(false) // ligado pelo cartão "Sem estoque"
  const [expanded, setExpanded] = useState(() => new Set()) // todos os produtos começam fechados; quem abre é a pessoa
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [confirmation, setConfirmation] = useState(null)

  const categoryName = (id) => categories.find((item) => item.id === id)?.name ?? '—'
  const totalUnits = products.reduce((sum, product) => sum + variantsStock(product), 0)
  const soldOut = products.filter((product) => variantsStock(product) === 0).length

  const term = normalize(query)
  // Para cada produto: se aparece na busca e quais volumes mostrar. Quando a busca acerta um volume específico (e não o nome
  // do produto), o produto já abre mostrando só esse volume, como no Figma.
  const rows = products
    .filter((product) => (category === 'all' || product.category === category) && (!onlySoldOut || variantsStock(product) === 0))
    .map((product) => {
      if (!term) return { product, variants: product.variants, autoOpen: false }
      const nameMatch = normalize(product.name).includes(term)
      const matching = product.variants.filter(
        (variant) => normalize(`${product.name}${variant.volume}`).includes(term) || normalize(variant.sku).includes(term),
      )
      if (!nameMatch && matching.length === 0) return null
      const narrowed = !nameMatch && matching.length > 0
      return { product, variants: narrowed ? matching : product.variants, autoOpen: narrowed }
    })
    .filter(Boolean)

  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)

  const toggle = (id) =>
    setExpanded((set) => {
      const next = new Set(set)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const askToDeleteVariant = (product, variant) =>
    setConfirmation({
      title: 'Excluir volume?',
      description:
        product.variants.length === 1
          ? `“${product.name}” só tem este volume (${variant.volume}): excluí-lo exclui o produto. Essa ação não pode ser desfeita.`
          : `O volume ${variant.volume} de “${product.name}” será excluído. Essa ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      onConfirm: () => {
        setConfirmation(null)
        deleteVariant(variant.id)
      },
    })

  const askToDeleteProduct = (product) =>
    setConfirmation({
      title: 'Excluir produto?',
      description: `“${product.name}” e ${product.variants.length === 1 ? 'o volume dele' : `os ${product.variants.length} volumes dele`} serão excluídos. Essa ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      onConfirm: () => {
        setConfirmation(null)
        deleteProduct(product.id)
      },
    })

  const changeQuery = (value) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Produtos"
        action={
          <Button as={Link} to="/admin/produtos/novo" icon={plusWhite}>
            Novo produto
          </Button>
        }
      />

      <div className="flex flex-col gap-8">
        <div className="flex gap-[25px]">
          <StatCard icon={statProducts} label="Produtos cadastrados" value={products.length} unit="Itens" tone="plain" />
          <StatCard icon={statUnits} label="Unidades em estoque" value={totalUnits} unit="Itens" tone="plain" />
          {/* Com produtos sem estoque, o cartão também é um atalho: mostra só eles na tabela (e, ligado, desfaz o filtro). */}
          <StatCard
            icon={statOut}
            label="Sem estoque"
            value={soldOut}
            unit="Itens"
            tone="alert"
            {...(soldOut > 0 || onlySoldOut
              ? {
                  pressed: onlySoldOut,
                  onClick: () => {
                    setOnlySoldOut((on) => !on)
                    setPage(1)
                  },
                }
              : {})}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-5">
            <Field label="Buscar" labelClassName="text-xl font-medium" className="flex-1">
              {(fieldProps) => (
                <SearchInput
                  {...fieldProps}
                  height="h-[46px]"
                  inputClassName={FILTER_FILL}
                  value={query}
                  onChange={(event) => changeQuery(event.target.value)}
                  onClear={() => changeQuery('')}
                  placeholder="Buscar por nome ou identificador"
                />
              )}
            </Field>
            <Field label="Categoria" labelClassName="text-xl font-medium" className="w-[282px] shrink-0">
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  height="h-[46px]"
                  inputClassName={FILTER_FILL}
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value)
                    setPage(1)
                  }}
                  options={[{ value: 'all', label: 'Todas as categorias' }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
                />
              )}
            </Field>
          </div>

          <div className="rounded-card border-2 border-card-border bg-card p-3">
            {visible.length === 0 && <p className="px-3 py-8 text-base text-muted">Nenhum produto encontrado.</p>}

            {visible.map(({ product, variants, autoOpen }) => {
              const open = autoOpen || expanded.has(product.id)
              const panelId = `variants-${product.id}`
              // Esgotado (todos os volumes sem estoque) = linha rosada, foto apagada e etiqueta vermelha; só alguns volumes
              // sem estoque = etiqueta amarela dizendo quantos. Assim dá para achar o que falta sem abrir cada produto.
              const outCount = product.variants.filter((variant) => variant.stock === 0).length
              const soldOutProduct = outCount === product.variants.length
              return (
                <div key={product.id} className="border-b border-card-border last:border-b-0">
                  {/* A linha inteira abre e fecha os volumes. A seta continua sendo o botão para teclado e leitor de tela: o
                      clique (ou Enter/Espaço) nela sobe até a linha, então não precisa de um onClick próprio. */}
                  <div
                    onClick={autoOpen ? undefined : () => toggle(product.id)}
                    className={`flex h-16 items-center gap-[15px] px-3 py-2 ${autoOpen ? '' : 'cursor-pointer'} ${soldOutProduct ? 'bg-danger-bg' : ''}`}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-label={`${open ? 'Recolher' : 'Ver'} os volumes de ${product.name}`}
                      disabled={autoOpen}
                      className="rounded-card"
                    >
                      <img src={open ? expandedIcon : collapsedIcon} alt="" className="size-4" />
                    </button>
                    <div className="h-11 w-8 shrink-0 overflow-hidden rounded-[2px]">
                      <img src={product.photos[0]} alt="" className={`size-full object-cover ${soldOutProduct ? 'opacity-60 grayscale' : ''}`} />
                    </div>
                    <div className="flex w-[273px] flex-col gap-px">
                      <p className="text-xs font-medium text-ink-soft">{categoryName(product.category)}</p>
                      <p className="truncate text-base font-medium text-red-800">{product.name}</p>
                    </div>
                    {/* Fechado, a linha só fica rosada (e a foto apagada); a etiqueta aparece ao abrir. */}
                    {open && outCount > 0 && (
                      <StatusChip tone={soldOutProduct ? 'out' : 'wait'}>
                        {soldOutProduct ? 'Sem estoque' : `${outCount} ${outCount === 1 ? 'volume sem estoque' : 'volumes sem estoque'}`}
                      </StatusChip>
                    )}
                    {/* Ações do PRODUTO (informações e fotos de todos os volumes), na mesma coluna das ações dos volumes. O
                        stopPropagation impede que o clique nelas também abra/feche a linha. */}
                    <div className="ml-auto flex w-[115px] gap-3" onClick={(event) => event.stopPropagation()}>
                      <IconAction
                        icon={editIcon}
                        label={`Editar informações e fotos de ${product.name}`}
                        onClick={() => navigate(`/admin/produtos/${product.id}/editar`)}
                      />
                      <IconAction icon={trashIcon} label={`Excluir o produto ${product.name}`} onClick={() => askToDeleteProduct(product)} />
                    </div>
                  </div>

                  {open && (
                    <div id={panelId} className="bg-row-open">
                      <div role="row" className={`${GRID} border-b border-card-border px-6 py-2.5 text-base font-semibold text-row-head`}>
                        <span>Volume</span>
                        <span>Código do Produto</span>
                        <span>Preço</span>
                        <span>Estoque</span>
                        <span>Situação</span>
                        <span>Ações</span>
                      </div>
                      <ul>
                        {variants.map((variant) => (
                          <li key={variant.id} className={`${GRID} px-6 py-3 text-base font-medium text-red-800 ${variant.stock === 0 ? 'bg-danger-bg' : ''}`}>
                            <span className="justify-self-start rounded-card border-2 border-card-border bg-field-readonly p-2.5">{variant.volume}</span>
                            <span>{variant.sku || '—'}</span>
                            <PriceInput
                              label={`Preço de ${product.name} ${variant.volume}`}
                              value={variant.price}
                              promoPrice={variant.promoPrice}
                              onCommit={(price) => updateVariant(variant.id, { price })}
                            />
                            <div>
                              <StockStepper
                                label={`estoque de ${product.name} ${variant.volume}`}
                                value={variant.stock}
                                onChange={(stock) => updateVariant(variant.id, { stock })}
                              />
                            </div>
                            <div>
                              <StatusChip tone={variant.stock > 0 ? 'ok' : 'out'}>{variant.stock > 0 ? 'Em estoque' : 'Sem estoque'}</StatusChip>
                            </div>
                            {/* Preço e estoque se editam na própria linha; o volume só sai (para outro volume, exclua e adicione). */}
                            <div className="flex gap-3">
                              <IconAction
                                icon={trashIcon}
                                label={`Excluir o volume ${variant.volume} de ${product.name}`}
                                onClick={() => askToDeleteVariant(product, variant)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/admin/produtos/${product.id}/volumes/novo`}
                        className="flex w-max items-center gap-3 rounded-card px-6 py-3 text-base font-medium text-red-800"
                      >
                        <img src={plusIcon} alt="" className="size-5" />
                        Adicionar volume
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <AdminPagination
            page={current}
            pageSize={pageSize}
            total={rows.length}
            noun="produtos"
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>
      </div>

      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </div>
  )
}
