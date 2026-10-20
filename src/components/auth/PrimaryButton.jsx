import { Link } from 'react-router'

// Botão principal das telas de autenticação. Com `to` vira um link com a mesma aparência
// (ex.: "Ir para o Login"), sem sair do roteamento do app.
export default function PrimaryButton({ to, children, ...props }) {
  const className =
    'flex h-[52px] w-full items-center justify-center rounded-input bg-red-300 px-2.5 py-2 text-xl font-semibold text-neutral-700'

  if (to) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="submit" className={className} {...props}>
      {children}
    </button>
  )
}
