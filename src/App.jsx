import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import ProfileLayout from './components/profile/ProfileLayout'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import OrderPlaced from './pages/OrderPlaced'
import ProductPage from './pages/ProductPage'
import Register from './pages/Register'
import Search from './pages/Search'
import Orders from './pages/profile/Orders'
import PersonalData from './pages/profile/PersonalData'

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
        <Route path="/sacola" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-concluido" element={<OrderPlaced />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/cadastro" element={<Register />} />
        {/* Telas do perfil compartilham o título e o menu lateral (ProfileLayout). */}
        <Route path="/perfil" element={<ProfileLayout />}>
          <Route index element={<PersonalData />} />
          <Route path="pedidos" element={<Orders />} />
        </Route>
      </Routes>
    </>
  )
}
