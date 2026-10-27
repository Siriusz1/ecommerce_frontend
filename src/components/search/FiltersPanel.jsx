import chipClose from '../../assets/icons/search/chip-close.svg'
import filterIcon from '../../assets/icons/search/filter.svg'
import { CATEGORIES, HAIR_AREAS, HAIR_TYPES, PRICE_BOUNDS, SKIN_AREAS, SKIN_TYPES, TYPES } from '../../data/products'
import { formatPrice } from '../../utils/format'
import Stars from '../Stars'
import FilterCheckbox from './FilterCheckbox'
import FilterSection from './FilterSection'
import PriceRange from './PriceRange'

const RATING_OPTIONS = [4, 3, 2, 1]

const toggle = (list, item) => (list.includes(item) ? list.filter((current) => current !== item) : [...list, item])

// Opções de um filtro de múltipla escolha (caixinhas em coluna).
function CheckboxList({ options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <FilterCheckbox key={option} checked={selected.includes(option)} onChange={() => onToggle(option)}>
          {option}
        </FilterCheckbox>
      ))}
    </div>
  )
}

// Barra lateral de filtros. Não guarda estado: tudo vem de `filters` (lido do endereço) e cada mudança sai por
// `onChange` como um trecho de parâmetros, ex.: onChange({ area: ['Rosto'] }).
//
// Seções (Figma): Categoria (as do menu da navbar), Preço, Área de aplicação, Tipo de pele, Tipo de cabelo e Avaliação.
// "Tipo de pele" e "Tipo de cabelo" NÃO existem até a área correspondente ser marcada: Rosto/Corpo abrem o de pele e
// Cabelo abre o de cabelo (marcando os dois tipos de área, aparecem os dois). Desmarcar a área leva embora a seção e os
// valores que estavam marcados nela.
export default function FiltersPanel({ filters, onChange }) {
  const { categories: areas, skinTypes, hairTypes, types, minRating, minPrice, maxPrice } = filters
  const priceActive = minPrice !== PRICE_BOUNDS.min || maxPrice !== PRICE_BOUNDS.max
  const hasArea = (list) => areas.some((area) => list.includes(area))
  const showSkin = hasArea(SKIN_AREAS)
  const showHair = hasArea(HAIR_AREAS)

  // Marcar/desmarcar uma área. Se ela era a última a liberar um filtro de tipo, o filtro some junto com os valores dele.
  const changeAreas = (nextAreas) =>
    onChange({
      area: nextAreas,
      ...(nextAreas.some((area) => SKIN_AREAS.includes(area)) ? {} : { pele: null }),
      ...(nextAreas.some((area) => HAIR_AREAS.includes(area)) ? {} : { cabelo: null }),
    })

  // Um chip por filtro ativo; o de preço é nosso (o Figma não o desenha).
  const chips = [
    // A categoria do menu da navbar (Hidratação, Limpeza...) também é um filtro e aparece como chip removível.
    ...types.map((type) => ({ label: type, remove: () => onChange({ tipo: types.filter((item) => item !== type) }) })),
    ...areas.map((area) => ({ label: area, remove: () => changeAreas(areas.filter((item) => item !== area)) })),
    ...(minRating
      ? [{ label: `${minRating} ou mais ${minRating === 1 ? 'estrela' : 'estrelas'}`, remove: () => onChange({ estrelas: null }) }]
      : []),
    ...skinTypes.map((type) => ({
      label: `Pele ${type.toLowerCase()}`,
      remove: () => onChange({ pele: skinTypes.filter((item) => item !== type) }),
    })),
    ...hairTypes.map((type) => ({
      label: `Cabelo ${type.toLowerCase()}`,
      remove: () => onChange({ cabelo: hairTypes.filter((item) => item !== type) }),
    })),
    ...(priceActive
      ? [{ label: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`, remove: () => onChange({ min: null, max: null }) }]
      : []),
  ]

  return (
    <aside aria-label="Filtros" className="flex w-[411px] flex-col gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex items-center">
          <h2 className="flex-1 text-2xl font-semibold leading-[30px] text-red-300">Filtros</h2>
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
              onClick={() => onChange({ tipo: null, area: null, estrelas: null, pele: null, cabelo: null, min: null, max: null })}
              className="self-start rounded-card py-1 text-base font-medium underline decoration-from-font focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {/* 32px entre as seções (no Figma; antes eram 51). */}
      <div className="flex flex-col gap-8">
        <FilterSection title="Categoria">
          <CheckboxList options={TYPES} selected={types} onToggle={(type) => onChange({ tipo: toggle(types, type) })} />
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

        <FilterSection title="Área de aplicação">
          <CheckboxList options={CATEGORIES} selected={areas} onToggle={(area) => changeAreas(toggle(areas, area))} />
        </FilterSection>

        {/* Surgem (com uma entrada suave) só quando a área correspondente está marcada. */}
        {showSkin && (
          <div className="animate-dropdown motion-reduce:animate-none">
            <FilterSection title="Tipo de pele">
              <CheckboxList
                options={SKIN_TYPES}
                selected={skinTypes}
                onToggle={(type) => onChange({ pele: toggle(skinTypes, type) })}
              />
            </FilterSection>
          </div>
        )}
        {showHair && (
          <div className="animate-dropdown motion-reduce:animate-none">
            <FilterSection title="Tipo de cabelo">
              <CheckboxList
                options={HAIR_TYPES}
                selected={hairTypes}
                onToggle={(type) => onChange({ cabelo: toggle(hairTypes, type) })}
              />
            </FilterSection>
          </div>
        )}

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
                  <Stars rating={stars} total={5} tone="card" />
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
