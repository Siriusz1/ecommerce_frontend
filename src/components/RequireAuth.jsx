import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/useAuth'
import { isAdminAccount } from '../services/auth'

// Barreira das telas que exigem perfil (o checkout). Quem não entrou vai para o login e, depois de entrar (ou
// de criar a conta e entrar), volta para onde queria ir: o destino viaja no estado da navegação (`from`) pelas telas
// de login e cadastro. Os itens que a pessoa já colocou na sacola não se perdem (ver CartProvider).
// `blockAdmin`: telas de compra (checkout, pagamento, confirmação). A conta de administrador não compra: o mais longe que
// ela vai é a sacola, e quem tenta abrir essas telas volta para lá.
export default function RequireAuth({ children, blockAdmin = false }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user?.email) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, needsAccount: true }} />
  }
  if (blockAdmin && isAdminAccount(user.email)) return <Navigate to="/sacola" replace />
  return children
}
