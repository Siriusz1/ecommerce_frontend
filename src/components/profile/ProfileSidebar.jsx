import { NavLink } from 'react-router'
import cardMuted from '../../assets/icons/profile/card-muted.svg'
import heartMuted from '../../assets/icons/profile/heart-muted.svg'
import logout from '../../assets/icons/profile/logout.svg'
import packageActive from '../../assets/icons/profile/package-active.svg'
import packageMuted from '../../assets/icons/profile/package-muted.svg'
import pinMuted from '../../assets/icons/profile/pin-muted.svg'
import userActive from '../../assets/icons/profile/user-active.svg'
import userMuted from '../../assets/icons/profile/user-muted.svg'
import { useAuth } from '../../context/useAuth'

const itemClass = 'flex h-9 w-full items-center gap-3 px-3 text-xl font-medium'
// Os itens do menu têm 8px de folga embaixo (o texto sobe 4px); "Sair da conta" é centrado na caixa.
const navItemClass = `${itemClass} pb-2`

// Item ativo = barra de 2px à esquerda e cores escuras; os inativos ficam em cinza.
// O Figma usa um arquivo de ícone diferente para cada cor, por isso `icon` e `activeIcon`.
function SidebarLink({ to, end, icon, activeIcon, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${navItemClass} ${isActive ? 'border-l-2 border-red-300 text-red-300' : 'text-neutral-300'}`
      }
    >
      {({ isActive }) => (
        <>
          <img src={isActive ? activeIcon : icon} alt="" className="size-5" />
          {children}
        </>
      )}
    </NavLink>
  )
}

// Seções do menu que existem no Figma como item, mas ainda não têm tela desenhada.
function SoonItem({ icon, children }) {
  return (
    <span aria-disabled="true" title="Em breve" className={`${navItemClass} cursor-not-allowed text-neutral-300`}>
      <img src={icon} alt="" className="size-5" />
      {children}
    </span>
  )
}

export default function ProfileSidebar() {
  const { signOut } = useAuth()

  return (
    <aside>
      <div>
        <nav aria-label="Perfil" className="flex flex-col gap-5">
          <SidebarLink to="/perfil" end icon={userMuted} activeIcon={userActive}>
            Meus dados
          </SidebarLink>
          <SidebarLink to="/perfil/pedidos" icon={packageMuted} activeIcon={packageActive}>
            Pedidos
          </SidebarLink>
          <SoonItem icon={heartMuted}>Favoritos</SoonItem>
          <SoonItem icon={cardMuted}>Cartões salvos</SoonItem>
          <SoonItem icon={pinMuted}>Endereços</SoonItem>
        </nav>
        <button type="button" onClick={signOut} className={`${itemClass} mt-[51px] rounded-card text-neutral-100`}>
          <img src={logout} alt="" className="size-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
