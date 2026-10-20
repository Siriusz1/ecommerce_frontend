import { Link } from 'react-router'
import logo from '../../assets/images/logo.png'

// Moldura das telas de login/cadastro/recuperação: logo no topo e uma coluna de 628px centralizada.
export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen justify-center bg-neutral-700 px-4 pb-16 pt-[155px]">
      <div className="flex w-full max-w-[628px] flex-col items-center gap-6">
        <Link to="/" aria-label="Fysikos, voltar para o início">
          {/* O arquivo do logo é uma arte larga (2816x1536); object-cover recorta para 446x243. */}
          <img src={logo} alt="Fysikos" className="h-[243px] w-[446px] object-cover" />
        </Link>
        {children}
      </div>
    </main>
  )
}
