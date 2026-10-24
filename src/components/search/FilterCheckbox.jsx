import check from '../../assets/icons/search/check.svg'

// Caixa de seleção dos filtros (24px, cantos de 4px). O <input> nativo fica escondido mas continua sendo
// o controle de verdade (teclado, Espaço e leitor de tela); o quadrado desenhado só acompanha o estado dele.
export default function FilterCheckbox({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-xl font-semibold text-red-100">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      {/* O anel de foco é INTERNO (offset negativo): as seções recortam o que passa de suas bordas. */}
      <span
        aria-hidden
        className={`relative size-6 shrink-0 rounded-[4px] border-2 border-red-200 transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-neutral-500 ${
          checked ? 'bg-red-200' : 'bg-transparent'
        }`}
      >
        {/* -inset-0.5 compensa a borda de 2px: o "check" ocupa os 24px inteiros, como no Figma. */}
        {checked && <img src={check} alt="" className="absolute -inset-0.5 size-6 max-w-none" />}
      </span>
      {children}
    </label>
  )
}
