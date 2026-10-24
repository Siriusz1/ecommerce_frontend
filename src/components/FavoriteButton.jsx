import { useEffect, useId, useRef, useState } from 'react'
import heartFilled from '../assets/icons/favorite/filled.svg'
import heartOutline from '../assets/icons/heart.svg'
import { useFavorites } from '../context/useFavorites'
import { HEART_PATH } from './HeartIcon'

// A linha do tempo mora no CSS (src/index.css, `--animate-fav-*`); aqui só dizemos quando ela acaba.
// Cada valor tem de ser >= ao fim da última animação da sequência (favoritar: o coração, 640ms;
// desfavoritar: a entrada do coração vazio, 60ms de atraso + 330ms).
const ADD_MS = 640
const REMOVE_MS = 400

// Os 24px do ícone ficam centralizados no botão de 46x44: canto em (11, 10), centro em (23, 22.5).
const HEART_OFFSET = 'translate(11 10)'

// Os 6 raios que abrem em volta do coração. Cada um passa por 3 poses (as dos quadros 315, 316 e 317 do
// Figma): [centro x, centro y, ângulo (graus), comprimento]. O CSS (`fav-ray`) interpola entre elas.
const RAYS = [
  [[41.99, 21.22, 0, 5], [43.49, 20.77, 0, 6], [43.0, 20.32, 0, 7]], // direita
  [[4.01, 21.23, 0, 5], [2.5, 21.11, 0, 6], [3.0, 20.11, 0, 7]], // esquerda
  [[41.22, 13.69, -33.7, 5], [42.64, 12.97, -33.7, 6], [42.06, 12.25, -33.7, 7]], // alto-direita
  [[4.78, 28.75, -33.7, 5], [3.36, 28.91, -33.7, 6], [3.94, 28.19, -33.7, 7]], // baixo-esquerda
  [[40.77, 29.25, 33.7, 5], [43.19, 28.52, 33.7, 6], [41.78, 27.8, 33.7, 7]], // baixo-direita
  [[5.23, 13.2, 33.7, 5], [2.8, 13.36, 33.7, 6], [4.21, 12.63, 33.7, 7]], // alto-esquerda
]

// As poses viram variáveis de CSS (--x0, --y0, --a0, --l0, --x1...) lidas pela animação `fav-ray`.
const rayVars = (poses) =>
  Object.fromEntries(
    poses.flatMap(([x, y, angle, length], index) => [
      [`--x${index}`, `${x}px`],
      [`--y${index}`, `${y}px`],
      [`--a${index}`, `${angle}deg`],
      [`--l${index}`, length],
    ]),
  )

const heartPaint = 'stroke-red-300'
const strokeProps = { strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

// Favoritar: antecipação (cresce) -> semente -> raios -> a semente preenche o coração -> assenta.
function AddOverlay() {
  const clipId = useId()
  return (
    <>
      <defs>
        {/* A semente é recortada pelo contorno do coração: assim ela "enche" o coração por dentro. */}
        <clipPath id={clipId}>
          <path d={HEART_PATH} transform={HEART_OFFSET} />
        </clipPath>
      </defs>

      {/* Tudo o que escala junto com o coração: contorno, preenchimento e semente. */}
      <g className="origin-[23px_22.5px] animate-fav-heart-add">
        <g transform={HEART_OFFSET}>
          {/* O fill-opacity parte de 0 e sobe no fim (fav-fill): o contorno vira o coração cheio. */}
          <path d={HEART_PATH} className={`${heartPaint} fill-red-300 animate-fav-fill`} {...strokeProps} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <circle
            cx="23"
            cy="22.4"
            r="1"
            className="fill-red-300 [transform-box:fill-box] origin-center animate-fav-seed"
          />
        </g>
      </g>

      {RAYS.map((poses, index) => (
        <path
          key={index}
          // Linha de 1 unidade (a animação escala no eixo X até o comprimento do raio). O traço de
          // 1px não pode escalar junto, daí o non-scaling-stroke.
          d="M-0.5 0H0.5"
          className="stroke-red-300 animate-fav-ray"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={rayVars(poses)}
        />
      ))}
    </>
  )
}

// Os 3 riscos de velocidade que ficam acima de um coração em queda (medidas do Figma, em relação ao
// coração parado: a base deles fica 5.5px acima do topo do coração).
function Streak({ className }) {
  return (
    <g className={`origin-[23px_8.5px] ${className}`}>
      <path d="M23.5 -3.5V8.5" className="stroke-red-300" strokeWidth="1" strokeLinecap="round" />
      <path d="M26.5 2.5V8.5" className="stroke-red-300" strokeWidth="1" strokeLinecap="round" />
      <path d="M20.5 2.5V8.5" className="stroke-red-300" strokeWidth="1" strokeLinecap="round" />
    </g>
  )
}

// Desfavoritar: o coração cheio cai e sai pela base enquanto o vazio entra por cima e pousa.
function RemoveOverlay() {
  const clipId = useId()
  return (
    <>
      <defs>
        {/* No Figma os dois corações são cortados pela borda do botão (46x44). */}
        <clipPath id={clipId}>
          <rect width="46" height="44" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g className="animate-fav-fall">
          <g transform={HEART_OFFSET}>
            <path d={HEART_PATH} className={`${heartPaint} fill-red-300`} {...strokeProps} />
          </g>
          <Streak className="animate-fav-streak-out" />
        </g>
        <g className="animate-fav-enter">
          <g transform={HEART_OFFSET}>
            <path d={HEART_PATH} className={`${heartPaint} fill-none`} {...strokeProps} />
          </g>
          <Streak className="animate-fav-streak-in" />
        </g>
      </g>
    </>
  )
}

// Botão de favoritar do card de produto: marca/desmarca o produto e toca a animação correspondente.
export default function FavoriteButton({ product }) {
  const { isFavorite, toggle } = useFavorites()
  const favorite = isFavorite(product.id)

  // null = parado. Durante a animação: `run` muda a cada clique (é a `key` que reinicia o desenho do zero)
  // e `direction` diz qual das duas animações toca.
  const [playing, setPlaying] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const runs = useRef(0)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), []) // não deixa o timer vivo se o card sair da tela

  const handleClick = () => {
    const adding = !favorite
    toggle(product)
    setAnnouncement(`${product.name} ${adding ? 'adicionado aos' : 'removido dos'} favoritos`)

    clearTimeout(timer.current)
    // Quem pediu "reduzir movimento" vê só o resultado (coração cheio/vazio), sem a sequência.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(null)
      return
    }
    runs.current += 1
    setPlaying({ direction: adding ? 'add' : 'remove', run: runs.current })
    timer.current = setTimeout(() => setPlaying(null), adding ? ADD_MS : REMOVE_MS)
  }

  return (
    <button
      type="button"
      aria-label={`Favoritar ${product.name}`}
      aria-pressed={favorite}
      onClick={handleClick}
      className="relative flex h-11 w-[46px] items-center justify-center"
    >
      {/* Parado, é só o ícone; durante a animação, o SVG desenha o próprio coração e este some. */}
      <img src={favorite ? heartFilled : heartOutline} alt="" className={`size-6 ${playing ? 'invisible' : ''}`} />

      {playing && (
        <svg
          key={playing.run}
          aria-hidden
          width="46"
          height="44"
          viewBox="0 0 46 44"
          fill="none"
          // overflow-visible: os raios passam 1px das bordas do botão. pointer-events-none: não rouba cliques.
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
        >
          {playing.direction === 'add' ? <AddOverlay /> : <RemoveOverlay />}
        </svg>
      )}

      {/* Aviso para leitores de tela: a animação é só visual. */}
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </button>
  )
}
