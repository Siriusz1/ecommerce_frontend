import { NavLink } from 'react-router'
import account from '../../assets/icons/admin/nav-account.svg'
import categories from '../../assets/icons/admin/nav-categories.svg'
import categoriesActive from '../../assets/icons/admin/nav-categories-active.svg'
import logout from '../../assets/icons/admin/nav-logout.svg'
import products from '../../assets/icons/admin/nav-products.svg'
import productsActive from '../../assets/icons/admin/nav-products-active.svg'
import reports from '../../assets/icons/admin/nav-reports.svg'
import sales from '../../assets/icons/admin/nav-sales.svg'
import store from '../../assets/icons/admin/nav-store.svg'
import { useAuth } from '../../context/useAuth'

const itemClass = 'flex h-[42px] w-full items-center gap-2 pl-3 pr-1 text-left text-xl'

// Item ativo (Figma): barra de 2px à esquerda, texto em negrito e, onde o Figma desenha, o ícone de traço mais grosso
// (`activeIcon`). Os inativos têm a mesma borda, transparente, para os ícones não se deslocarem 2px na troca.
function NavItem({ to, icon, activeIcon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${itemClass} border-l-2 text-red-800 ${isActive ? 'border-red-800 font-bold' : 'border-transparent font-medium'}`}
    >
      {({ isActive }) => (
        <>
          <img src={isActive && activeIcon ? activeIcon : icon} alt="" className="size-5" />
          {children}
        </>
      )}
    </NavLink>
  )
}

// Menu lateral do painel. Fica preso abaixo da barra enquanto a página rola, com "Ver a loja" sempre no pé da tela.
export default function AdminSidebar() {
  const { signOut } = useAuth()

  return (
    <aside className="sticky top-[116px] flex h-[calc(100dvh-172px)] min-h-[560px] w-[189px] shrink-0 flex-col justify-between self-start pt-4">
      <div className="flex flex-col gap-10">
        <nav aria-label="Painel administrativo" className="flex flex-col gap-[15px]">
          <NavItem to="/admin/produtos" icon={products} activeIcon={productsActive}>
            Produtos
          </NavItem>
          <NavItem to="/admin/categorias" icon={categories} activeIcon={categoriesActive}>
            Categorias
          </NavItem>
          <NavItem to="/admin/vendas" icon={sales}>
            Vendas
          </NavItem>
          <NavItem to="/admin/relatorios" icon={reports}>
            Relatórios
          </NavItem>
          <NavItem to="/admin/meus-dados" icon={account}>
            Meus dados
          </NavItem>
        </nav>
        {/* Limpar a sessão basta: o AdminLayout exige o login do administrador e leva ao login quando não há sessão. */}
        <button type="button" onClick={signOut} className={`${itemClass} rounded-card font-medium text-neutral-100`}>
          <img src={logout} alt="" className="size-5" />
          Sair da conta
        </button>
      </div>

      <NavLink to="/" className={`${itemClass} font-medium text-red-300`}>
        <img src={store} alt="" className="size-5" />
        Ver a loja
      </NavLink>
    </aside>
  )
}
