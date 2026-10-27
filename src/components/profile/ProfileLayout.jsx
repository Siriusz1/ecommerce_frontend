import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../context/useAuth'
import Breadcrumb from '../Breadcrumb'
import Header from '../header/Header'
import ProfileSidebar from './ProfileSidebar'

// Moldura das telas de perfil: título, menu lateral de 217px e a coluna de conteúdo de 954px
// (80 + 217 + 109 + 954 + 80 = 1440). Só usuários logados chegam aqui.
export default function ProfileLayout() {
  const { user } = useAuth()

  // Sessões antigas guardavam só o nome; sem e-mail não dá para buscar o perfil, então pede login de novo.
  if (!user?.email) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-neutral-700">
      {/* Sem `heroRef`: nesta tela a navbar é sempre a escura. */}
      <Header />
      {/* pt-[92px]: a trilha começa 20px abaixo da navbar fixa (72px); o título "Perfil" vem 12px depois dela (y=124). */}
      <main className="mx-auto max-w-content pb-[51px] pt-[92px]">
        <Breadcrumb items={[{ label: 'Página Inicial', to: '/' }, { label: 'Perfil' }]} />
        <h1 className="mt-3 font-heading text-heading font-semibold">Perfil</h1>
        <div className="mt-11 grid grid-cols-[217px_minmax(0,1fr)] items-start gap-x-[109px]">
          <ProfileSidebar />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
