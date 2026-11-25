import arrowRight from '../../assets/icons/arrow-right.svg'
import chevron from '../../assets/icons/admin/chevron-down-sm.svg'
import { pageNumbers } from '../../utils/search'

const stepClass = 'flex items-center justify-center gap-2.5 rounded-card p-2.5 text-sm font-semibold text-red-300'
const numberClass = 'flex size-8 items-center justify-center rounded-[4px] text-sm font-semibold'

// Rodapé das tabelas do painel: "Mostrando 1 - 8 de 98 pedidos", o tamanho da página e a navegação de páginas. É a mesma
// numeração da busca da loja (utils/search.js -> pageNumbers), mas controlada por estado e não pelo endereço.
//   noun: o que se está contando ("produtos", "pedidos"...).
export default function AdminPagination({ page, pageSize, total, noun, onPage, onPageSize, sizes = [8, 16, 32] }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, pages)
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(total, current * pageSize)

  return (
    <div className="flex items-center justify-between">
      {/* Figma: "Mostrando: 8 por página ⌄", com o tamanho da página como um link (o <select> fica sem caixa). A contagem
          ("1 - 8 de 98 pedidos") continua para leitores de tela e no balão ao passar o mouse. */}
      <div className="flex items-center text-base font-medium text-red-800" title={`${from} - ${to} de ${total} ${noun}`}>
        <span>Mostrando:&nbsp;</span>
        <p role="status" className="sr-only">
          {from} - {to} de {total} {noun}
        </p>
        <label className="relative flex items-center">
          <span className="sr-only">Itens por página</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value))}
            className="cursor-pointer appearance-none rounded-card bg-transparent py-2 pl-1 pr-7 text-base font-medium text-link outline-none focus-visible:shadow-ring"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
          <img src={chevron} alt="" className="pointer-events-none absolute right-1.5 top-1/2 size-4 -translate-y-1/2" />
        </label>
      </div>

      <nav aria-label="Páginas" className="flex items-center gap-2">
        <button
          type="button"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
          className={`${stepClass} disabled:opacity-60`}
        >
          <img src={arrowRight} alt="" className="size-6 -scale-x-100" />
          Anterior
        </button>

        {pageNumbers(current, pages).map((number, index) =>
          number === null ? (
            <span key={`gap-${index}`} aria-hidden className={`${numberClass} text-red-300`}>
              …
            </span>
          ) : (
            <button
              key={number}
              type="button"
              aria-label={`Página ${number}`}
              aria-current={number === current ? 'page' : undefined}
              onClick={() => onPage(number)}
              className={`${numberClass} ${number === current ? 'bg-red-300 text-neutral-700' : 'text-red-300 hover:bg-neutral-500'}`}
            >
              {number}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={current >= pages}
          onClick={() => onPage(current + 1)}
          className={`${stepClass} disabled:opacity-60`}
        >
          Próximo
          <img src={arrowRight} alt="" className="size-6" />
        </button>
      </nav>
    </div>
  )
}
