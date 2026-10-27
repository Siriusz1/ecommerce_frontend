// Botão que alterna entre "editar" (lápis) e "cancelar" (só o ✕) nos campos do perfil. A troca usa o mesmo movimento da
// seta do "Ver mais" da Home: o ✕ nasce de dentro da borda direita (uma janela de 0 a 24px com o ícone colado no fim
// dela e deslizando 8px) e o lápis recolhe. Editando, fica só o ✕; passando o mouse (ou focando com o teclado) o texto
// "Cancelar" abre à esquerda dele, com o mesmo movimento. O botão está encostado na borda direita do campo, então tudo
// cresce para a esquerda (e o ✕ continua sob o mouse). `ease-reveal` é a mesma curva do "Ver mais". Em telas sem
// mouse o texto não aparece: o leitor de tela e o toque contam com o aria-label.
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
      className="group flex shrink-0 items-center rounded-card text-xl font-semibold text-red-300"
      {...props}
    >
      {/* grid 0fr -> 1fr anima a largura até a do texto, que não é conhecida de antemão. Só abre editando E com hover/foco. */}
      <span
        aria-hidden
        className={`grid mr-0 grid-cols-[0fr] opacity-0 transition-[grid-template-columns,margin,opacity] ${MOTION} ${
          editing
            ? 'group-hover:mr-3 group-hover:grid-cols-[1fr] group-hover:opacity-100 group-focus-visible:mr-3 group-focus-visible:grid-cols-[1fr] group-focus-visible:opacity-100'
            : ''
        }`}
      >
        <span className="overflow-hidden whitespace-nowrap">Cancelar</span>
      </span>
      <IconWindow open={!editing} src={pencil} />
      <IconWindow open={editing} src={close} />
    </button>
  )
}
