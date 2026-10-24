import closeIcon from '../../assets/icons/profile/close.svg'
import plusIcon from '../../assets/icons/checkout/plus-lg.svg'

// Linha de 52px que abre e fecha o formulário de um novo endereço/cartão: "+ Adicionar novo endereço" fechada e
// "✕ Usar endereço salvo" aberta (o Figma desenha as duas). Fechar descarta o que foi digitado.
export default function FormToggleRow({ open, openLabel, closedLabel, onClick, controls }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className="flex h-[52px] w-full items-center gap-2 rounded-[10px] px-2.5 py-1 text-left text-xl font-semibold text-red-300 transition-colors duration-200 hover:bg-card motion-reduce:transition-none"
    >
      <img src={open ? closeIcon : plusIcon} alt="" className="size-6" />
      {open ? openLabel : closedLabel}
    </button>
  )
}
