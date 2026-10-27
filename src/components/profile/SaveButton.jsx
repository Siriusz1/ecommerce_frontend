import saveMuted from '../../assets/icons/profile/save-muted.svg'
import saveWhite from '../../assets/icons/profile/save-white.svg'
import Button from '../Button'

// Botão de salvar (ícone de disquete): o botão-base. Cinza e inerte (sem hover e sem clique) enquanto não há nada para
// salvar ou faltam dados; escuro, com o hover do botão-base, quando dá para salvar. Serve ao "Salvar alterações" do perfil
// (tamanho médio) e aos botões "Adicionar endereço/cartão" do checkout (`size="large"`).
export default function SaveButton({ disabled = false, size = 'medium', className = '', children = 'Salvar alterações' }) {
  return (
    <Button type="submit" size={size} disabled={disabled} icon={disabled ? saveMuted : saveWhite} className={className}>
      {children}
    </Button>
  )
}
