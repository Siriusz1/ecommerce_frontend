import { NavLink } from 'react-router'
import account from '../../assets/icons/admin/nav-account.svg'
import categories from '../../assets/icons/admin/nav-categories.svg'
import logout from '../../assets/icons/admin/nav-logout.svg'
import products from '../../assets/icons/admin/nav-products.svg'
import reports from '../../assets/icons/admin/nav-reports.svg'
import sales from '../../assets/icons/admin/nav-sales.svg'
import store from '../../assets/icons/admin/nav-store.svg'
import { useAuth } from '../../context/useAuth'

const itemClass = 'flex h-[42px] w-full items-center gap-2 pl-3 pr-1 text-left text-xl font-medium text-red-300'

// Item ativo = barra de 2px à esquerda (o Figma não muda cor nem ícone; só a barra marca a tela em que se está). Os inativos têm a mesma borda, transparente, para os ícones não se deslocarem 2px na troca.
function NavItem({ to, icon, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${itemClass} border-l-2 ${isActive ? 'border-red-300' : 'border-transparent'}`}>
      <img src={icon} alt="" className="size-5" />
      {children}
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
          <NavItem to="/admin/produtos" icon={products}>
            Produtos
          </NavItem>
          <NavItem to="/admin/categorias" icon={categories}>
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
        <button type="button" onClick={signOut} className={`${itemClass} rounded-card`}>
          <img src={logout} alt="" className="size-5" />
          Sair da conta
        </button>
      </div>

      <NavLink to="/" className={itemClass}>
        <img src={store} alt="" className="size-5" />
        Ver a loja
      </NavLink>
    </aside>
  )
}
