// STUB dos endereços e cartões salvos de cada conta (não há backend). Fica em memória, por e-mail, como as contas de
// services/auth.js: sobrevive à navegação entre telas e some ao recarregar a página. Uma conta nova NÃO traz nada
// pronto: começa sem endereço e sem cartão, e quem os cadastra no checkout os encontra de volta nas próximas visitas.

const store = new Map() // e-mail em minúsculas -> { addresses, cards }

const keyOf = (email) => email.trim().toLowerCase()

export function getCheckoutData(email) {
  return store.get(keyOf(email)) ?? { addresses: [], cards: [] }
}

export function saveCheckoutData(email, data) {
  store.set(keyOf(email), data)
}

// Trocar o e-mail da conta leva os dados junto; excluir a conta os apaga.
export function moveCheckoutData(fromEmail, toEmail) {
  const data = store.get(keyOf(fromEmail))
  if (!data || keyOf(fromEmail) === keyOf(toEmail)) return
  store.delete(keyOf(fromEmail))
  store.set(keyOf(toEmail), data)
}

export function clearCheckoutData(email) {
  store.delete(keyOf(email))
}
