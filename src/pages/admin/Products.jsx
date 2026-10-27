import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import editIcon from '../../assets/icons/admin/edit.svg'
import plusIcon from '../../assets/icons/admin/plus.svg'
import plusWhite from '../../assets/icons/admin/plus-white-sm.svg'
import expandedIcon from '../../assets/icons/admin/row-expanded.svg'
import collapsedIcon from '../../assets/icons/admin/row-collapsed.svg'
import trashIcon from '../../assets/icons/admin/trash.svg'
import { Field, SearchInput, Select } from '../../components/admin/AdminField'
import AdminPagination from '../../components/admin/AdminPagination'
import IconAction from '../../components/admin/IconAction'
import PageTitle from '../../components/admin/PageTitle'
import StatCard from '../../components/admin/StatCard'
import StatusChip from '../../components/admin/StatusChip'
import StockStepper from '../../components/admin/StockStepper'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import { deleteVariant, updateVariant, useAdminCategories, useAdminProducts } from '../../services/adminStore'
import { formatPrice } from '../../utils/format'
import { variantsStock } from '../../utils/admin'

// Colunas da tabela (Figma): volume, preço, estoque, situação e ações. O cabeçalho e as linhas de volume usam a mesma grade.
const GRID = 'grid grid-cols-[320px_120px_160px_160px_minmax(0,1fr)] items-center gap-x-8'

// Produtos (/admin/produtos): indicadores, busca, filtro de categoria e a tabela de produtos. Cada produto abre e mostra os
// volumes dele (preço, estoque e situação de cada um); o estoque se ajusta ali mesmo.
export default function Products() {
  const navigate = useNavigate()
  const products = useAdminProducts()
  const categories = useAdminCategories()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all') // 'all' | 'out' (algum volume sem estoque) | 'in' (todos em estoque)
  const [expanded, setExpanded] = useState(() => new Set()) // todos os produtos começam fechados; quem abre é a pessoa
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [confirmation, setConfirmation] = useState(null)

  const categoryName = (id) => categories.find((item) => item.id === id)?.name ?? '—'
  const totalUnits = products.reduce((sum, product) => sum + variantsStock(product), 0)
  const soldOut = products.filter((product) => variantsStock(product) === 0).length

  const term = query.trim().toLowerCase()
  const filtered = products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      (stockFilter === 'all' ||
        (stockFilter === 'out' ? product.variants.some((variant) => variant.stock === 0) : product.variants.every((variant) => variant.stock > 0))) &&
      (!term ||
        product.name.toLowerCase().includes(term) ||
        product.variants.some((variant) => variant.sku.toLowerCase().includes(term))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)

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

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Produtos"
        description="Cadastre produtos, atualize preços e mantenha o estoque em dia."
        action={
          <Button as={Link} to="/admin/produtos/novo" size="small" icon={plusWhite}>
            Novo produto
          </Button>
        }
      />

      <div className="flex gap-5">
        <StatCard label="Produtos cadastrados" value={products.length} />
        <StatCard label="Unidades em estoque" value={totalUnits} />
        {/* Com produtos sem estoque, o cartão vira um atalho: leva a tabela para eles (e, ligado, desfaz o filtro). Com 0, é só um
            indicador, como os outros. */}
        <StatCard
          label="Sem estoque"
          value={soldOut}
          tone="alert"
          {...(soldOut > 0 || stockFilter === 'out'
            ? {
                action: 'Ir para produtos sem estoque',
                pressedAction: 'Mostrar todos os produtos',
                pressed: stockFilter === 'out',
                onClick: () => {
                  setStockFilter((current) => (current === 'out' ? 'all' : 'out'))
                  setPage(1)
                },
              }
            : {})}
        />
      </div>

      <div className="flex items-end gap-7">
        <Field label="Buscar" labelClassName="text-xl font-medium" className="flex-1">
          {(fieldProps) => (
            <SearchInput
              {...fieldProps}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar por nome ou SKU"
            />
          )}
        </Field>
        <Field label="Estoque" labelClassName="text-xl font-medium" className="w-[280px] shrink-0">
          {(fieldProps) => (
            <Select
              {...fieldProps}
              value={stockFilter}
              onChange={(event) => {
                setStockFilter(event.target.value)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Todos os produtos' },
                { value: 'out', label: 'Com volume sem estoque' },
                { value: 'in', label: 'Tudo em estoque' },
              ]}
            />
          )}
        </Field>
        <Field label="Categoria" labelClassName="text-xl font-medium" className="w-[274px] shrink-0">
          {(fieldProps) => (
            <Select
              {...fieldProps}
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

      <div className="flex flex-col gap-6">
        <div className="rounded-card border-2 border-card-border bg-section p-3">
          <div className={`${GRID} border-b border-card-border px-6 py-3 text-sm font-bold text-muted`} role="row">
            <span>VOLUME</span>
            <span>PREÇO</span>
            <span>ESTOQUE</span>
            <span>SITUAÇÃO</span>
            <span>AÇÕES</span>
          </div>

          {visible.length === 0 && <p className="px-6 py-8 text-base text-muted">Nenhum produto encontrado.</p>}

          {visible.map((product) => {
            const open = expanded.has(product.id)
            const panelId = `variants-${product.id}`
            // Esgotado (todos os volumes sem estoque) = linha rosada, foto apagada e etiqueta vermelha; só alguns volumes
            // sem estoque = etiqueta amarela dizendo quantos. Assim dá para achar o que falta sem abrir cada produto.
            const outCount = product.variants.filter((variant) => variant.stock === 0).length
            const soldOutProduct = outCount === product.variants.length
            return (
              <div key={product.id} className="border-b border-card-border last:border-b-0">
                <div className={`flex h-16 items-center justify-between px-3 py-2 ${soldOutProduct ? 'bg-danger-bg' : ''}`}>
                  <div className="flex items-center gap-[15px]">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-label={`${open ? 'Recolher' : 'Ver'} os volumes de ${product.name}`}
                      onClick={() => toggle(product.id)}
                      className="rounded-card"
                    >
                      <img src={open ? expandedIcon : collapsedIcon} alt="" className="size-4" />
                    </button>
                    <div className="h-11 w-8 shrink-0 overflow-hidden rounded-[2px]">
                      <img src={product.photos[0]} alt="" className={`size-full object-cover ${soldOutProduct ? 'opacity-60 grayscale' : ''}`} />
                    </div>
                    <div className="flex w-[273px] flex-col gap-px">
                      <p className="text-xs font-medium text-muted">{categoryName(product.category)}</p>
                      <p className="truncate text-base font-medium text-red-300">{product.name}</p>
                    </div>
                    {/* Fechado, a linha só fica rosada (e a foto apagada); a etiqueta aparece ao abrir. */}
                    {open && outCount > 0 && (
                      <StatusChip tone={soldOutProduct ? 'out' : 'wait'}>
                        {soldOutProduct ? 'Sem estoque' : `${outCount} ${outCount === 1 ? 'volume sem estoque' : 'volumes sem estoque'}`}
                      </StatusChip>
                    )}
                  </div>
                  {open && (
                    <Link
                      to={`/admin/produtos/${product.id}/volumes/novo`}
                      className="flex items-center gap-2 rounded-card text-base font-medium text-red-300"
                    >
                      <img src={plusIcon} alt="" className="size-6" />
                      Adicionar volume
                    </Link>
                  )}
                </div>

                {open && (
                  <ul id={panelId} className="bg-card py-1">
                    {product.variants.map((variant) => (
                      <li key={variant.id} className={`${GRID} px-6 py-3 ${variant.stock === 0 ? 'bg-danger-bg' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className="rounded-card border-2 border-card-border bg-field-readonly p-2.5 text-base font-medium text-red-300">
                            {variant.volume}
                          </span>
                          <span className="text-xs font-medium text-muted">ID {variant.id}</span>
                        </div>
                        <p className="text-base font-medium text-red-300">{formatPrice(variant.price)}</p>
                        <div>
                          <StockStepper
                            label={`estoque de ${product.name} ${variant.volume}`}
                            value={variant.stock}
                            onChange={(stock) => updateVariant(variant.id, { stock })}
                          />
                        </div>
                        <div className="flex justify-center">
                          <StatusChip tone={variant.stock > 0 ? 'ok' : 'out'}>{variant.stock > 0 ? 'Em estoque' : 'Sem estoque'}</StatusChip>
                        </div>
                        <div className="flex gap-3">
                          <IconAction
                            icon={editIcon}
                            label={`Editar ${product.name} ${variant.volume}`}
                            onClick={() => navigate(`/admin/produtos/${variant.id}/editar`)}
                          />
                          <IconAction
                            icon={trashIcon}
                            label={`Excluir ${product.name} ${variant.volume}`}
                            onClick={() => askToDeleteVariant(product, variant)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        <AdminPagination
          page={current}
          pageSize={pageSize}
          total={filtered.length}
          noun="produtos"
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>

      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </div>
  )
}
