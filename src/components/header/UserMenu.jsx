import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import chevronDown from '../../assets/icons/chevron-down.svg'
import userIcon from '../../assets/icons/user.svg'

const iconBox = 'flex size-11 items-center justify-center'

// Visitante: o bloco inteiro é um link para o login ("Login ⌄").
// Logado: vira um botão "Olá, <nome>! ⌄" que abre um menu com a opção de sair.
export default function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  if (!user) {
    return (
      <Link to="/login" className="flex items-center text-base text-neutral-700">
        <span className={iconBox}>
          <img src={userIcon} alt="" className="size-6" />
        </span>
        <span className="flex items-center gap-1">
          Login
          <img src={chevronDown} alt="" className="size-6" />
        </span>
      </Link>
    )
  }

  // O design mostra só o primeiro nome ("Olá, Letícia!").
  const firstName = user.name.trim().split(/\s+/)[0]

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center text-base text-neutral-700"
      >
        <span className={iconBox}>
          <img src={userIcon} alt="" className="size-6" />
        </span>
        <span className="flex items-center gap-1">
          <span>
            Olá, <span className="font-semibold">{firstName}!</span>
          </span>
          {/* A seta gira ao abrir para indicar o estado do menu. */}
          <img
            src={chevronDown}
            alt=""
            className={`size-6 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open && (
        // O Figma não desenha este menu (só o ⌄ ao lado do nome); é o mínimo para chegar ao perfil e sair da conta.
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-40 animate-dropdown rounded-card bg-neutral-700 p-1 text-base font-medium text-neutral-200"
        >
          <Link
            to="/perfil"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full rounded-card px-3 py-2 text-left transition-colors hover:bg-neutral-500/50"
          >
            Meu perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
            className="w-full rounded-card px-3 py-2 text-left transition-colors hover:bg-neutral-500/50"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
