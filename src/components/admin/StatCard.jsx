import arrowRight from '../../assets/icons/arrow-right.svg'

const TONES = {
  default: 'border-card-border bg-card',
  // "Sem estoque": rosado, chama a atenção sem ser o vermelho de erro.
  alert: 'border-danger-border bg-danger-bg',
  // "Aguardando pagamento": o tom mais claro das tabelas.
  soft: 'border-card-border bg-section',
}

// Indicador do topo das telas de Produtos e Vendas: rótulo, valor grande e (opcional) uma linha de apoio.
// Com `onClick` o cartão é um botão que liga/desliga um filtro da tela, e para não ser confundido com os cartões que só
// informam ele ganha uma chamada embaixo (`action`, com a seta), mão e realce ao passar o mouse. `pressed` marca o filtro
// ligado (contorno de foco de 3px e a chamada passa a dizer como desligar).
export default function StatCard({ label, value, hint, tone = 'default', onClick, action, pressedAction, pressed = false }) {
  const className = `flex min-w-0 flex-1 flex-col gap-3.5 self-stretch rounded-card border-2 p-4 text-left text-red-300 transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none ${TONES[tone]} ${
    pressed ? 'shadow-ring' : ''
  } ${onClick ? 'group hover:border-red-300 focus-visible:shadow-ring focus-visible:outline-none' : ''}`
  const content = (
    <>
      <p className="text-base font-medium">{label}</p>
      <p className="text-[2rem] font-bold">{value}</p>
      {hint && <p className="text-[13px] text-muted">{hint}</p>}
      {onClick && (
        <span className="flex items-center gap-1 text-sm font-semibold underline decoration-from-font">
          {pressed ? (pressedAction ?? action) : action}
          <img src={arrowRight} alt="" className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      )}
    </>
  )
  if (!onClick) return <div className={className}>{content}</div>
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={className}>
      {content}
    </button>
  )
}
