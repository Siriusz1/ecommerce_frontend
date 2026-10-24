import arrowUpRight from '../assets/icons/arrow-up-right.svg'
import footerTexture from '../assets/images/footer-texture.png'
import logo from '../assets/images/logo.png'

function ExternalLink({ children, className = '' }) {
  return (
    <a href="#" className={`flex items-end ${className}`}>
      {children}
      <img src={arrowUpRight} alt="" className="size-6" />
    </a>
  )
}

export default function Footer() {
  return (
    // mt-[22px] + o gap de 44px da página = os 66px do Figma entre as seções; o logo
    // sobe 22px acima do topo marrom (-top-[22px]) e por isso não conta nesse espaço.
    <footer className="relative mt-[22px] rounded-t-footer bg-red-300 pb-11 pt-[225px] text-neutral-700">
      {/*
        Textura de curvas de nível: é um PNG vertical (736x1472) girado 90° para cobrir o rodapé
        deitado. `mix-blend-color-dodge` clareia o marrom só nas linhas, por isso ela parece sutil.
        Antes de girar, a altura da imagem vira a LARGURA na tela: 1448px no Figma, e `max(1448px, 100vw)`
        faz ela acompanhar telas mais largas (sem isso, sobrariam faixas sem textura nas laterais).
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-footer mix-blend-color-dodge">
        <img
          src={footerTexture}
          alt=""
          className="absolute left-1/2 top-1/2 h-[max(1448px,100vw)] w-[724px] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 rounded-[75px] object-cover"
        />
      </div>

      <img
        src={logo}
        alt="Fysikos"
        className="absolute -top-[22px] left-1/2 h-[231px] w-[423px] -translate-x-1/2 object-cover"
      />

      <div className="relative mx-auto grid w-full max-w-content grid-cols-[627px_1fr] gap-x-[133px] pl-px">
        <section className="flex flex-col gap-3">
          <h2 className="h-[41px] font-heading text-4xl font-bold">Contatos</h2>
          <div className="flex gap-3">
            <address className="flex-1 text-xl not-italic">
              <p>Avenida dos Jangadeiros, 888 - Mucuripe</p>
              <p>
                <a href="mailto:fusikos@gmail.com" className="underline">
                  fusikos@gmail.com
                </a>
              </p>
              <p>(85)98810-6474</p>
            </address>
            <div className="flex w-[127px] shrink-0 flex-col gap-2 text-xl font-bold">
              <ExternalLink className="gap-[7px]">Facebook</ExternalLink>
              <ExternalLink className="gap-1">Instagram</ExternalLink>
            </div>
          </div>
        </section>

        <section>
          <h2 className="h-[41px] font-heading text-4xl font-bold tracking-snug">Políticas de Uso</h2>
          <div className="mt-[23px] flex flex-col gap-2.5 text-xl">
            {/* mt-[23px]: o 1º link começa a 64px do topo do título (41px de altura + 23px). */}
            <ExternalLink className="w-fit gap-3">
              <span className="w-[320px] underline">Termos de política de privacidade</span>
            </ExternalLink>
            <ExternalLink className="w-fit gap-3">
              <span className="underline">Termos de uso</span>
            </ExternalLink>
          </div>
        </section>
      </div>
    </footer>
  )
}
