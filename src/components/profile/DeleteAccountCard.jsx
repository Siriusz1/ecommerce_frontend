import { useState } from 'react'
import Button from '../Button'
import ConfirmDialog from '../ConfirmDialog'
import { useAuth } from '../../context/useAuth'
import { deleteAccount } from '../../services/auth'

// "Excluir minha conta" (fim da tela Meus dados): cartão de borda vermelha, com a confirmação em modal. Limpar a sessão
// depois de apagar basta: o ProfileLayout exige login e leva ao login.
export default function DeleteAccountCard() {
  const { user, signOut } = useAuth()
  const [confirmation, setConfirmation] = useState(null)

  const askToDelete = () =>
    setConfirmation({
      title: 'Excluir minha conta?',
      description:
        'Sua conta, os endereços e os cartões salvos serão apagados e a sessão termina. Essa ação não pode ser desfeita.',
      confirmLabel: 'Excluir conta',
      onConfirm: async () => {
        setConfirmation(null)
        await deleteAccount({ email: user.email })
        signOut()
      },
    })

  return (
    <section aria-labelledby="delete-account-title" className="flex items-center justify-between gap-6 rounded-card border border-error p-6">
      <div className="flex max-w-[640px] flex-col gap-3">
        <h2 id="delete-account-title" className="text-xl font-bold text-error">
          Excluir minha conta
        </h2>
        <p className="text-base text-red-300">
          Seus dados, endereços e cartões salvos são apagados e você sai da conta. Os pedidos já feitos continuam registrados na loja.
        </p>
      </div>
      <Button type="button" variant="danger-outline" onClick={askToDelete}>
        Excluir conta
      </Button>
      <ConfirmDialog request={confirmation} onCancel={() => setConfirmation(null)} />
    </section>
  )
}
