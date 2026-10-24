import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { FavoritesProvider } from './context/FavoritesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
