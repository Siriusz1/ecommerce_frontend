import { CATEGORIES, HAIR_AREAS, HAIR_TYPES, SKIN_TYPES, TYPES } from '../../data/products'
import { RATINGS, activeFilterCount } from '../../utils/search'
import Stars from '../Stars'
import FilterCheckbox from './FilterCheckbox'
import FilterSection from './FilterSection'

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

// Coluna de filtros da busca (Figma "Resultado de Pesquisa", com "Mostrar filtros" ligado). Não guarda estado: tudo vem de
// `filters` (lido do endereço) e cada mudança sai por `onChange` como um trecho de parâmetros, ex.: onChange({ area: ['Rosto'] }).
//
// Seções (Figma): Categoria (as do menu da navbar), Área de aplicação, Tipo de pele e Avaliação (5 a 1 estrela, dá para
// marcar várias). "Tipo de cabelo" não está no Figma, mas só ele filtra os produtos de cabelo: aparece abaixo de "Tipo de
// pele" quando a área Cabelo é marcada, e some (com os valores) quando ela é desmarcada.
export default function FiltersPanel({ filters, onChange }) {
  const { categories: areas, skinTypes, hairTypes, types, ratings } = filters
  const showHair = areas.some((area) => HAIR_AREAS.includes(area))

  // Marcar/desmarcar uma área. Desmarcar Cabelo leva embora o filtro de tipo de cabelo e os valores dele.
  const changeAreas = (nextAreas) =>
    onChange({ area: nextAreas, ...(nextAreas.some((area) => HAIR_AREAS.includes(area)) ? {} : { cabelo: null }) })

  return (
    <aside aria-label="Filtros" className="flex w-[302px] flex-col gap-8">
      {activeFilterCount(filters) > 0 && (
        // Limpa só os filtros: a palavra buscada e a ordem escolhida continuam. Só aparece com algo marcado.
        <button
          type="button"
          onClick={() => onChange({ tipo: null, area: null, pele: null, cabelo: null, estrelas: null })}
          className="-mb-4 self-start rounded-card py-1 text-base font-medium text-link underline decoration-from-font focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          Limpar filtros
        </button>
      )}

      <FilterSection title="Categoria">
        <CheckboxList options={TYPES} selected={types} onToggle={(type) => onChange({ tipo: toggle(types, type) })} />
      </FilterSection>

      <FilterSection title="Área de aplicação">
        <CheckboxList options={CATEGORIES} selected={areas} onToggle={(area) => changeAreas(toggle(areas, area))} />
      </FilterSection>

      <FilterSection title="Tipo de pele">
        <CheckboxList options={SKIN_TYPES} selected={skinTypes} onToggle={(type) => onChange({ pele: toggle(skinTypes, type) })} />
      </FilterSection>

      {/* Surge (com uma entrada suave) só quando a área Cabelo está marcada. */}
      {showHair && (
        <div className="animate-dropdown motion-reduce:animate-none">
          <FilterSection title="Tipo de cabelo">
            <CheckboxList options={HAIR_TYPES} selected={hairTypes} onToggle={(type) => onChange({ cabelo: toggle(hairTypes, type) })} />
          </FilterSection>
        </div>
      )}

      <FilterSection title="Avaliação">
        <div className="flex flex-col gap-3">
          {RATINGS.map((stars) => (
            <FilterCheckbox key={stars} checked={ratings.includes(stars)} onChange={() => onChange({ estrelas: toggle(ratings, stars) })}>
              <Stars rating={stars} total={5} tone="card" />
            </FilterCheckbox>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}
