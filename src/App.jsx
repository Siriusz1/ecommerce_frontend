import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import RequireAuth from './components/RequireAuth'
import AdminLayout from './components/admin/AdminLayout'
import ProfileLayout from './components/profile/ProfileLayout'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import OrderPlaced from './pages/OrderPlaced'
import PixPayment from './pages/PixPayment'
import ProductPage from './pages/ProductPage'
import Register from './pages/Register'
import Search from './pages/Search'
import Orders from './pages/profile/Orders'
import PersonalData from './pages/profile/PersonalData'
import AdminProfile from './pages/admin/AdminProfile'
import Categories from './pages/admin/Categories'
import ProductEditor from './pages/admin/ProductEditor'
import Products from './pages/admin/Products'
import Reports from './pages/admin/Reports'
import Sales from './pages/admin/Sales'

// O React Router não volta ao topo sozinho ao trocar de tela: clicar num card no meio da Home abriria
// a tela do produto já rolada. Isto leva a página ao topo a cada troca de endereço.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/busca" element={<Search />} />
        {/* A sacola é aberta a todos; do "Finalizar compra" em diante (checkout) é preciso ter perfil: quem não entrou
            é levado ao login e volta ao checkout depois, com a sacola intacta. */}
        <Route path="/sacola" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth blockAdmin>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/pagamento-pix"
          element={
            <RequireAuth blockAdmin>
              <PixPayment />
            </RequireAuth>
          }
        />
        <Route
          path="/pedido-concluido"
          element={
            <RequireAuth blockAdmin>
              <OrderPlaced />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/cadastro" element={<Register />} />
        {/* Painel administrativo: só a conta de administrador entra (a barreira está no AdminLayout). */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="produtos" replace />} />
          <Route path="produtos" element={<Products />} />
          <Route path="produtos/novo" element={<ProductEditor />} />
          <Route path="produtos/:variantId/editar" element={<ProductEditor />} />
          <Route path="produtos/:productId/volumes/novo" element={<ProductEditor />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="vendas" element={<Sales />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="meus-dados" element={<AdminProfile />} />
        </Route>
        {/* Telas do perfil compartilham o título e o menu lateral (ProfileLayout). */}
        <Route path="/perfil" element={<ProfileLayout />}>
          <Route index element={<PersonalData />} />
          <Route path="pedidos" element={<Orders />} />
        </Route>
      </Routes>
    </>
  )
}
