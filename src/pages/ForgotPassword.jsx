import { useState } from 'react'
import TextField from '../components/TextField'
import AuthLayout from '../components/auth/AuthLayout'
import AuthLinks from '../components/auth/AuthLinks'
import PrimaryButton from '../components/auth/PrimaryButton'
import SocialLogin from '../components/auth/SocialLogin'
import { requestPasswordReset } from '../services/auth'
import { messages, validateEmail } from '../utils/authValidation'

export default function ForgotPassword() {
  const [emailError, setEmailError] = useState()
  // Depois de enviar, a tela inteira troca para a confirmação (frame "Esqueci a senha 2").
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const input = event.currentTarget.elements.email
    const email = input.value.trim()

    const invalid = validateEmail(email)
    if (invalid) {
      setEmailError(invalid)
      input.focus()
      return
    }

    const result = await requestPasswordReset({ email })
    if (!result.ok) {
      setEmailError(messages.emailNotFound)
      input.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="flex w-full flex-col gap-10">
          <p role="status" className="text-center text-2xl font-semibold">
            Enviamos um e-mail de recuperação! Por favor, cheque sua caixa de entrada.
          </p>
          <PrimaryButton to="/login">Ir para o Login</PrimaryButton>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center gap-8">
        <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-10">
          <div className="flex flex-col gap-4">
            {/*
              No Figma este campo aparece com o texto "Digite sua senha" e o olho de mostrar senha,
              o que é um engano de cópia (a tela recupera a senha pelo e-mail, e a mensagem de erro
              fala do e-mail). Aqui ele é um campo de e-mail.
            */}
            <TextField
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              error={emailError}
              onChange={() => setEmailError(undefined)}
            />
            <AuthLinks
              left={{ to: '/login', label: 'Realizar login' }}
              right={{ to: '/cadastro', label: 'Não tenho conta cadastrada' }}
            />
          </div>
          <PrimaryButton>Recuperar senha</PrimaryButton>
        </form>
        <SocialLogin />
      </div>
    </AuthLayout>
  )
}
