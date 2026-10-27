import { Link, useLocation } from 'react-router'

// Linha de dois links sublinhados abaixo dos campos (um em cada ponta). Repassa o estado da navegação (o destino `from`
// de quem foi barrado na sacola) entre login, cadastro e recuperação, para a pessoa não perder o caminho.
export default function AuthLinks({ left, right }) {
  const { state } = useLocation()
  return (
    <div className="flex items-center justify-between text-xl font-semibold">
      <Link to={left.to} state={state} className="underline">
        {left.label}
      </Link>
      <Link to={right.to} state={state} className="underline">
        {right.label}
      </Link>
    </div>
  )
}
