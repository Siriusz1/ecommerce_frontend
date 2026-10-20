import { createContext } from 'react'

// O objeto do contexto fica num arquivo próprio (sem componentes) para o fast refresh do Vite
// continuar funcionando em AuthProvider.jsx.
export const AuthContext = createContext(null)
