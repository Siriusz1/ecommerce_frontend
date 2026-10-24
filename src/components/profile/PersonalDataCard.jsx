import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { updateProfile } from '../../services/auth'
import { hasFullName, messages } from '../../utils/authValidation'
import { formatPhone, maskCpf, maskPhone, onlyDigits } from '../../utils/format'
import ProfileField from './ProfileField'
import SaveButton from './SaveButton'
import SectionCard from './SectionCard'

const NOT_INFORMED = 'Não informado'

export default function PersonalDataCard({ profile, onProfileChange }) {
  const { user, updateUser, signOut } = useAuth()
  const [editing, setEditing] = useState({ name: false, phone: false })
  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  // O lápis alterna entre ver e editar. Ao começar a editar, o campo mostra o valor completo (sem máscara);
  // ao cancelar, o que foi digitado é descartado.
  const toggleEdit = (field) => {
    const starting = !editing[field]
    setEditing((current) => ({ ...current, [field]: starting }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('')
    if (starting) {
      const initial = field === 'phone' ? formatPhone(profile.phone) : profile.name
      setValues((current) => ({ ...current, [field]: initial }))
    }
  }

  const setValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  // Só entra em `changes` o campo que está em edição E mudou de verdade: é isso que habilita o botão.
  const changes = {}
  if (editing.name && values.name.trim() !== profile.name) changes.name = values.name.trim()
  if (editing.phone && onlyDigits(values.phone) !== profile.phone) changes.phone = onlyDigits(values.phone)
  const hasChanges = Object.keys(changes).length > 0

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hasChanges) return

    const nextErrors = {}
    if ('name' in changes && !hasFullName(changes.name)) nextErrors.name = messages.nameIncomplete
    // Telefone pode ser apagado (vazio); se preenchido, precisa de DDD + 8 ou 9 dígitos.
    if ('phone' in changes && changes.phone && ![10, 11].includes(changes.phone.length)) {
      nextErrors.phone = messages.phoneInvalid
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = await updateProfile({ email: user.email, changes })
    if (!result.ok) {
      signOut() // o usuário deixou de existir no servidor: sessão inválida
      return
    }
    onProfileChange(result.profile)
    // O Header mostra o primeiro nome, então precisa saber do novo nome.
    if (changes.name) updateUser({ name: changes.name })
    setEditing({ name: false, phone: false })
    setStatus('Alterações salvas.')
  }

  return (
    // py-[22px] pl-7 pr-4: neste cartão o Figma usa 22px de respiro vertical e deixa os campos com 906px de largura,
    // 28px da borda esquerda e 16px da direita (nos demais, 24px de todos os lados).
    <SectionCard aria-labelledby="personal-data-title" className="py-[22px] pl-7 pr-4">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
        <h2 id="personal-data-title" className="text-2xl font-medium text-neutral-50">
          Dados pessoais
        </h2>

        <ProfileField
          id="name"
          label="Nome"
          className="mt-[19px]"
          display={profile.name}
          value={values.name}
          editing={editing.name}
          error={errors.name}
          onToggleEdit={() => toggleEdit('name')}
          onChange={(event) => setValue('name', event.target.value)}
          autoComplete="name"
        />

        <div className="mt-[23px] grid grid-cols-2 gap-6">
          <ProfileField
            id="phone"
            label="Telefone"
            display={maskPhone(profile.phone) || NOT_INFORMED}
            value={values.phone}
            editing={editing.phone}
            error={errors.phone}
            onToggleEdit={() => toggleEdit('phone')}
            onChange={(event) => setValue('phone', formatPhone(event.target.value))}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(DD)00000-0000"
          />
          {/* O CPF é mostrado mascarado e não pode ser alterado por aqui (sem lápis). */}
          <ProfileField id="cpf" label="CPF" display={maskCpf(profile.cpf) || NOT_INFORMED} editable={false} />
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          {/* Aviso para leitores de tela: o botão volta a ficar cinza e nada mais indica que salvou. */}
          <p role="status" className="sr-only">
            {status}
          </p>
          <SaveButton disabled={!hasChanges} />
        </div>
      </form>
    </SectionCard>
  )
}
