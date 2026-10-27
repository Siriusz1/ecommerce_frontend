const TONES = {
  ok: 'bg-field-readonly text-green-200', // Em estoque, Pago
  alert: 'bg-danger-bg text-red-300', // Sem estoque, Cancelado
  wait: 'bg-wait-bg text-wait', // Aguardando; produto com algum volume sem estoque
  out: 'bg-link text-neutral-700', // Sem estoque: o vermelho-tijolo do site (o dos links), sólido para se ver sobre a linha rosada
}

// Etiqueta de situação (estoque do volume e pedido). Na tabela de estoque o Figma usa 14px; na de pedidos, 13px.
export default function StatusChip({ tone = 'ok', size = 'md', children }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-[4px] font-semibold ${size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-[5px] text-[13px]'} ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
