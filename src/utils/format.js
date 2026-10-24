export const onlyDigits = (value = '') => value.replace(/\D/g, '')

export const formatPrice = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

// "R$150,00": o Figma escreve os preços da sacola e do checkout sem espaço depois do R$.
export const formatMoney = (value) => formatPrice(value).replace(/\s/g, '')

// 60140200 -> 60140-200
export function formatCep(value) {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

// 4111111111111111 -> 4111 1111 1111 1111
export const formatCardNumber = (value) =>
  onlyDigits(value)
    .slice(0, 16)
    .replace(/(.{4})(?=.)/g, '$1 ')

// 0229 -> 02/29
export function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

const WEEKDAYS = ['domingo', 'segunda feira', 'terça feira', 'quarta feira', 'quinta feira', 'sexta feira', 'sábado']
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

// Data de entrega no formato do Figma: "quinta feira, 15 de out" (sem hífen e sem ponto, como está no desenho).
export const formatDeliveryDate = (date) =>
  `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`

// (85)98881-0674 — formata enquanto o usuário digita (aceita 10 ou 11 dígitos).
export function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits
  const area = `(${digits.slice(0, 2)})`
  const rest = digits.slice(2)
  if (rest.length <= 4) return area + rest
  const split = rest.length > 8 ? 5 : 4 // celular (9 dígitos) usa 5+4; fixo usa 4+4
  return `${area}${rest.slice(0, split)}-${rest.slice(split)}`
}

// As máscaras abaixo seguem os exemplos do Figma: o dado só aparece inteiro ao editar.

// marcio***********@gmail.com
export function maskEmail(email = '') {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = Math.max(1, Math.min(6, Math.floor(local.length / 2)))
  return `${local.slice(0, visible)}${'*'.repeat(local.length - visible)}@${domain}`
}

// (85)988****74
export function maskPhone(phone = '') {
  const digits = onlyDigits(phone)
  if (digits.length < 10) return ''
  return `(${digits.slice(0, 2)})${digits.slice(2, 5)}****${digits.slice(-2)}`
}

// 101********
export function maskCpf(cpf = '') {
  const digits = onlyDigits(cpf)
  if (digits.length !== 11) return ''
  return `${digits.slice(0, 3)}${'*'.repeat(8)}`
}
