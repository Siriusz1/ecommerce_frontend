import saveMuted from '../../assets/icons/profile/save-muted.svg'
import saveWhite from '../../assets/icons/profile/save-white.svg'
import Button from '../Button'

// "Salvar alterações": o botão-base "medium". Cinza e inerte (sem hover) enquanto não há nada para
// salvar; escuro, com o hover do botão-base, quando há.
export default function SaveButton({ disabled = false, children = 'Salvar alterações' }) {
  return (
    <Button type="submit" disabled={disabled} icon={disabled ? saveMuted : saveWhite}>
      {children}
    </Button>
  )
}
