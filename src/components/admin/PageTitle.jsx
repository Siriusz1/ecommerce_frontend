// Título de cada tela do painel: Fraunces 40px + (opcional) descrição em 20px, e (opcional) a ação principal da tela à
// direita. Com descrição, a ação se alinha à base do bloco; sem ela (Produtos), fica centrada na altura do título.
export default function PageTitle({ title, description, action, className = '' }) {
  return (
    <div className={`flex justify-between gap-6 ${description ? 'items-end' : 'items-center'} ${className}`}>
      <div className="flex max-w-[790px] flex-col gap-3.5 text-red-300">
        <h1 className="font-heading text-heading font-semibold">{title}</h1>
        {description && <p className="text-xl font-medium">{description}</p>}
      </div>
      {action}
    </div>
  )
}
