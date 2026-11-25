import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import creme from '../assets/images/hero/creme.webp'
import gelLimpeza from '../assets/images/hero/gel-limpeza.webp'
import locao from '../assets/images/hero/locao.webp'
import serum from '../assets/images/hero/serum.webp'
import cremeShadow from '../assets/images/hero/shadow-creme.webp'
import gelLimpezaShadow from '../assets/images/hero/shadow-gel-limpeza.webp'
import locaoShadow from '../assets/images/hero/shadow-locao.webp'
import serumShadow from '../assets/images/hero/shadow-serum.webp'
import tonicoShadow from '../assets/images/hero/shadow-tonico.webp'
import leafShadow from '../assets/images/hero/shadow.webp'
import tonico from '../assets/images/hero/tonico.webp'
import wall from '../assets/images/hero/wall.webp'

/*
 * Banner "Botânica Renewal" (Figma: Home - Protótipo Alta, 1440x804).
 *
 * No Figma o banner é UMA foto (1920x1080) com tudo dentro. Para animar cada parte, ele foi remontado em camadas:
 *   1. wall.webp: a parede da foto original, já SEM a sombra das folhas (e sem frascos, título e textos);
 *   2. selos, título, texto e botão, como texto de verdade;
 *   3. shadow.webp: a sombra das folhas da foto original, isolada. É um mapa "multiplicar" (branco = sem sombra);
 *      parede x sombra reproduz a foto do Figma. Como é uma camada à parte, ela pode balançar (ver .hero-shadow);
 *   4. os frascos, recortados da foto original e ampliados 2x para telas de alta densidade, NA FRENTE do título.
 *      Cada um leva junto a PRÓPRIA sombra da foto (shadow-<frasco>.webp: a sombra projetada para a direita e o
 *      contato com o chão), extraída comparando a foto com a parede reconstruída. Ela sobe junto com o frasco.
 * As imagens foram geradas a partir da arte do Figma (Rectangle 2072); se a arte mudar, elas precisam ser refeitas.
 *
 * Tudo é posicionado em % da arte de 1920x1080 e os tamanhos usam `cqw` (1% da largura do banner): o banner inteiro
 * escala junto com a largura da tela, mantendo a composição do Figma.
 *
 * Entrada (ms depois de abrir a página):
 *      250  os frascos sobem da borda de baixo, do centro para as pontas
 *     1050  o título sobe, letra por letra, de trás dos frascos
 *     1550  os selos aparecem          1700  o texto sobe linha a linha          2050  o botão
 * O relógio só começa quando os 5 frascos carregaram (ou após 2,5s, para não travar numa rede lenta): antes disso
 * tudo fica pausado no primeiro quadro, então nenhum frasco "pula" para a tela no meio da subida.
 * Com "reduzir movimento" ligado no sistema, tudo já aparece no lugar (ver `.hero-*` no index.css).
 *
 * Scroll: o banner desce a 40% da velocidade da página e escurece aos poucos. Como o conteúdo logo abaixo (Home.jsx)
 * rola na velocidade normal, ele sobe POR CIMA do banner, como uma folha deslizando sobre ele.
 */

// Posição de cada frasco na arte de 1920x1080 (x, y = canto superior esquerdo do recorte; w = largura).
// `delay` cria a ordem de entrada: o pote do meio primeiro, depois os vizinhos, por fim as pontas.
// `shadow`: a caixa da sombra do frasco, em % do recorte dele (ela passa do frasco para a direita e para baixo).
// prettier-ignore
const PRODUCTS = [
  { src: gelLimpeza, alt: 'Gel de limpeza facial Botânica Renewal', x: 441, y: 526, w: 230, delay: 300, tilt: -5,
    shadow: { src: gelLimpezaShadow, left: -4.348, width: 152.174, height: 107.782 } },
  { src: tonico, alt: 'Tônico facial revitalizante Botânica Renewal', x: 675, y: 461, w: 175, delay: 150, tilt: -3,
    shadow: { src: tonicoShadow, left: -5.714, width: 168.571, height: 107.279 } },
  { src: creme, alt: 'Creme hidratante facial Botânica Renewal', x: 849, y: 784, w: 256, delay: 0, tilt: 0,
    shadow: { src: cremeShadow, left: -3.906, width: 146.875, height: 116.078 } },
  { src: serum, alt: 'Sérum facial antioxidante Botânica Renewal', x: 1102, y: 586, w: 159, delay: 190, tilt: 3,
    shadow: { src: serumShadow, left: -6.289, width: 175.472, height: 109.534 } },
  { src: locao, alt: 'Loção hidratante corporal Botânica Renewal', x: 1273, y: 440, w: 200, delay: 340, tilt: 5,
    shadow: { src: locaoShadow, left: -5, width: 160, height: 107.023 } },
]

const TITLE = 'Botânica Renewal'
const BADGES = ['100% Natural', 'Nova Coleção', 'Origem Vegetal']
const COPY = [
  'Todo grande recomeço começa',
  'com uma pequena semente.',
  'Cada estação nos lembra que é',
  'possível crescer, mudar e',
  'florescer de novo.',
]

const START = 250 // ms: espera o primeiro quadro da página antes de começar
const TITLE_AT = 1050
const BADGES_AT = 1550
const COPY_AT = 1700
const BUTTON_AT = 2050

const pctX = (px) => `${(px / 19.2).toFixed(3)}%`
const pctY = (px) => `${(px / 10.8).toFixed(3)}%`
const ms = (value) => `${value}ms`

const PARALLAX = 0.4 // fração do scroll que o banner acompanha (0 = parado, 1 = rola junto com a página)
const MAX_DIM = 0.45 // escurecimento quando o banner já rolou a própria altura

// Atualiza o deslocamento e o escurecimento no máximo 1x por quadro, direto no estilo (sem re-renderizar o React).
function useParallax(sectionRef, enabled) {
  useEffect(() => {
    const section = sectionRef.current
    if (!enabled || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame
    const update = () => {
      const height = section.offsetHeight
      const scrolled = Math.min(Math.max(window.scrollY, 0), height)
      section.style.setProperty('--hero-shift', `${(scrolled * PARALLAX).toFixed(1)}px`)
      section.style.setProperty('--hero-dim', ((scrolled / height) * MAX_DIM).toFixed(3))
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [sectionRef, enabled])
}

// variant="home": o banner da Home (entrada animada, parallax e o título como <h1>).
// variant="banner": o mesmo cenário como faixa decorativa no topo da busca (Figma "Resultado de Pesquisa"): parado (só as
// folhas balançam), sem parallax, o título não é um cabeçalho da página, e a composição sobe 66px (4,583% da largura)
// para a faixa de 358px mostrar os selos, o título e o topo dos frascos. Quem usa recorta a altura e o torna inerte.
export default function Hero({ variant = 'home' }) {
  const banner = variant === 'banner'
  const sectionRef = useRef(null)
  useParallax(sectionRef, !banner)
  const [loaded, setLoaded] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const ready = loaded >= PRODUCTS.length || timedOut
  const markLoaded = () => setLoaded((count) => count + 1)

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const Title = banner ? 'p' : 'h1'
  const scene = (
      <section
        ref={sectionRef}
        aria-labelledby={banner ? undefined : 'hero-title'}
        className={
          banner
            ? 'hero-static @container absolute inset-x-0 top-[-4.583vw] aspect-video overflow-hidden bg-[#77712f]'
            : `@container absolute inset-x-0 bottom-0 aspect-video overflow-hidden bg-[#77712f] [transform:translate3d(0,var(--hero-shift,0px),0)] ${ready ? '' : 'hero-waiting'}`
        }
      >
        {/* 1. Parede (mesma proporção 16:9 do banner, então nada é cortado). */}
        <img src={wall} alt="" aria-hidden className="absolute inset-0 size-full" />

        {/* 2a. Selos. */}
        <ul className="absolute inset-x-0 flex justify-center gap-[1.65cqw]" style={{ top: pctY(196) }}>
          {BADGES.map((badge, index) => (
            <li
              key={badge}
              className="hero-fade-up flex h-[2.97cqw] items-center rounded-full border-[0.14cqw] border-[#bab46d] px-[0.85cqw] text-[1.22cqw] leading-none text-[#c8c27c]"
              style={{ animationDelay: ms(BADGES_AT + index * 90) }}
            >
              {badge}
            </li>
          ))}
        </ul>

        {/*
        2b. Título. A caixa corta tudo o que passa da linha de base para baixo (clip-path só na borda de baixo), e cada
        letra começa escondida abaixo dela: as letras sobem "de trás" dos frascos, que ficam na frente (z-10).
      */}
        <Title
          id={banner ? undefined : 'hero-title'}
          className="hero-title absolute font-heading text-[11.9cqw] font-normal leading-[1] tracking-[0.04em] whitespace-nowrap text-[#fefabb]"
          style={{ left: pctX(104), top: pctY(262) }}
        >
          <span className="sr-only">{TITLE}</span>
          <span aria-hidden className="block">
            {[...TITLE].map((letter, index) => (
              <span
                key={index}
                className="hero-letter inline-block"
                style={{ animationDelay: ms(TITLE_AT + index * 38) }}
              >
                {/* Um espaço comum some dentro de um inline-block; o inquebrável (nbsp) mantém a largura. */}
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            ))}
          </span>
        </Title>

        {/* 2c. Texto: cada linha sobe dentro da própria "janela". */}
        <p className="absolute text-[1cqw] leading-[1.32cqw] text-[#f1eddb]" style={{ left: pctX(92), top: pctY(510) }}>
          {COPY.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-line block" style={{ animationDelay: ms(COPY_AT + index * 70) }}>
                {line}
              </span>
            </span>
          ))}
        </p>

        {/* 2d. Botão. */}
        <Link
          to="/busca"
          className="hero-fade-up absolute flex h-[3.18cqw] w-[12.3cqw] items-center justify-center rounded-[0.25cqw] border border-white/15 bg-[#312f17] text-[1.15cqw] text-white transition-colors duration-200 hover:bg-[#45421f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2dea4]"
          style={{
            left: pctX(94),
            top: pctY(683),
            animationDelay: ms(BUTTON_AT),
          }}
        >
          Explore a coleção
        </Link>

        {/*
        3. Sombra das folhas: por cima da parede e do texto (como na foto, onde ela cai também sobre o título), mas atrás
        dos frascos. A imagem tem 6% a mais de cada lado (a borda da foto repetida para fora), então ao balançar nunca
        aparece a beirada dela.
      */}
        <div aria-hidden className="pointer-events-none absolute -inset-[6%] mix-blend-multiply">
          <img src={leafShadow} alt="" className="hero-shadow block size-full max-w-none" />
        </div>

        {/* 4. Frascos. Cada um sobe da borda de baixo do banner (que corta o que está fora dele). */}
        {PRODUCTS.map((product) => (
          <div
            key={product.alt}
            className="hero-product absolute z-10"
            style={{
              left: pctX(product.x),
              top: pctY(product.y),
              width: pctX(product.w),
              animationDelay: ms(START + product.delay),
              '--tilt': `${product.tilt}deg`,
            }}
          >
            {/* A sombra da própria foto, atrás do frasco: projetada para a direita e no contato com o chão. */}
            <img
              src={product.shadow.src}
              alt=""
              aria-hidden
              className="absolute top-0 max-w-none"
              style={{
                left: `${product.shadow.left}%`,
                width: `${product.shadow.width}%`,
                height: `${product.shadow.height}%`,
              }}
            />
            <img
              src={product.src}
              alt={product.alt}
              onLoad={markLoaded}
              onError={markLoaded}
              className="relative block w-full"
            />
          </div>
        ))}

        {/* Escurecimento do topo do Figma (Rectangle 2144): dá contraste à navbar transparente. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_top,rgb(0_0_0/0)_42.3%,rgb(0_0_0/0.73)_208.6%)]"
        />

        {/* Escurece conforme o conteúdo de baixo cobre o banner no scroll (ver useParallax). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-black opacity-(--hero-dim,0)" />
      </section>
  )

  if (banner) return scene

  return (
    // O wrapper guarda o lugar do banner na página; o <section> dentro dele é que se desloca no scroll (e pode passar da
    // borda de baixo do wrapper, onde o conteúdo seguinte o cobre).
    // `@container`: os tamanhos internos em `cqw` são relativos à largura deste banner.
    // A arte é 16:9 (1920x1080), mas o banner mostra só os 1016px de baixo dela (proporção 1920/1016): os 64px de cima
    // (parede vazia atrás da navbar) ficam fora. Assim a composição sobe e a base dos frascos, com as sombras deles,
    // aparece inteira mesmo em telas mais baixas. O <section> continua 16:9, preso à base do wrapper.
    <div className="relative aspect-[1920/1016] w-full">{scene}</div>
  )
}
