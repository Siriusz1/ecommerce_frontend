import { useState } from 'react'
import editIcon from '../../assets/icons/admin/edit.svg'
import plusDark from '../../assets/icons/admin/plus-dark-sm.svg'
import plusWhite from '../../assets/icons/admin/plus-white-sm.svg'
import trashIcon from '../../assets/icons/admin/trash.svg'
import AdminPagination from '../../components/admin/AdminPagination'
import { fieldClass } from '../../components/admin/fieldClass'
import IconAction from '../../components/admin/IconAction'
import PageTitle from '../../components/admin/PageTitle'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import {
  addCategory,
  addFilterGroup,
  addFilterOption,
  deleteCategory,
  deleteFilterGroup,
  deleteFilterOption,
  renameCategory,
  renameFilterGroup,
  useAdminCategories,
  useAdminFilterGroups,
  useAdminProducts,
} from '../../services/adminStore'

const MESSAGES = { DUPLICATE: 'Já existe um item com esse nome.', EMPTY: 'Digite um nome.' }
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

// "Nova categoria / opção / grupo": campo + botão. O botão fica desabilitado enquanto não há nome; o erro do cadastro
// (nome repetido) aparece embaixo e some quando a pessoa volta a digitar.
function AddForm({ label, onAdd, placeholder = 'Ex: Mãos', className = '' }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState()

  const submit = (event) => {
    event.preventDefault()
    const result = onAdd(value)
    if (result.ok) {
      setValue('')
      setError(undefined)
    } else setError(MESSAGES[result.reason] ?? MESSAGES.EMPTY)
  }

  return (
    <form onSubmit={submit} noValidate className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <input
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
          className={`${fieldClass} h-12 flex-1 ${error ? 'border-error' : ''}`}
        />
        {/* Sempre na cor de ação (Figma): com o campo vazio, o clique mostra "Digite um nome." */}
        <Button type="submit" size="small" icon={plusWhite}>
          Adicionar
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </form>
  )
}

// Renomear no próprio lugar: o nome vira um campo, com "Salvar" e "Cancelar".
function RenameForm({ initial, label, onSave, onCancel }) {
  const [value, setValue] = useState(initial)
  const [error, setError] = useState()

  const submit = (event) => {
    event.preventDefault()
    if (value.trim() === initial) return onCancel() // nada mudou
    const result = onSave(value)
    if (result.ok) onCancel()
    else setError(MESSAGES[result.reason] ?? MESSAGES.EMPTY)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          autoFocus
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          onKeyDown={(event) => event.key === 'Escape' && onCancel()}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
          className={`${fieldClass} h-12 max-w-[420px] flex-1 ${error ? 'border-error' : ''}`}
        />
        <Button type="submit" size="small">
          Salvar
        </Button>
        <Button type="button" size="small" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </form>
  )
}

// Categorias e filtros por característica (/admin/categorias). As categorias são as do menu da loja e todo produto
// pertence a uma (por isso só se exclui uma categoria vazia). Os grupos de filtro (Área de aplicação, Tipo de pele...) são os
// da barra lateral da busca: cada grupo tem opções e um produto pode ter várias opções do mesmo grupo.
export default function Categories() {
  const categories = useAdminCategories()
  const groups = useAdminFilterGroups()
  const products = useAdminProducts()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingGroup, setEditingGroup] = useState(null)
  const [addingGroup, setAddingGroup] = useState(false)
  const [rowError, setRowError] = useState(null) // { id, message } da categoria que não pôde ser excluída
  const [confirmation, setConfirmation] = useState(null)

  const pages = Math.max(1, Math.ceil(categories.length / pageSize))
  const current = Math.min(page, pages)
  const visible = categories.slice((current - 1) * pageSize, current * pageSize)

  const ask = (request) => setConfirmation({ ...request, onConfirm: () => {
    setConfirmation(null)
    request.action()
  } })

  const removeCategory = (category) => {
    const count = products.filter((product) => product.category === category.id).length
    if (count > 0) {
      setRowError({ id: category.id, message: `Mova ou exclua ${plural(count, 'produto', 'produtos')} antes de excluir esta categoria.` })
      return
    }
    setRowError(null)
    ask({
      title: 'Excluir categoria?',
      description: `A categoria “${category.name}” será excluída. Essa ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      action: () => deleteCategory(category.id),
    })
  }

  const optionCount = (groupId, optionId) => products.filter((product) => product.filters[groupId]?.includes(optionId)).length

  return (
    <div className="flex flex-col gap-10">
      <PageTitle title="Categorias" description="Organize os produtos da loja. Todos precisam pertencer a uma categoria." />

      <div className="flex flex-col gap-5">
        <div className="overflow-hidden rounded-card border-2 border-card-border bg-section">
          {visible.map((category) => {
            const count = products.filter((product) => product.category === category.id).length
            const editing = editingCategory === category.id
            return (
              <div key={category.id} className="border-b border-card-border px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  {editing ? (
                    <RenameForm
                      initial={category.name}
                      label={`Novo nome da categoria ${category.name}`}
                      onSave={(name) => renameCategory(category.id, name)}
                      onCancel={() => setEditingCategory(null)}
                    />
                  ) : (
                    <div className="flex w-[320px] flex-col gap-1 whitespace-nowrap">
                      <p className="text-lg font-semibold text-red-300">{category.name}</p>
                      <p className="text-sm font-medium text-neutral-300">{plural(count, 'produto', 'produtos')}</p>
                    </div>
                  )}
                  {!editing && (
                    <div className="flex gap-3">
                      <IconAction icon={editIcon} label={`Renomear a categoria ${category.name}`} onClick={() => setEditingCategory(category.id)} />
                      <IconAction icon={trashIcon} label={`Excluir a categoria ${category.name}`} onClick={() => removeCategory(category)} />
                    </div>
                  )}
                </div>
                {rowError?.id === category.id && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-error">
                    {rowError.message}
                  </p>
                )}
              </div>
            )
          })}

          <div className="flex flex-col gap-4 px-5 py-4">
            <p className="text-lg font-semibold text-red-300">Nova categoria</p>
            <AddForm label="Nome da nova categoria" onAdd={addCategory} />
          </div>
        </div>

        <AdminPagination
          page={current}
          pageSize={pageSize}
          total={categories.length}
          noun="categorias"
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>

      <section aria-labelledby="filters-title" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 id="filters-title" className="font-heading text-[2rem] font-semibold text-red-300">
            Filtros por característica
          </h2>
          <p className="text-base text-neutral-300">
            Grupos de opções para o cliente refinar a busca. Um produto pode ter <strong>várias</strong> opções do mesmo grupo,
            como um creme para rosto e corpo.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <Button type="button" variant="outline" size="small" icon={plusDark} hoverIcon={plusWhite} aria-expanded={addingGroup} onClick={() => setAddingGroup((open) => !open)}>
            Adicionar novo grupo
          </Button>
          {addingGroup && (
            <AddForm
              label="Nome do novo grupo"
              placeholder="Ex: Tipo de cabelo"
              className="w-full"
              onAdd={(name) => {
                const result = addFilterGroup(name)
                if (result.ok) setAddingGroup(false)
                return result
              }}
            />
          )}
        </div>

        <div className="overflow-hidden rounded-card border-2 border-card-border bg-section">
          {groups.length === 0 && <p className="p-5 text-base text-muted">Nenhum grupo de filtro cadastrado.</p>}
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-4 border-b-2 border-card-border p-5 last:border-b-0">
              <div className="flex items-center justify-between gap-4">
                {editingGroup === group.id ? (
                  <RenameForm
                    initial={group.name}
                    label={`Novo nome do grupo ${group.name}`}
                    onSave={(name) => renameFilterGroup(group.id, name)}
                    onCancel={() => setEditingGroup(null)}
                  />
                ) : (
                  <div className="flex flex-col gap-1 whitespace-nowrap">
                    <p className="text-lg font-semibold text-red-300">{group.name}</p>
                    <p className="text-[13px] font-medium text-neutral-300">{plural(group.options.length, 'opção', 'opções')} · várias por produto</p>
                  </div>
                )}
                {editingGroup !== group.id && (
                  <div className="flex gap-3">
                    <IconAction icon={editIcon} label={`Renomear o grupo ${group.name}`} onClick={() => setEditingGroup(group.id)} />
                    <IconAction
                      icon={trashIcon}
                      label={`Excluir o grupo ${group.name}`}
                      onClick={() =>
                        ask({
                          title: 'Excluir grupo de filtros?',
                          description: `O grupo “${group.name}” e as ${plural(group.options.length, 'opção', 'opções')} dele serão excluídos, e os produtos perdem esses filtros. Essa ação não pode ser desfeita.`,
                          confirmLabel: 'Excluir',
                          action: () => deleteFilterGroup(group.id),
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <ul className="flex flex-wrap items-center gap-2">
                {group.options.map((option) => {
                  const count = optionCount(group.id, option.id)
                  const remove = () =>
                    ask({
                      title: 'Remover opção?',
                      description: `A opção “${option.label}” sai de ${plural(count, 'produto', 'produtos')} e do filtro “${group.name}” da loja.`,
                      confirmLabel: 'Remover',
                      action: () => deleteFilterOption(group.id, option.id),
                    })
                  return (
                    <li key={option.id} className="flex items-center gap-1.5 rounded-[20px] border border-card-border bg-card px-2.5 py-[5px] text-[13px] font-semibold text-red-300">
                      {option.label}
                      <span aria-label={plural(count, 'produto', 'produtos')} className="rounded-[20px] bg-red-300 px-1.5 py-px text-[11px] font-bold text-neutral-700">
                        {count}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remover a opção ${option.label}`}
                        onClick={count > 0 ? remove : () => deleteFilterOption(group.id, option.id)}
                        className="rounded-card font-normal text-neutral-300"
                      >
                        ×
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-medium text-neutral-300">Nova opção em {group.name}</p>
                <AddForm label={`Nova opção em ${group.name}`} onAdd={(label) => addFilterOption(group.id, label)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </div>
  )
}
