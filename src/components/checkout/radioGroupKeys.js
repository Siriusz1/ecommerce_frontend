// Setas ↑/↓/←/→ num grupo de rádios: movem a seleção para o cartão vizinho (e o foco junto).
export function handleRadioGroupKeys(event, ids, selectedId, onSelect) {
  const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
  const step = keys[event.key]
  if (!step || ids.length === 0) return
  event.preventDefault()
  const current = Math.max(0, ids.indexOf(selectedId))
  const next = ids[(current + step + ids.length) % ids.length]
  onSelect(next)
  // O botão do próximo cartão só passa a ter tabIndex 0 depois da re-renderização: foca no quadro seguinte.
  requestAnimationFrame(() => event.currentTarget.querySelector('[role=radio][aria-checked=true]')?.focus())
}
