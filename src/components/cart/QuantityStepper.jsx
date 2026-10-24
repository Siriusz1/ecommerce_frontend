import minusIcon from '../../assets/icons/product/minus.svg'
import plusIcon from '../../assets/icons/product/plus.svg'
import trashIcon from '../../assets/icons/checkout/trash-quantity.svg'

const MAX_QUANTITY = 99

// Contador de quantidade da sacola e do checkout (mesmo desenho do da tela de produto: só o sublinhado). Com 1 unidade,
// o "−" vira uma lixeira: diminuir dali remove o item da sacola (é o que o Figma desenha).
export default function QuantityStepper({ quantity, name, onChange, className = '' }) {
  const lastOne = quantity <= 1

  return (
    <div
      role="group"
      aria-label={`Quantidade de ${name}`}
      className={`flex h-[47px] w-[194px] items-center justify-between border-b-2 border-red-300 px-2 text-xl text-red-300 ${className}`}
    >
      <button
        type="button"
        aria-label={lastOne ? `Remover ${name} da sacola` : `Diminuir quantidade de ${name}`}
        onClick={() => onChange(quantity - 1)}
        className="rounded-card"
      >
        <img src={lastOne ? trashIcon : minusIcon} alt="" className="size-6" />
      </button>
      {/* <output> é anunciado pelo leitor de tela a cada mudança. */}
      <output aria-live="polite">{quantity}</output>
      <button
        type="button"
        aria-label={`Aumentar quantidade de ${name}`}
        disabled={quantity >= MAX_QUANTITY}
        onClick={() => onChange(quantity + 1)}
        className="rounded-card transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        <img src={plusIcon} alt="" className="size-6" />
      </button>
    </div>
  )
}
