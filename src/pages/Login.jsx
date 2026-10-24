import { useState } from 'react'
import { useNavigate } from 'react-router'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import AuthLayout from '../components/auth/AuthLayout'
import AuthLinks from '../components/auth/AuthLinks'
import PrimaryButton from '../components/auth/PrimaryButton'
import SocialLogin from '../components/auth/SocialLogin'
import { useAuth } from '../context/useAuth'
import { login } from '../services/auth'
import { MIN_PASSWORD_LENGTH, messages, validateEmail } from '../utils/authValidation'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [errors, setErrors] = useState({})
  // A dica "mínimo 6 caracteres" existe no Figma, mas começa escondida: só aparece depois
  // de uma tentativa de login com senha curta, para não poluir o formulário vazio.
  const [showPasswordHint, setShowPasswordHint] = useState(false)

  // Apagar o erro assim que o usuário volta a digitar naquele campo.
  const clearError = (field) => setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.elements.email.value.trim()
    const password = form.elements.password.value

    const emailError = validateEmail(email)
    const passwordTooShort = password.length < MIN_PASSWORD_LENGTH
    setErrors(emailError ? { email: emailError } : {})
    setShowPasswordHint(passwordTooShort)
    if (emailError || passwordTooShort) {
      form.elements[emailError ? 'email' : 'password'].focus()
      return
    }

    const result = await login({ email, password })
    if (result.ok) {
      signIn({ name: result.name, email: result.email }) // o Header passa a mostrar "Olá, <nome>!"
      navigate('/')
      return
    }
    // Erros vindos do servidor: cada um marca o campo correspondente.
    const isEmailProblem = result.reason === 'EMAIL_NOT_FOUND'
    setErrors(isEmailProblem ? { email: messages.emailNotFound } : { password: messages.wrongPassword })
    form.elements[isEmailProblem ? 'email' : 'password'].focus()
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center gap-8">
        {/* noValidate: a validação do navegador mostraria balões próprios; queremos as mensagens do design. */}
        <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <TextField
                id="email"
                name="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                error={errors.email}
                onChange={() => clearError('email')}
              />
              <PasswordField
                id="password"
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                error={errors.password}
                hint={showPasswordHint ? messages.passwordGuide : undefined}
                onChange={(event) => {
                  clearError('password')
                  // Some a dica assim que a senha atinge o tamanho mínimo.
                  if (event.target.value.length >= MIN_PASSWORD_LENGTH) setShowPasswordHint(false)
                }}
              />
            </div>
            <AuthLinks
              left={{ to: '/esqueci-senha', label: 'Esqueci minha senha' }}
              right={{ to: '/cadastro', label: 'Não tenho conta cadastrada' }}
            />
          </div>
          <PrimaryButton>Realizar Login</PrimaryButton>
        </form>
        <SocialLogin />
      </div>
    </AuthLayout>
  )
}
