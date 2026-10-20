import { useState } from 'react'
import eyeIcon from '../assets/icons/eye.svg'
import TextField from './TextField'

// Campo de senha com o olho que alterna entre ocultar e mostrar o texto.
// O Figma só desenhou o olho "aberto"; por isso o ícone não muda, só o aria-label/aria-pressed.
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      action={
        <button
          type="button"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="shrink-0 opacity-60"
        >
          <img src={eyeIcon} alt="" className="size-6" />
        </button>
      }
    />
  )
}
