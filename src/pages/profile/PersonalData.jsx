import { useEffect, useState } from 'react'
import AccessDataCard from '../../components/profile/AccessDataCard'
import DeleteAccountCard from '../../components/profile/DeleteAccountCard'
import PersonalDataCard from '../../components/profile/PersonalDataCard'
import { useAuth } from '../../context/useAuth'
import { getProfile } from '../../services/auth'

// "Meus dados": dados pessoais, dados de acesso e "Excluir minha conta", empilhados com 32px entre eles.
export default function PersonalData() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let cancelled = false
    getProfile({ email: user.email }).then((result) => {
      if (cancelled) return
      // NOT_FOUND = a sessão guardada no navegador não existe mais no "servidor": volta para o login.
      if (result.ok) setProfile(result.profile)
      else signOut()
    })
    return () => {
      cancelled = true
    }
  }, [user.email, signOut])

  if (!profile) return null

  return (
    // -mt-2: no Figma o 1º cartão começa em y=209, 8px acima do menu lateral (y=217).
    <div className="-mt-2 flex flex-col gap-8">
      <PersonalDataCard profile={profile} onProfileChange={setProfile} />
      <AccessDataCard profile={profile} onProfileChange={setProfile} />
      <DeleteAccountCard />
    </div>
  )
}
