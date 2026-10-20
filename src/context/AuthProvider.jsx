import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const STORAGE_KEY = 'fysikos:user'

// Guarda só o nome (nunca a senha) na sessionStorage para o usuário continuar "logado" ao recarregar
// a página. O storage pode estar bloqueado (aba anônima, política do navegador): nesse caso a
// sessão simplesmente vive só enquanto a página estiver aberta.
function readStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function storeUser(user) {
  try {
    if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // sem storage: ignora
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const value = useMemo(
    () => ({
      user, // { name } ou null
      signIn: (nextUser) => {
        storeUser(nextUser)
        setUser(nextUser)
      },
      signOut: () => {
        storeUser(null)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
