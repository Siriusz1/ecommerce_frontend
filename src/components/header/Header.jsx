import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import bagIcon from '../../assets/icons/bag-nav.svg'
import heartIcon from '../../assets/icons/heart-nav.svg'
import searchIcon from '../../assets/icons/search.svg'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/useCart'
import { useFavorites } from '../../context/useFavorites'
import { TYPES } from '../../data/products'
import SearchBox from './SearchBox'
import UserMenu from './UserMenu'

const HEADER_HEIGHT = 72
// Sublinhado do menu: um traço de 2px (feito com `background`) que cresce da esquerda para a direita no hover/foco e
// recua para a esquerda ao sair. Fica sempre cheio na categoria da busca aberta. `currentColor` = a cor do texto.
const NAV_UNDERLINE =
  'pb-1 [background-image:linear-gradient(currentColor,currentColor)] [background-position:left_bottom] [background-repeat:no-repeat] transition-[background-size] duration-300 ease-out motion-reduce:transition-none'
const NAV_UNDERLINE_OFF = '[background-size:0%_2px] hover:[background-size:100%_2px] focus-visible:[background-size:100%_2px]'
const NAV_UNDERLINE_ON = '[background-size:100%_2px]'

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
  // `pulse` sobe a cada vez que a quantidade AUMENTA (e só então): é a `key` que reinicia a animação da bolinha. Ajustar
  // o estado durante a renderização (e não num efeito) evita um quadro com o valor antigo.
  const [previousCount, setPreviousCount] = useState(cartCount)
  const [pulse, setPulse] = useState(0)
  if (cartCount !== previousCount) {
    setPreviousCount(cartCount)
    if (cartCount > previousCount) setPulse((current) => current + 1)
  }
  const isTransparent = Boolean(heroRef) && !isPastHero

  const [searchOpen, setSearchOpen] = useState(false)
  // A caixa de busca anima ao fechar: o menu de categorias volta já no começo dessa saída, não só quando ela some.
  const [searchClosing, setSearchClosing] = useState(false)
  const searchButtonRef = useRef(null)
  const navHidden = searchOpen && !searchClosing
  // A categoria do menu que está filtrando a busca aberta (para marcar o item com o traço fixo).
  const { pathname, search } = useLocation()
  const activeTypes = pathname === '/busca' ? new URLSearchParams(search).getAll('tipo') : []

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
          {/* Cada categoria leva à busca filtrada por ela (/busca?tipo=...). */}
          {TYPES.map((item) => {
            const active = activeTypes.includes(item)
            return (
              <Link
                key={item}
                to={`/busca?tipo=${encodeURIComponent(item)}`}
                aria-current={active ? 'page' : undefined}
                className={`text-base font-semibold text-neutral-700 ${NAV_UNDERLINE} ${active ? NAV_UNDERLINE_ON : NAV_UNDERLINE_OFF}`}
              >
                {item}
              </Link>
            )
          })}
        </nav>
        {searchOpen && <SearchBox anchorRef={searchButtonRef} onClose={closeSearch} onClosing={() => setSearchClosing(true)} />}

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
              {/* `pulse > 0`: nada anima quando a página abre com itens guardados; só quando entram itens novos. */}
              <span key={pulse} className={`relative ${pulse > 0 ? 'animate-bag-bump motion-reduce:animate-none' : ''}`}>
                <img src={bagIcon} alt="" className="size-6" />
                {cartCount > 0 && (
                  <span
                    key={pulse}
                    aria-hidden
                    // Círculo de 18px (mínimo) no canto superior direito da sacola, como no Figma (x=22 e y=6 dentro da caixa de
                    // 44px do botão; o ícone começa em 10,10, daí o 12px/-4px). Com 2+ dígitos a bolinha alarga. Só existe quando
                    // há itens na sacola.
                    className={`absolute left-3 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-badge px-1 text-[11px] font-medium leading-none text-field ${
                      pulse > 0 ? 'animate-badge-pop motion-reduce:animate-none' : ''
                    }`}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
