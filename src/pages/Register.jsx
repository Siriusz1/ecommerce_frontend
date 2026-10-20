import { useState } from 'react'
import { useNavigate } from 'react-router'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import AuthLayout from '../components/auth/AuthLayout'
import AuthLinks from '../components/auth/AuthLinks'
import PrimaryButton from '../components/auth/PrimaryButton'
import { register } from '../services/auth'
import { MIN_PASSWORD_LENGTH, hasFullName, messages, validateEmail } from '../utils/authValidation'

// Ordem dos campos na tela: o primeiro com erro é o que recebe o foco.
const FIELD_ORDER = ['name', 'email', 'password', 'confirmPassword']

export default function Register() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  const clearError = (field) => setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.elements.name.value
    const email = form.elements.email.value.trim()
    const password = form.elements.password.value
    const confirmPassword = form.elements.confirmPassword.value

    // Valida tudo de uma vez: o Figma mostra os quatro erros ao mesmo tempo.
    const nextErrors = {}
    if (!hasFullName(name)) nextErrors.name = messages.nameIncomplete
    const emailError = validateEmail(email)
    if (emailError) nextErrors.email = emailError
    if (password.length < MIN_PASSWORD_LENGTH) nextErrors.password = messages.passwordTooShort
    // Independente do erro acima: o Figma mostra "senha curta" e "senhas diferentes" juntos.
    if (confirmPassword !== password) nextErrors.confirmPassword = messages.passwordsDiffer

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      form.elements[FIELD_ORDER.find((field) => nextErrors[field])].focus()
      return
    }

    const result = await register({ name: name.trim(), email, password })
    if (!result.ok) {
      setErrors({ email: messages.emailTaken })
      form.elements.email.focus()
      return
    }
    // Ainda não há sessão: depois de cadastrar, o usuário entra pela tela de login.
    navigate('/login')
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <TextField
              id="name"
              name="name"
              label="Nome e sobrenome"
              placeholder="Nome e Sobrenome*"
              autoComplete="name"
              error={errors.name}
              onChange={() => clearError('name')}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="Digite seu e-mail*"
              autoComplete="email"
              error={errors.email}
              onChange={() => clearError('email')}
            />
            {/* Aqui a dica de tamanho é fixa (não some ao digitar); o erro a substitui, como no Figma. */}
            <PasswordField
              id="password"
              name="password"
              label="Senha"
              placeholder="Digite sua senha*"
              autoComplete="new-password"
              hint={messages.passwordGuide}
              error={errors.password}
              onChange={() => clearError('password')}
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirme sua senha"
              placeholder="Confirme sua senha*"
              autoComplete="new-password"
              error={errors.confirmPassword}
              onChange={() => clearError('confirmPassword')}
            />
          </div>
          <AuthLinks
            left={{ to: '/login', label: 'Realizar login' }}
            right={{ to: '/esqueci-senha', label: 'Esqueci minha senha' }}
          />
        </div>
        <PrimaryButton>Realizar cadastro</PrimaryButton>
      </form>
    </AuthLayout>
  )
}
