import { Link } from 'react-router'
import Button from '../Button'

// Botão principal das telas de autenticação: o botão-base "large" ocupando a largura toda (e com o
// hover dele). Com `to` vira um link com a mesma aparência (ex.: "Ir para o Login"), sem sair do
// roteamento do app; sem `to`, é o botão de enviar do formulário.
export default function PrimaryButton({ to, children, ...props }) {
  const shared = { size: 'large', className: 'w-full', ...props }
  if (to) {
    return (
      <Button as={Link} to={to} {...shared}>
        {children}
      </Button>
    )
  }
  return (
    <Button type="submit" {...shared}>
      {children}
    </Button>
  )
}
