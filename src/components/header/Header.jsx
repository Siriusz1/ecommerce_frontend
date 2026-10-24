import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import bagIcon from '../../assets/icons/bag-nav.svg'
import heartIcon from '../../assets/icons/heart-nav.svg'
import searchIcon from '../../assets/icons/search.svg'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/useCart'
import { useFavorites } from '../../context/useFavorites'
import SearchBox from './SearchBox'
import UserMenu from './UserMenu'

const HEADER_HEIGHT = 72
const navItems = ['Limpeza', 'Tratamento e Nutrição', 'Hidratação', 'Tonificação', 'Proteção']

// Vira `true` quando a base do hero chega à altura da barra, ou seja, no instante em que a barra
// começa a ficar sobre o fundo claro da página. `requestAnimationFrame` limita o cálculo a 1x por frame.
function useIsPastHero(heroRef) {
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    if (!heroRef) return
    let frame
    const update = () => {
      const hero = heroRef.current
      if (hero) setIsPast(hero.getBoundingClientRect().bottom <= HEADER_HEIGHT)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update() // a página pode abrir já rolada (ex.: recarregar no meio da Home)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [heroRef])

  return isPast
}

function NavIconButton({ icon, label, ...props }) {
  return (
    <button type="button" aria-label={label} className="flex size-11 items-center justify-center" {...props}>
      <img src={icon} alt="" className="size-6" />
    </button>
  )
}

/*
 * Barra de navegação fixa no topo.
 *
 * - Com `heroRef` (só a Home): fica TRANSPARENTE sobre a foto do hero e ganha o fundo escuro
 *   assim que a página rola além dele.
 * - Sem `heroRef` (qualquer outra tela): sempre com o fundo escuro.
 *
 * A troca é uma transição de cor de fundo (300ms), por isso o fundo "transparente" é o próprio
 * vermelho escuro com 0% de opacidade: assim a animação é um fade puro, sem passar por cinza.
 */
export default function Header({ heroRef, minimal = false }) {
  const { user, signOut } = useAuth()
  // Só para os rótulos de acessibilidade da sacola e dos favoritos (o Figma não desenha contador).
  const { count: cartCount } = useCart()
  const { count: favoritesCount } = useFavorites()
  const isPastHero = useIsPastHero(heroRef)
  const isTransparent = Boolean(heroRef) && !isPastHero

  const [searchOpen, setSearchOpen] = useState(false)
  // A caixa de busca anima ao fechar: o menu de categorias volta já no começo dessa saída, não só quando ela some.
  const [searchClosing, setSearchClosing] = useState(false)
  const searchButtonRef = useRef(null)
  const navHidden = searchOpen && !searchClosing

  const closeSearch = useCallback((restoreFocus = false) => {
    setSearchOpen(false)
    setSearchClosing(false)
    // O botão de busca só fica visível (e focável) depois da atualização; espera o próximo frame para focá-lo.
    if (restoreFocus) requestAnimationFrame(() => searchButtonRef.current?.focus())
  }, [])

  // Checkout: só o logo, para a pessoa não se distrair do pagamento (o Figma desenha a barra assim).
  if (minimal) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 h-18 bg-red-800">
        <div className="mx-auto flex h-full max-w-page items-center px-12">
          <Link to="/" className="flex shrink-0 items-center">
            <img src={logo} alt="Fysikos" className="h-18 w-[132px] object-cover" />
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-18 transition-colors duration-300 ease-out motion-reduce:transition-none ${
        isTransparent ? 'bg-red-800/0' : 'bg-red-800'
      }`}
    >
      <div className="relative mx-auto flex h-full max-w-page items-center justify-between px-12">
        <Link to="/" className="flex w-[292px] shrink-0 items-center">
          {/* O arquivo do logo é uma arte larga (2816x1536); object-cover recorta para 132x72. */}
          <img src={logo} alt="Fysikos" className="h-18 w-[132px] object-cover" />
        </Link>

        {/*
          O menu de categorias NUNCA sai do lugar: com a busca aberta ele só fica transparente (e inerte, fora do Tab e
          dos leitores de tela) e a barra de busca cresce por cima dele. Assim nada pula de lugar durante a animação.
        */}
        <nav
          aria-label="Categorias"
          inert={navHidden}
          className={`flex items-center gap-6 transition-opacity duration-200 motion-reduce:transition-none ${
            navHidden ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {navItems.map((item) => (
            // O sublinhado só aparece no hover; a borda transparente reserva o espaço para o item não pular.
            <a
              key={item}
              href="#"
              className="border-b-2 border-transparent pb-0.5 text-base font-semibold text-neutral-700 transition-colors hover:border-neutral-700"
            >
              {item}
            </a>
          ))}
        </nav>
        {searchOpen && <SearchBox onClose={closeSearch} onClosing={() => setSearchClosing(true)} />}

        <div className="flex shrink-0 items-center gap-2">
          {/* `invisible` (e não removido) mantém o lugar da lupa: a barra de busca nasce exatamente em cima dela. */}
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
            className={`flex size-11 items-center justify-center ${searchOpen ? 'invisible' : ''}`}
          >
            <img src={searchIcon} alt="" className="size-6" />
          </button>
          <div className="flex items-center gap-[9px]">
            <NavIconButton
              icon={heartIcon}
              label={favoritesCount > 0 ? `Favoritos, ${favoritesCount} ${favoritesCount === 1 ? 'item' : 'itens'}` : 'Favoritos'}
            />
            <UserMenu user={user} onSignOut={signOut} />
            <Link
              to="/sacola"
              aria-label={cartCount > 0 ? `Sacola, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : 'Sacola'}
              className="flex size-11 items-center justify-center"
            >
              <img src={bagIcon} alt="" className="size-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
