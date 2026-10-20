import googleLogo from '../../assets/images/google.png'

// "ou" + botão do Google. Ainda não há integração com o Google, então o botão não faz nada.
export default function SocialLogin() {
  return (
    <>
      <p className="text-xl font-semibold">ou</p>
      <button type="button" className="flex items-start gap-[9px] text-xl font-semibold">
        <img src={googleLogo} alt="" className="size-[27px]" />
        Login com o Google
      </button>
    </>
  )
}
