// Aviso no topo do login/cadastro para quem foi barrado ao tentar finalizar a compra (o checkout exige perfil). O Figma
// não desenha este aviso. Os itens da sacola ficam guardados no navegador (ver CartProvider).
export default function AccountNotice() {
  return (
    <p role="status" className="w-full rounded-card border-l-4 border-red-300 bg-card px-4 py-3 text-base text-red-300">
      Para finalizar a compra, entre na sua conta ou crie uma. Os itens da sua sacola ficam guardados.
    </p>
  )
}
