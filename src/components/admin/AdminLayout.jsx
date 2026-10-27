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
      {/* pt-[116px]: os 72px da barra + 44px de respiro (Figma). A coluna da direita sobra 79px à direita. */}
      <div className="mx-auto flex max-w-page items-start gap-[60px] pb-14 pl-12 pr-[79px] pt-[116px]">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
