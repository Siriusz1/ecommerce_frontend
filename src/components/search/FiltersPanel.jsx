import chipClose from '../../assets/icons/search/chip-close.svg'
import filterIcon from '../../assets/icons/search/filter.svg'
import { CATEGORIES, PRICE_BOUNDS, SKIN_TYPES } from '../../data/products'
import { formatPrice } from '../../utils/format'
import Stars from '../Stars'
import FilterCheckbox from './FilterCheckbox'
import FilterSection from './FilterSection'
import PriceRange from './PriceRange'

const RATING_OPTIONS = [4, 3, 2, 1]

const toggle = (list, item) => (list.includes(item) ? list.filter((current) => current !== item) : [...list, item])

// Barra lateral de filtros. Não guarda estado: tudo vem de `filters` (lido do endereço) e cada mudança sai por
// `onChange` como um trecho de parâmetros, ex.: onChange({ categoria: ['Rosto'] }).
export default function FiltersPanel({ filters, onChange }) {
  const { categories, skinTypes, minRating, minPrice, maxPrice } = filters
  const priceActive = minPrice !== PRICE_BOUNDS.min || maxPrice !== PRICE_BOUNDS.max

  // Um chip por filtro ativo, na ordem do Figma (categoria, estrelas, pele); o de preço é nosso (o Figma não o desenha).
  const chips = [
    ...categories.map((category) => ({
      label: category,
      remove: () => onChange({ categoria: categories.filter((item) => item !== category) }),
    })),
    ...(minRating ? [{ label: `${minRating} ou mais ${minRating === 1 ? 'estrela' : 'estrelas'}`, remove: () => onChange({ estrelas: null }) }] : []),
    ...skinTypes.map((type) => ({
      label: `Pele ${type.toLowerCase()}`,
      remove: () => onChange({ pele: skinTypes.filter((item) => item !== type) }),
    })),
    ...(priceActive
      ? [{ label: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`, remove: () => onChange({ min: null, max: null }) }]
      : []),
  ]

  return (
    <aside aria-label="Filtros" className="flex w-[411px] flex-col gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex items-center">
          <h2 className="flex-1 font-heading text-[2rem] font-semibold leading-[normal] text-red-300">Filtros</h2>
          <img src={filterIcon} alt="" className="size-6" />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap items-center gap-3">
              {chips.map((chip) => (
                <li key={chip.label}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remover filtro: ${chip.label}`}
                    className="flex items-center gap-2.5 rounded-card bg-green-300 px-2.5 py-1 text-base font-semibold text-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                  >
                    {chip.label}
                    <img src={chipClose} alt="" className="size-5" />
                  </button>
                </li>
              ))}
            </ul>
            {/* Só o texto sublinhado fica visível; os 4px de py aumentam a área de clique, como no Figma. */}
            <button
              type="button"
              // Limpa só os filtros: a palavra buscada e a ordem escolhida continuam.
              onClick={() => onChange({ categoria: null, estrelas: null, pele: null, min: null, max: null })}
              className="self-start rounded-card py-1 text-base font-medium underline decoration-from-font focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[51px]">
        <FilterSection title="Categoria">
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => (
              <FilterCheckbox
                key={category}
                checked={categories.includes(category)}
                onChange={() => onChange({ categoria: toggle(categories, category) })}
              >
                {category}
              </FilterCheckbox>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Preço">
          <PriceRange
            min={minPrice}
            max={maxPrice}
            // Voltar aos limites do catálogo = "sem filtro de preço": o parâmetro some do endereço.
            onChange={({ min, max }) =>
              onChange({ min: min === PRICE_BOUNDS.min ? null : min, max: max === PRICE_BOUNDS.max ? null : max })
            }
          />
        </FilterSection>

        {/* O Figma desenha esta seção fechada (e não mostra as opções): começa recolhida. */}
        <FilterSection title="Tipo de pele" defaultOpen={false}>
          <div className="flex flex-col gap-3">
            {SKIN_TYPES.map((type) => (
              <FilterCheckbox
                key={type}
                checked={skinTypes.includes(type)}
                onChange={() => onChange({ pele: toggle(skinTypes, type) })}
              >
                {type}
              </FilterCheckbox>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Avaliação">
          <div className="flex flex-col gap-3">
            {/* É uma nota MÍNIMA: marcar "3 ou mais" desmarca "4 ou mais" (só uma vale por vez); marcar de novo limpa. */}
            {RATING_OPTIONS.map((stars) => (
              <FilterCheckbox
                key={stars}
                checked={minRating === stars}
                onChange={() => onChange({ estrelas: minRating === stars ? null : stars })}
              >
                <span className="flex items-end gap-[5px]">
                  <Stars rating={stars} total={5} />
                  <span className="text-base font-normal">ou mais</span>
                </span>
              </FilterCheckbox>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  )
}
