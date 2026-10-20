import arrowUpRight from '../assets/icons/arrow-up-right.svg'

// Botão-pílula com seta "↗" usado nos cards editoriais e nas categorias.
export default function Pill({ children, className = '', ...props }) {
  return (
    <a
      href="#"
      className={`flex w-[203px] items-center justify-center gap-2.5 rounded-full p-2.5 text-xl tracking-snug text-white ${className}`}
      {...props}
    >
      {children}
      <img src={arrowUpRight} alt="" className="size-6" />
    </a>
  )
}

// Versão só-ícone (44x44) das pílulas, usada nos cards pequenos da seção editorial.
export function ArrowChip({ label, className = '' }) {
  return (
    <a href="#" aria-label={label} className={`flex h-11 w-11 items-center justify-center rounded-chip p-2.5 ${className}`}>
      <img src={arrowUpRight} alt="" className="size-6" />
    </a>
  )
}
