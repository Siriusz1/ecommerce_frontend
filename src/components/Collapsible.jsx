// Painel que abre e fecha animando a altura (grid-rows 0fr -> 1fr). `inert` tira o conteúdo escondido do Tab e dos
// leitores de tela. O overflow-hidden recorta o conteúdo enquanto fecha: quem usar isto deve deixar uma folga em volta
// dos campos (padding) para o contorno de foco de 3px não ser cortado.
export default function Collapsible({ open, id, children, className = '', closedClassName = '' }) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows,margin] duration-300 ease-out motion-reduce:transition-none ${
        // Fechado, o painel tem altura 0 mas um `gap` do pai ainda conta; `closedClassName` deixa o pai compensar (ex.: -mb-3).
        open ? 'grid-rows-[1fr]' : `grid-rows-[0fr] ${closedClassName}`
      } ${className}`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
