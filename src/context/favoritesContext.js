import { createContext } from 'react'

// Arquivo só com o objeto do contexto (sem componentes) para o fast refresh do Vite continuar
// funcionando em FavoritesProvider.jsx.
export const FavoritesContext = createContext(null)
