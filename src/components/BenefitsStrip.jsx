import cardIcon from '../assets/icons/card.svg'
import packageIcon from '../assets/icons/package.svg'
import truckIcon from '../assets/icons/truck.svg'
import RevealArrowLink from './RevealArrowLink'

// Mesma animação do "Ver mais": só o texto no repouso; a seta nasce da direita no hover/foco.
function RulesLink() {
  return <RevealArrowLink className="text-xl font-bold">Confira as regras</RevealArrowLink>
}

function Benefit({ icon, title, children, withRules = false, className = '' }) {
  return (
    <div className={`flex gap-4 ${withRules ? 'items-start' : 'items-center'} ${className}`}>
      <img src={icon} alt="" className="size-12 shrink-0" />
      <div className="flex flex-col gap-4">
        <p className="text-xl">
          <strong className="block font-bold">{title}</strong>
          {children}
        </p>
        {withRules && <RulesLink />}
      </div>
    </div>
  )
}

export default function BenefitsStrip() {
  return (
    <section className="mx-auto flex w-full max-w-content items-start justify-between">
      <Benefit icon={truckIcon} title="Entrega Grátis" withRules>
        Nas compras a partir de <strong className="font-bold">R$ 80,00</strong>
      </Benefit>
      {/* Largura fixa de 370px: é ela que posiciona o bloco do meio, como no Figma. */}
      <Benefit icon={packageIcon} title="Devolução" withRules className="w-[370px]">
        Até 15 dias após o recebimento
      </Benefit>
      <Benefit icon={cardIcon} title="Pagamento Flexível">
        Pague com cartão, boleto ou pix
      </Benefit>
    </section>
  )
}
