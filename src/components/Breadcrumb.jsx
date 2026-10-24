import { Link } from 'react-router'
import chevron from '../assets/icons/breadcrumb-chevron.svg'

// Trilha de navegação ("Página Inicial > Perfil"). Todos os itens, menos o último, são links; o último
// é a tela atual (texto escuro, sem link). O Figma fixa a trilha em y=92, logo abaixo da navbar de 72px.
//   items: [{ label, to? }]
export default function Breadcrumb({ items, className = '' }) {
  return (
    <nav aria-label="Você está em" className={className}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            // pb-[5px]: o Figma deixa 5px de folga embaixo do texto (a área do "botão" da trilha).
            <li key={item.label} className="flex items-start gap-1">
              {current ? (
                <span aria-current="page" className="pb-[5px] text-xs text-neutral-50">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.to} className="pb-[5px] text-xs text-link hover:underline">
                    {item.label}
                  </Link>
                  <img src={chevron} alt="" className="size-4" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
