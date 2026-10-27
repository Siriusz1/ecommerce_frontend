import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { changeEmail, changePassword } from '../../services/auth'
import { MIN_PASSWORD_LENGTH, messages, validateEmail } from '../../utils/authValidation'
import { maskEmail } from '../../utils/format'
import ExpandableField from './ExpandableField'
import PanelInput from './PanelInput'
import SaveButton from './SaveButton'
import SectionCard from './SectionCard'

const EMPTY_EMAIL = { next: '', confirm: '', password: '' }
const EMPTY_PASSWORDS = { current: '', next: '', confirm: '' }

// "Dados de acesso": e-mail e senha funcionam do mesmo jeito. O lápis abre um painel com os campos da troca;
// salvar valida, confirma a ação com a senha atual (no serviço) e fecha o painel.
// `emailLocked`: o e-mail só se mostra (a conta de administrador muda apenas de senha).
export default function AccessDataCard({ profile, onProfileChange, emailLocked = false }) {
  const { user, updateUser, signOut } = useAuth()
  const [status, setStatus] = useState('')

  // --- E-mail ---
  const [emailOpen, setEmailOpen] = useState(false)
  const [emails, setEmails] = useState(EMPTY_EMAIL)
  const [emailErrors, setEmailErrors] = useState({})

  const toggleEmail = () => {
    setEmailOpen((current) => !current)
    setEmails(EMPTY_EMAIL) // fechar descarta o que foi digitado; abrir começa limpo
    setEmailErrors({})
    setStatus('')
  }

  const setEmailField = (field, value) => {
    setEmails((current) => ({ ...current, [field]: value }))
    setEmailErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    const next = emails.next.trim()
    const errors = {}
    const invalid = validateEmail(next)
    if (invalid) errors.next = invalid
    else if (next.toLowerCase() === profile.email.toLowerCase()) errors.next = messages.emailUnchanged
    if (!errors.next && emails.confirm.trim().toLowerCase() !== next.toLowerCase()) {
      errors.confirm = messages.emailsDiffer
    }
    if (!emails.password) errors.password = messages.currentPasswordEmpty
    setEmailErrors(errors)
    if (Object.keys(errors).length > 0) return

    const result = await changeEmail({ email: user.email, password: emails.password, newEmail: next })
    if (!result.ok) {
      if (result.reason === 'WRONG_PASSWORD') return setEmailErrors({ password: messages.currentPasswordWrong })
      if (result.reason === 'EMAIL_TAKEN') return setEmailErrors({ next: messages.emailTaken })
      return signOut()
    }
    onProfileChange(result.profile)
    // O e-mail é a chave da sessão: sem atualizá-lo, a próxima consulta do perfil não encontraria o usuário.
    updateUser({ email: result.profile.email })
    toggleEmail() // fecha o painel e limpa os campos
    setStatus('E-mail alterado.')
  }

  // --- Senha ---
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS)
  const [passwordErrors, setPasswordErrors] = useState({})

  const togglePassword = () => {
    setPasswordOpen((current) => !current)
    setPasswords(EMPTY_PASSWORDS)
    setPasswordErrors({})
    setStatus('')
  }

  const setPassword = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }))
    setPasswordErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!passwords.current) errors.current = messages.currentPasswordEmpty
    if (passwords.next.length < MIN_PASSWORD_LENGTH) errors.next = messages.passwordTooShort
    if (passwords.confirm !== passwords.next) errors.confirm = messages.passwordsDiffer
    setPasswordErrors(errors)
    if (Object.keys(errors).length > 0) return

    const result = await changePassword({
      email: user.email,
      currentPassword: passwords.current,
      newPassword: passwords.next,
    })
    if (!result.ok) {
      if (result.reason === 'WRONG_PASSWORD') return setPasswordErrors({ current: messages.currentPasswordWrong })
      return signOut()
    }
    togglePassword() // fecha o painel e limpa os campos
    setStatus('Senha alterada.')
  }

  return (
    // Com um painel aberto o Figma deixa só 14px entre o contorno dele e a borda do cartão (fechado, ficam os 24px normais).
    <SectionCard
      aria-labelledby="access-data-title"
      className={`transition-[padding] duration-300 motion-reduce:transition-none ${
        emailOpen || passwordOpen ? 'pb-[14px]' : ''
      }`}
    >
      <h2 id="access-data-title" className="text-2xl font-medium text-neutral-50">
        Dados de acesso
      </h2>

      {/* max-w-[897px]: neste cartão o Figma desenha os campos 5px mais estreitos que a área útil (902px). */}
      <div className="mt-6 flex max-w-[897px] flex-col gap-4">
        <form onSubmit={handleEmailSubmit} noValidate>
          <ExpandableField
            id="email"
            label="E-mail"
            display={emailLocked ? profile.email : maskEmail(profile.email)}
            locked={emailLocked}
            lockedHint="O e-mail do administrador não pode ser alterado."
            open={emailOpen}
            onToggle={toggleEmail}
            openLabel="Cancelar troca de e-mail"
            closedLabel="Alterar e-mail"
          >
            <div className="flex w-[863px] max-w-full flex-col gap-4">
              <PanelInput
                id="new-email"
                type="email"
                label="Digite o novo e-mail"
                autoComplete="email"
                value={emails.next}
                error={emailErrors.next}
                onChange={(event) => setEmailField('next', event.target.value)}
              />
              <PanelInput
                id="confirm-email"
                type="email"
                label="Confirme o novo e-mail"
                autoComplete="off"
                value={emails.confirm}
                error={emailErrors.confirm}
                onChange={(event) => setEmailField('confirm', event.target.value)}
              />
              {/* A senha atual é a confirmação da troca: sem ela, quem pegasse a tela aberta poderia mudar o e-mail. */}
              <PanelInput
                id="email-password"
                type="password"
                label="Digite a sua senha atual"
                autoComplete="current-password"
                value={emails.password}
                error={emailErrors.password}
                onChange={(event) => setEmailField('password', event.target.value)}
              />
            </div>
            <SaveButton disabled={!Object.values(emails).every(Boolean)} />
          </ExpandableField>
        </form>

        <form onSubmit={handlePasswordSubmit} noValidate>
          <ExpandableField
            id="password"
            label="Senha"
            // A senha real nunca é exibida: são só asteriscos de enfeite, como no Figma.
            display="**********"
            decorativeDisplay
            open={passwordOpen}
            onToggle={togglePassword}
            openLabel="Cancelar troca de senha"
            closedLabel="Alterar senha"
          >
            <div className="flex w-[863px] max-w-full flex-col gap-4">
              <PanelInput
                id="current-password"
                type="password"
                label="Digite a sua senha atual"
                autoComplete="current-password"
                value={passwords.current}
                error={passwordErrors.current}
                onChange={(event) => setPassword('current', event.target.value)}
              />
              <PanelInput
                id="new-password"
                type="password"
                label="Digite a nova senha"
                autoComplete="new-password"
                value={passwords.next}
                error={passwordErrors.next}
                onChange={(event) => setPassword('next', event.target.value)}
              />
              <PanelInput
                id="confirm-password"
                type="password"
                label="Confirme sua nova senha"
                autoComplete="new-password"
                value={passwords.confirm}
                error={passwordErrors.confirm}
                onChange={(event) => setPassword('confirm', event.target.value)}
              />
            </div>
            <SaveButton disabled={!Object.values(passwords).every(Boolean)} />
          </ExpandableField>
        </form>
      </div>

      {/* Aviso para leitores de tela: ao salvar, o painel fecha e nada mais indica que deu certo. */}
      <p role="status" className="sr-only">
        {status}
      </p>
    </SectionCard>
  )
}
