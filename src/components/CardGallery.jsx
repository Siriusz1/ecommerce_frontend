import { useEffect, useState } from 'react'

// Quanto cada foto fica à mostra e quanto dura a troca (a foto nova aparece enquanto a anterior some: "gradual").
const CYCLE_MS = 1800
const FADE_MS = 700

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Camada de fotos do card de produto: enquanto o mouse (ou o foco) está no card, as fotos da tela de produto entram por
// cima da imagem do card, uma de cada vez, com esmaecimento suave, e voltam ao frasco quando ele sai. Cobre só a área da
// imagem, como no Figma: 399x261px, a 6px das bordas do card e com cantos de 3px (o texto fica de fora). Não recebe cliques.
//   - As fotos são pesadas, então só são carregadas a partir do 1º hover (e a próxima já vem pré-carregada).
//   - Com movimento reduzido: mostra só a 1ª foto, sem trocar nem esmaecer.
export default function CardGallery({ images, active }) {
  const [tick, setTick] = useState(0) // quantas trocas já aconteceram neste hover
  const [loaded, setLoaded] = useState(0) // quantas fotos já foram montadas (e ficam no cache)
  const [wasActive, setWasActive] = useState(false)
  // As fotos são montadas no 1º hover; sem isto elas já nasceriam visíveis e não haveria de onde partir o esmaecimento.
  // `armed` só vira verdadeiro depois de um quadro pintado com tudo transparente.
  const [armed, setArmed] = useState(false)

  // Ao começar um hover: volta para a 1ª foto e monta a 1ª + a próxima. (Ajuste durante a renderização, não em efeito.)
  if (active !== wasActive) {
    setWasActive(active)
    if (active) {
      setTick(0)
      setLoaded((current) => Math.max(current, Math.min(2, images.length)))
    } else {
      setArmed(false)
    }
  }

  useEffect(() => {
    if (!active) return
    let inner
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setArmed(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [active])

  useEffect(() => {
    if (!active || images.length < 2 || prefersReducedMotion()) return
    const timer = setInterval(() => {
      setTick((current) => current + 1)
      // Mantém sempre a foto seguinte montada: ela carrega antes de ser a vez dela.
      setLoaded((current) => Math.min(images.length, Math.max(current, (tick % images.length) + 3)))
    }, CYCLE_MS)
    return () => clearInterval(timer)
  }, [active, images.length, tick])

  const current = tick % images.length

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-1 top-1 h-[261px] overflow-hidden rounded-[3px]">
      {images.slice(0, loaded).map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={`absolute inset-0 size-full object-cover transition-opacity ease-in-out motion-reduce:transition-none ${
            armed && active && index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
