// Botão só de ícone das tabelas (editar, excluir). O rótulo é para leitor de tela e para o balão ao passar o mouse.
export default function IconAction({ icon, label, onClick, className = '' }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`shrink-0 rounded-card ${className}`}>
      <img src={icon} alt="" className="size-6" />
    </button>
  )
}
