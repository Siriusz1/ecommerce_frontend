import { Link } from 'react-router'

// Linha de dois links sublinhados abaixo dos campos (um em cada ponta).
export default function AuthLinks({ left, right }) {
  return (
    <div className="flex items-center justify-between text-xl font-semibold">
      <Link to={left.to} className="underline">
        {left.label}
      </Link>
      <Link to={right.to} className="underline">
        {right.label}
      </Link>
    </div>
  )
}
