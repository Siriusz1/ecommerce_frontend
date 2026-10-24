// Botão que alterna entre "editar" (lápis) e "cancelar" (texto + ✕) nos campos do perfil. A troca usa o mesmo
// movimento da seta do "Ver mais" da Home: o ✕ nasce de dentro da borda direita (uma janela de 0 a 24px com o ícone
// colado no fim dela e deslizando 8px), enquanto "Cancelar" abre à esquerda dele e o lápis recolhe. O botão está
// encostado na borda direita do campo, então tudo cresce para a esquerda. `ease-reveal` é a mesma curva do "Ver mais".
import close from '../../assets/icons/profile/close.svg'
import pencil from '../../assets/icons/profile/pencil.svg'

const MOTION = 'duration-400 ease-reveal motion-reduce:transition-none'

// Janela de largura animada: `open` abre de 0 a 24px; o ícone dentro desliza e aparece junto.
function IconWindow({ open, src }) {
  return (
    <span
      aria-hidden
      className={`flex items-center justify-end overflow-clip transition-[width] ${MOTION} ${open ? 'w-6' : 'w-0'}`}
    >
      <img
        src={src}
        alt=""
        className={`size-6 max-w-none shrink-0 transition-[transform,opacity] ${MOTION} ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
        }`}
      />
    </span>
  )
}

export default function EditToggleButton({ editing, editLabel, cancelLabel, ...props }) {
  return (
    <button
      type="button"
      aria-label={editing ? cancelLabel : editLabel}
      className="flex shrink-0 items-center rounded-card text-xl font-semibold text-red-300"
      {...props}
    >
      {/* grid 0fr -> 1fr anima a largura até a do texto, que não é conhecida de antemão. */}
      <span
        aria-hidden
        className={`grid transition-[grid-template-columns,margin,opacity] ${MOTION} ${
          editing ? 'mr-3 grid-cols-[1fr] opacity-100' : 'mr-0 grid-cols-[0fr] opacity-0'
        }`}
      >
        <span className="overflow-hidden whitespace-nowrap">Cancelar</span>
      </span>
      <IconWindow open={!editing} src={pencil} />
      <IconWindow open={editing} src={close} />
    </button>
  )
}
