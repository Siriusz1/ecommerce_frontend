import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../context/useAuth'
import { isAdminAccount } from '../../services/auth'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

// Moldura das telas do painel (/admin/*): barra no topo, menu lateral de 189px e a coluna da tela. É também a barreira:
// só entra quem está logado com a conta de administrador. Sem sessão, vai ao login e volta para a tela pedida; um cliente
// logado volta para a loja.
export default function AdminLayout() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user?.email) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isAdminAccount(user.email)) return <Navigate to="/" replace />

  return (
    // `admin-shell`: o index.css reserva o espaço da barra de rolagem nas telas do painel, para o menu não se mexer de uma
    // tela para outra (umas rolam e outras não).
    <div className="admin-shell min-h-screen bg-neutral-700">
      <AdminHeader />
      {/* pt-[116px]: os 72px da barra + 44px de respiro para o menu lateral. A coluna da direita sobra 79px à direita
          e fica a 24px do menu (273px de menu no Figma, o conteúdo começa em 297px). */}
      <div className="mx-auto flex max-w-page items-start gap-[60px] pb-14 pl-12 pr-[79px] pt-[116px]">
        <AdminSidebar />
        {/* Espaço entre a barra e o título da página (Figma): 70px em Produtos e Categorias (os 26px de pt somam aos 44px do
            layout); nas telas de formulário (novo/editar produto) o topo é a trilha de navegação, a 32px (-mt-3). */}
        <main className={`min-w-0 flex-1 ${/\/(novo|editar)$/.test(location.pathname) ? '-mt-3' : 'pt-[26px]'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
