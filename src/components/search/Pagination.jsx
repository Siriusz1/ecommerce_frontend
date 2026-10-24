import { Link } from 'react-router'
import arrowRight from '../../assets/icons/arrow-right.svg'
import { pageNumbers } from '../../utils/search'

const itemClass = 'rounded-card p-2.5 text-center text-sm font-semibold transition-colors'

// Paginação. Cada número é um link para o mesmo endereço com `pagina=N` (abrir em nova aba e voltar funcionam).
// Ao trocar de página, a tela volta ao topo: o endereço muda só no parâmetro, então o ScrollToTop do App não age.
export default function Pagination({ page, totalPages, hrefFor }) {
  if (totalPages <= 1) return null

  const goTo = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-3">
      {/* "Anterior" não existe no Figma (a página 1 não precisa); aparece nas demais, espelhando o "Próximo". */}
      {page > 1 && (
        <Link
          to={hrefFor(page - 1)}
          onClick={goTo}
          className={`${itemClass} flex items-center justify-center gap-2.5 text-red-300 hover:bg-neutral-500`}
        >
          <img src={arrowRight} alt="" className="size-6 -scale-x-100" />
          Anterior
        </Link>
      )}

      {pageNumbers(page, totalPages).map((number, index) =>
        number === null ? (
          <span key={`gap-${index}`} aria-hidden className={`${itemClass} w-[38px] text-red-300`}>
            ...
          </span>
        ) : number === page ? (
          <span key={number} aria-current="page" className={`${itemClass} w-[38px] bg-red-200 text-neutral-700`}>
            {number}
          </span>
        ) : (
          <Link
            key={number}
            to={hrefFor(number)}
            onClick={goTo}
            aria-label={`Página ${number}`}
            className={`${itemClass} w-[38px] text-red-300 hover:bg-neutral-500`}
          >
            {number}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link
          to={hrefFor(page + 1)}
          onClick={goTo}
          className={`${itemClass} flex items-center justify-center gap-2.5 text-red-300 hover:bg-neutral-500`}
        >
          Próximo
          <img src={arrowRight} alt="" className="size-6" />
        </Link>
      )}
    </nav>
  )
}
