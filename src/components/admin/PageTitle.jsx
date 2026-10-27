// Título de cada tela do painel: Fraunces 40px + descrição em 20px, e (opcional) a ação principal da tela à direita,
// alinhada à base do bloco.
export default function PageTitle({ title, description, action, className = '' }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div className="flex max-w-[790px] flex-col gap-3.5 text-red-300">
        <h1 className="font-heading text-heading font-semibold">{title}</h1>
        <p className="text-xl font-medium">{description}</p>
      </div>
      {action}
    </div>
  )
}
