import boxIcon from '../../assets/icons/checkout/box.svg'

// Cada parágrafo tem uma barra vertical de 4px à esquerda (36px de altura, como no Figma).
function Term({ children }) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden className="h-9 w-1 shrink-0 bg-red-300" />
      <p className="text-base text-black">{children}</p>
    </div>
  )
}

// "Termos de Troca e Devolução": texto fixo da loja. O WhatsApp e o e-mail ainda não têm destino real (usei o e-mail do
// rodapé; o WhatsApp fica sem endereço).
export default function TermsBox() {
  return (
    <section aria-labelledby="terms-title" className="flex w-[410px] max-w-full flex-col gap-[17px]">
      <div className="flex items-center">
        <img src={boxIcon} alt="" className="size-6" />
        <h2 id="terms-title" className="p-2.5 font-heading text-2xl font-semibold text-red-300">
          Termos de Troca e Devolução
        </h2>
      </div>

      <div className="flex flex-col gap-[19px]">
        <Term>
          O produto deve estar na embalagem original, sem sinais de uso, não lavado, não alterado e com as etiquetas
          originais intactas.
        </Term>
        <Term>
          Você tem até 7 dias corridos (após o recebimento) para devolução por arrependimento, ou 30 dias corridos para
          trocas por tamanho, cor ou defeito.
        </Term>
        <Term>
          Entre em contato através do nosso{' '}
          <a href="#" className="font-bold text-green-300 underline decoration-from-font">
            WhatsApp
          </a>{' '}
          ou{' '}
          <a href="mailto:fusikos@gmail.com" className="whitespace-nowrap font-bold text-red-600 underline decoration-from-font">
            E-mail
          </a>{' '}
          informando o número do pedido e o motivo da solicitação.
        </Term>
      </div>

      <a href="#" className="w-fit text-sm text-black underline decoration-from-font">
        Confira os termos completos
      </a>
    </section>
  )
}
