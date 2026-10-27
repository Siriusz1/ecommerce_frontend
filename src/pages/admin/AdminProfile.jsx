import { useEffect, useState } from 'react'
import PageTitle from '../../components/admin/PageTitle'
import AccessDataCard from '../../components/profile/AccessDataCard'
import { useAuth } from '../../context/useAuth'
import { getProfile } from '../../services/auth'

// "Meus dados" do administrador (/admin/meus-dados): o cartão "Dados de acesso" do perfil do cliente, mas só a SENHA pode
// ser trocada (com a senha atual). O e-mail aparece travado e a conta não pode ser excluída: é a conta que administra a loja.
export default function AdminProfile() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let cancelled = false
    getProfile({ email: user.email }).then((result) => {
      if (cancelled) return
      if (result.ok) setProfile(result.profile)
      else signOut() // a sessão guardada no navegador não existe mais no "servidor"
    })
    return () => {
      cancelled = true
    }
  }, [user.email, signOut])

  if (!profile) return null

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="Meus dados" description="Altere a senha de acesso ao painel." />
      <AccessDataCard profile={profile} onProfileChange={setProfile} emailLocked />
    </div>
  )
}
