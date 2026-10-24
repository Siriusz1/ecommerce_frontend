import { useEffect, useRef, useState } from 'react'
import bagIcon from '../assets/icons/bag.svg'
import checkBadge from '../assets/icons/cart/check-badge.svg'
import sparkA from '../assets/icons/cart/spark-a.svg'
import sparkB from '../assets/icons/cart/spark-b.svg'
import tickCenter from '../assets/icons/cart/tick-center.svg'
import tickLeft from '../assets/icons/cart/tick-left.svg'
import tickRight from '../assets/icons/cart/tick-right.svg'
import trailCenter from '../assets/icons/cart/trail-center.svg'
import trailSide from '../assets/icons/cart/trail-side.svg'
import tube from '../assets/icons/cart/tube.svg'
import { useCart } from '../context/useCart'

// A linha do tempo mora no CSS (src/index.css, `--animate-cart-*`); aqui só dizemos quando ela acaba.
// ANIMATION_MS tem de ser >= ao fim da última animação (a saída: 1700ms + 300ms).
const ANIMATION_MS = 2000
// Com "reduzir movimento" o usuário vê só o resultado (sacola + check), parado, por um instante.
const REDUCED_MOTION_MS = 1800

// Um traço do Figma: uma linha de 1px rotacionada. O Figma exporta cada uma como uma caixa
// (`outer`) com a linha girada dentro (`turn`); `length`/`inset` compensam a espessura do traço.
// As classes chegam inteiras como props porque o Tailwind só gera classes escritas por extenso.
function Stroke({ src, outer, turn, length, inset, animation = '' }) {
  return (
    <div className={`absolute flex items-center justify-center ${outer} ${animation}`}>
      <div className={`flex-none ${turn}`}>
        <div className={`relative h-0 ${length}`}>
          <div className={`absolute ${inset}`}>
            <img src={src} alt="" className="block size-full max-w-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

/*
 * A animação inteira, desenhada num quadro de 46x78px (o do Figma): os 44px de baixo são o botão e
 * os 34px de cima são o espaço por onde o tubo desce. Tudo é montado de uma vez e cada peça tem a
 * sua própria animação de CSS com atraso, o que forma UMA sequência contínua (em vez de trocar de pose):
 *
 *   tubo + riscos de queda -> faíscas e sacola amassando no impacto -> selo de check + brilhos
 *
 * `animated=false` (reduzir movimento) mostra só o estado final, sem nenhuma animação.
 */
function CartBurst({ animated }) {
  const when = (classes) => (animated ? classes : '')

  return (
    <>
      {/* A sacola amassa a partir da base. O tubo vive DENTRO dela: assim a boca da sacola e o recorte
          do tubo descem juntos quando ela amassa, e nunca sobra um vão entre os dois. */}
      <div className={`absolute left-0 top-[34px] h-11 w-[46px] origin-bottom ${when('animate-cart-bag')}`}>
        {animated && (
          // "Janela" que vai do alto até a boca da sacola: o tubo desliza para dentro dela e é recortado
          // ali, de modo que parece entrar na sacola. É o quadro "tubo pequeno" do Figma (o tubo de 28px
          // com só os 21px de cima visíveis). As medidas estão em relação a esta caixa, que começa em
          // y=34 do quadro: a boca (y=45 do quadro) fica em 11px, e `-top-[50px]` deixa 16px de folga
          // acima do quadro para o tubo ser visto chegando.
          <div className="absolute -top-[50px] left-0 h-[61px] w-[46px] overflow-hidden">
            {/* `top-4` devolve a origem do grupo ao y=0 do quadro (a que as medidas do Figma usam). */}
            <div className="absolute left-0 top-4 h-[45px] w-[46px] animate-cart-tube">
              <img src={tube} alt="" className="absolute left-4 top-0 h-[28px] w-[14.805px]" />
              {/* Os riscos andam junto com o tubo (estão no mesmo grupo) e vão sumindo. */}
              <Stroke
                src={trailCenter}
                outer="h-[13px] left-[23px] top-[30px] w-0"
                turn="rotate-90"
                length="w-[13px]"
                inset="inset-[-1px_0_0_0]"
                animation="origin-top animate-cart-trail"
              />
              <Stroke
                src={trailSide}
                outer="h-[7px] left-[26px] top-[33px] w-0"
                turn="rotate-90"
                length="w-[7px]"
                inset="inset-[-1px_0_0_0]"
                animation="origin-top animate-cart-trail"
              />
              <Stroke
                src={trailSide}
                outer="h-[7px] left-[20px] top-[33px] w-0"
                turn="rotate-90"
                length="w-[7px]"
                inset="inset-[-1px_0_0_0]"
                animation="origin-top animate-cart-trail"
              />
            </div>
          </div>
        )}
        {/* `relative` põe o ícone numa camada acima da janela (elementos posicionados pintam por cima dos comuns). */}
        <div className="relative flex h-full items-center justify-center">
          <img src={bagIcon} alt="" className="size-6" />
        </div>
      </div>

      {animated && (
        <>
          {/* Faíscas do impacto, nos 4 cantos da boca da sacola. */}
          <Stroke
            src={sparkA}
            outer="h-[3.646px] left-[34px] top-[33px] w-[3.354px]"
            turn="rotate-[-47.4deg]"
            length="w-[4.954px]"
            inset="inset-[-0.5px_-10.09%]"
            animation="animate-cart-spark"
          />
          <Stroke
            src={sparkB}
            outer="h-[3.646px] left-[9px] top-[33px] w-[3.354px]"
            turn="-scale-y-100 rotate-[-132.6deg]"
            length="w-[4.954px]"
            inset="inset-[-0.5px_-10.09%]"
            animation="animate-cart-spark"
          />
          <Stroke
            src={sparkA}
            outer="h-[3.646px] left-[35px] top-[36px] w-[3.354px]"
            turn="rotate-[-47.4deg]"
            length="w-[4.954px]"
            inset="inset-[-0.5px_-10.09%]"
            animation="animate-cart-spark"
          />
          <Stroke
            src={sparkB}
            outer="h-[3.646px] left-[8px] top-[36px] w-[3.354px]"
            turn="-scale-y-100 rotate-[-132.6deg]"
            length="w-[4.954px]"
            inset="inset-[-0.5px_-10.09%]"
            animation="animate-cart-spark"
          />
        </>
      )}

      {/* Resultado: selo de check no canto da sacola e 3 brilhos em cima. Esmaece no fim (cart-exit). */}
      <div className={`absolute inset-0 ${when('animate-cart-exit')}`}>
        <img
          src={checkBadge}
          alt=""
          className={`absolute left-[26px] top-[60px] size-3 ${when('animate-cart-pop')}`}
        />
        <Stroke
          src={tickCenter}
          outer="h-[4px] left-[23px] top-[36px] w-0"
          turn="rotate-90"
          length="w-[4px]"
          inset="inset-[-0.5px_-12.5%]"
          animation={when('animate-cart-glint')}
        />
        <Stroke
          src={tickRight}
          outer="h-[3.842px] left-[27px] top-[36.16px] w-[1.475px]"
          turn="rotate-111"
          length="w-[4.115px]"
          inset="inset-[-0.5px_-12.15%]"
          animation={when('animate-cart-glint')}
        />
        <Stroke
          src={tickLeft}
          outer="h-[3.842px] left-[17px] top-[36px] w-[1.475px]"
          turn="-scale-y-100 rotate-69"
          length="w-[4.115px]"
          inset="inset-[-0.5px_-12.15%]"
          animation={when('animate-cart-glint')}
        />
      </div>
    </>
  )
}

// Botão "Adicionar à sacola" do card de produto: adiciona o item ao carrinho e toca a animação.
export default function AddToCartButton({ product }) {
  const { addItem } = useCart()
  // null = parado. Durante a animação: `run` muda a cada clique (é a `key` que a reinicia do zero)
  // e `reduced` guarda se o usuário pediu menos movimento naquele momento.
  const [playing, setPlaying] = useState(null)
  const runs = useRef(0)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), []) // não deixa o timer vivo se o card sair da tela

  const handleClick = () => {
    addItem(product)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    runs.current += 1
    setPlaying({ run: runs.current, reduced })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPlaying(null), reduced ? REDUCED_MOTION_MS : ANIMATION_MS)
  }

  return (
    <button
      type="button"
      aria-label={`Adicionar ${product.name} à sacola`}
      onClick={handleClick}
      className="relative flex h-11 w-[46px] items-center justify-center"
    >
      {/* Parado, é só o ícone; durante a animação, o quadro desenha a própria sacola e este some. */}
      <img src={bagIcon} alt="" className={`size-6 ${playing ? 'invisible' : ''}`} />

      {/*
        O quadro tem 78px de altura (34px a mais que o botão) porque o tubo vem "de cima" da sacola.
        Ancorado na base do botão, ele transborda para cima; pointer-events-none para não roubar cliques.
      */}
      {playing && (
        <div
          key={playing.run}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-[78px] w-[46px]"
        >
          <CartBurst animated={!playing.reduced} />
        </div>
      )}

      {/* Aviso para leitores de tela: a animação é só visual. */}
      <span role="status" className="sr-only">
        {playing ? `${product.name} adicionado à sacola` : ''}
      </span>
    </button>
  )
}
