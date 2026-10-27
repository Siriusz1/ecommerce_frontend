import { useState } from 'react'
import collapsedIcon from '../../assets/icons/admin/row-collapsed.svg'
import expandedIcon from '../../assets/icons/admin/row-expanded.svg'
import { Field, SearchInput, Select } from '../../components/admin/AdminField'
import AdminPagination from '../../components/admin/AdminPagination'
import PageTitle from '../../components/admin/PageTitle'
import StatCard from '../../components/admin/StatCard'
import StatusChip from '../../components/admin/StatusChip'
import Button from '../../components/Button'
import { useAdminOrders } from '../../services/adminStore'
import { formatDate, formatTime, pad } from '../../utils/admin'
import { formatPrice } from '../../utils/format'

const STATUSES = {
  pago: { label: 'Pago', tone: 'ok' },
  aguardando: { label: 'Aguardando', tone: 'wait' },
  cancelado: { label: 'Cancelado', tone: 'alert' },
}
const DAY = 24 * 60 * 60 * 1000
const GRID = 'flex items-center gap-5 px-4'

const monthName = (date) => {
  const name = date.toLocaleDateString('pt-BR', { month: 'long' })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Períodos do filtro. `from`/`to` são limites em milissegundos; `label` aparece no campo e `short` no texto de apoio.
function buildPeriods(now) {
  const year = now.getFullYear()
  const month = now.getMonth()
  const last = new Date(year, month - 1, 1)
  return {
    month: { label: `Este mês · ${monthName(now)} ${year}`, from: new Date(year, month, 1).getTime(), to: new Date(year, month + 1, 1).getTime() - 1 },
    'last-month': { label: `Mês passado · ${monthName(last)} ${last.getFullYear()}`, from: last.getTime(), to: new Date(year, month, 1).getTime() - 1 },
    '7d': { label: 'Últimos 7 dias', from: now.getTime() - 7 * DAY, to: now.getTime() },
    '30d': { label: 'Últimos 30 dias', from: now.getTime() - 30 * DAY, to: now.getTime() },
    all: { label: 'Todo o período', from: -Infinity, to: Infinity },
  }
}

const itemCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)

// Planilha dos pedidos mostrados (todas as páginas). Separador ";" e BOM: o Excel em português abre com acentos certos.
function exportCsv(orders) {
  const quote = (value) => `"${String(value).replace(/"/g, '""')}"`
  const rows = [
    ['Pedido', 'Cliente', 'E-mail', 'Data', 'Hora', 'Valor', 'Pagamento', 'Situação', 'Itens'],
    ...orders.map((order) => [
      `#${order.id}`,
      order.customer.name,
      order.customer.email,
      formatDate(order.date),
      formatTime(order.date),
      order.total.toFixed(2).replace('.', ','),
      order.payment,
      STATUSES[order.status].label,
      order.items.map((item) => `${item.quantity}x ${item.name}`).join(' + '),
    ]),
  ]
  const csv = `﻿${rows.map((row) => row.map(quote).join(';')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const now = new Date()
  const link = document.createElement('a')
  link.href = url
  link.download = `pedidos-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Vendas (/admin/vendas): indicadores do período, busca e filtros e a lista de pedidos. Cada pedido abre e mostra os
// produtos. Os indicadores acompanham só o PERÍODO (não mudam ao filtrar a lista por situação ou busca).
export default function Sales() {
  const orders = useAdminOrders()
  const [now] = useState(() => new Date())
  const periods = buildPeriods(now)

  const [query, setQuery] = useState('')
  const [periodKey, setPeriodKey] = useState('month')
  const [status, setStatus] = useState('all')
  const [expanded, setExpanded] = useState(() => new Set()) // todos os pedidos começam fechados; quem abre é a pessoa
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const period = periods[periodKey]
  const inPeriod = orders.filter((order) => order.date >= period.from && order.date <= period.to)
  const paid = inPeriod.filter((order) => order.status === 'pago')
  const waiting = inPeriod.filter((order) => order.status === 'aguardando')
  const revenue = paid.reduce((sum, order) => sum + order.total, 0)
  const receivable = waiting.reduce((sum, order) => sum + order.total, 0)

  const term = query.trim().toLowerCase().replace(/^#/, '')
  const filtered = inPeriod.filter(
    (order) =>
      (status === 'all' || order.status === status) &&
      (!term ||
        String(order.id).includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)

  const first = new Date(periodKey === 'all' ? orders[orders.length - 1]?.date : Math.max(period.from, 0))
  const last = new Date(periodKey === 'all' ? orders[0]?.date : Math.min(period.to, now.getTime()))
  const range = periodKey === 'all' && orders.length === 0 ? 'Sem pedidos' : `${formatDate(first)} a ${formatDate(last)}`
  const rangeLong =
    periodKey === 'month'
      ? `01 a ${pad(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())} de ${monthName(now).toLowerCase()} de ${now.getFullYear()}`
      : range

  const toggle = (id) =>
    setExpanded((set) => {
      const next = new Set(set)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const resetFilters = () => {
    setQuery('')
    setPeriodKey('month')
    setStatus('all')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-8">
        <PageTitle
          title="Vendas"
          description="Acompanhe os pedidos e gerencie cada etapa das suas vendas."
          action={
            <Button type="button" size="small" variant="outline" disabled={filtered.length === 0} onClick={() => exportCsv(filtered)}>
              Exportar pedidos
            </Button>
          }
        />
        <div className="flex gap-5">
          <StatCard label="Total em vendas" value={formatPrice(revenue)} hint="Valor dos pedidos pagos" />
          <StatCard label="Pedidos no período" value={inPeriod.length} hint={rangeLong} />
          <StatCard label="Ticket médio" value={formatPrice(paid.length ? revenue / paid.length : 0)} hint="Média por pedido pago" />
          <StatCard label="Aguardando pagamento" value={waiting.length} hint={`${formatPrice(receivable)} a receber`} tone="soft" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-5">
          <Field label="Buscar pedido" labelClassName="text-base" className="flex-1">
            {(fieldProps) => (
              <SearchInput
                {...fieldProps}
                value={query}
                placeholder="Número do pedido, nome ou e-mail"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
              />
            )}
          </Field>
          <Field label="Período" labelClassName="text-base" className="w-[280px] shrink-0">
            {(fieldProps) => (
              <Select
                {...fieldProps}
                value={periodKey}
                onChange={(event) => {
                  setPeriodKey(event.target.value)
                  setPage(1)
                }}
                options={Object.entries(periods).map(([value, item]) => ({ value, label: item.label }))}
              />
            )}
          </Field>
          <Field label="Situação" labelClassName="text-base" className="w-[260px] shrink-0">
            {(fieldProps) => (
              <Select
                {...fieldProps}
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value)
                  setPage(1)
                }}
                options={[{ value: 'all', label: 'Todas as situações' }, ...Object.entries(STATUSES).map(([value, item]) => ({ value, label: item.label }))]}
              />
            )}
          </Field>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <p className="text-muted">{range} · Pedidos mais recentes primeiro</p>
          <button type="button" onClick={resetFilters} className="rounded-card text-red-300 underline decoration-from-font">
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-card border-2 border-card-border bg-section p-3">
          <div className="flex items-center justify-between whitespace-nowrap px-4 pb-5 pt-2">
            <h2 className="text-xl font-bold text-red-300">Pedidos</h2>
            <p role="status" className="text-[13px] text-muted">
              {filtered.length} {filtered.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
            </p>
          </div>
          <div className={`${GRID} border-b border-card-border py-3 text-xs font-bold text-muted`}>
            <span className="w-[86px] shrink-0">PEDIDO</span>
            <span className="min-w-0 flex-1">CLIENTE</span>
            <span className="w-[106px] shrink-0">DATA</span>
            <span className="w-[140px] shrink-0">VALOR</span>
            <span className="w-[128px] shrink-0">SITUAÇÃO</span>
            <span className="w-[88px] shrink-0">AÇÕES</span>
          </div>

          {visible.length === 0 && <p className="px-4 py-8 text-base text-muted">Nenhum pedido encontrado.</p>}

          {visible.map((order) => {
            const open = expanded.has(order.id)
            const panelId = `order-${order.id}`
            const chip = STATUSES[order.status]
            return (
              <div key={order.id} className="border-b border-card-border last:border-b-0">
                <div className={`${GRID} h-[70px] overflow-hidden`}>
                  <div className="flex w-[86px] shrink-0 flex-col gap-[5px] whitespace-nowrap">
                    <p className="text-[15px] font-bold text-red-300">#{order.id}</p>
                    <p className="text-xs text-muted">{itemCount(order)} {itemCount(order) === 1 ? 'item' : 'itens'}</p>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                    <p className="truncate text-[15px] font-semibold text-red-300">{order.customer.name}</p>
                    <p className="truncate text-xs text-muted">{order.customer.email}</p>
                  </div>
                  <div className="flex w-[106px] shrink-0 flex-col gap-[5px] whitespace-nowrap">
                    <p className="text-sm text-red-300">{formatDate(order.date)}</p>
                    <p className="text-xs text-muted">{formatTime(order.date)}</p>
                  </div>
                  <div className="flex w-[140px] shrink-0 flex-col gap-[5px] whitespace-nowrap">
                    <p className="text-[15px] font-semibold text-red-300">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted">{order.payment}</p>
                  </div>
                  <div className="w-[128px] shrink-0">
                    <StatusChip tone={chip.tone} size="sm">
                      {chip.label}
                    </StatusChip>
                  </div>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-label={`${open ? 'Ocultar' : 'Ver'} os produtos do pedido #${order.id}`}
                    onClick={() => toggle(order.id)}
                    className="flex w-[88px] shrink-0 items-center gap-1.5 rounded-card text-[13px] font-semibold text-red-300"
                  >
                    <img src={open ? expandedIcon : collapsedIcon} alt="" className="size-4" />
                    {open ? 'Ver menos' : 'Ver mais'}
                  </button>
                </div>

                {open && (
                  <div id={panelId} className="bg-card px-6 py-3">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-card-border text-xs font-medium text-red-300">
                          <th scope="col" className="p-2.5 font-medium">Produto</th>
                          <th scope="col" className="w-[70px] p-2.5 text-center font-medium">Qtd</th>
                          <th scope="col" className="w-[120px] p-2.5 text-right font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} className="text-base font-medium text-red-300">
                            <td className="p-2.5">{item.name}</td>
                            <td className="p-2.5 text-center">{item.quantity}</td>
                            <td className="p-2.5 text-right">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <AdminPagination
          page={current}
          pageSize={pageSize}
          total={filtered.length}
          noun="pedidos"
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}
