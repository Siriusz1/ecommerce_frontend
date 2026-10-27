import { Link } from 'react-router'
import userIcon from '../../assets/icons/user.svg'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../context/useAuth'

// Barra do painel administrativo: o logo (leva ao painel) e "Olá, <nome>!". Sem busca, favoritos e sacola: o administrador
// não compra. Fixa no topo, como a da loja, e sempre no fundo escuro.
export default function AdminHeader() {
  const { user } = useAuth()
  const firstName = user?.name?.trim().split(/\s+/)[0]

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-18 bg-red-800">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-12">
        <Link to="/admin/produtos" className="flex w-[292px] shrink-0 items-center">
          <img src={logo} alt="Fysikos — painel administrativo" className="h-18 w-[132px] object-cover" />
        </Link>
        <p className="flex items-center text-base text-neutral-700">
          <span className="flex size-11 items-center justify-center">
            <img src={userIcon} alt="" className="size-6" />
          </span>
          <span>
            Olá, <span className="font-semibold">{firstName}!</span>
          </span>
        </p>
      </div>
    </header>
  )
}
