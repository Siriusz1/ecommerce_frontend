import { useMemo, useState } from 'react'
import { FavoritesContext } from './favoritesContext'

// Favoritos em memória (somem ao recarregar a página), como o carrinho. A tela "Favoritos" do menu
// do perfil ainda não existe; por enquanto isto só guarda quais produtos estão marcados.
export function FavoritesProvider({ children }) {
  const [products, setProducts] = useState([]) // produtos favoritados, na ordem em que foram marcados

  const value = useMemo(() => {
    const ids = new Set(products.map((product) => product.id))
    return {
      products,
      count: products.length,
      isFavorite: (id) => ids.has(id),
      // Marca se ainda não está nos favoritos; desmarca se já está.
      toggle: (product) =>
        setProducts((current) =>
          current.some((item) => item.id === product.id)
            ? current.filter((item) => item.id !== product.id)
            : [...current, product],
        ),
    }
  }, [products])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
