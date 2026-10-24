import { useEffect, useRef, useState } from 'react'
import copyIcon from '../../assets/icons/profile/copy.svg'
import stepCurrent from '../../assets/icons/profile/step-current.svg'
import stepDone from '../../assets/icons/profile/step-done.svg'
import stepLine from '../../assets/icons/profile/step-line.svg'
import stepPending from '../../assets/icons/profile/step-pending.svg'

const STEP_ICONS = { done: stepDone, current: stepCurrent, pending: stepPending }

function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return // sem permissão/contexto seguro: não há o que fazer além de não mostrar "Copiado"
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <button type="button" onClick={copy} aria-label="Copiar código de rastreio" className="shrink-0">
        <img src={copyIcon} alt="" className="size-5" />
      </button>
      {/* Texto transitório (e anunciado) só para confirmar que copiou; o ícone do Figma não muda. Fica solto (absolute),
          embaixo do código, para não ocupar espaço ao lado dele quando está vazio. */}
      <span role="status" className="absolute right-0 top-full text-sm">
        {copied ? 'Copiado!' : ''}
      </span>
    </>
  )
}

export default function TrackingDetails({ trackingCode, steps }) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-start justify-between border-b border-neutral-400 pb-2 text-base font-medium">
        <span>Código de rastreio</span>
        <div className="relative flex items-center justify-end gap-2">
          <span>{trackingCode}</span>
          <CopyCodeButton code={trackingCode} />
        </div>
      </div>

      <ol className="flex flex-col gap-3 border-b border-neutral-400 pb-2">
        {steps.map((step, index) => {
          // O conector verde liga uma etapa já alcançada (atual/concluída) à etapa de baixo.
          // Etapas "previstas" não têm linha.
          const hasConnector = step.status !== 'pending' && index < steps.length - 1
          return (
            <li key={`${step.title}-${step.date}`} className="relative flex items-center gap-3">
              <img src={STEP_ICONS[step.status]} alt="" className="size-5 shrink-0" />
              {hasConnector && (
                // Sai da base do ícone (50% + 10px) e vai até o topo do ícone seguinte: altura da etapa - 8px.
                <img
                  src={stepLine}
                  alt=""
                  className="absolute left-[9px] top-[calc(50%+10px)] h-[calc(100%-8px)] w-0.5"
                />
              )}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{step.date}</p>
                <p className="text-base font-bold">{step.title}</p>
                <p className="text-base font-medium">{step.place}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
