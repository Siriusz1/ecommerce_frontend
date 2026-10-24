import { onlyDigits } from './format'

// Textos no mesmo tom dos erros do restante do site (o Figma não desenha erros nestes formulários).
export const checkoutMessages = {
  required: 'Preencha este campo.',
  cep: 'Digite um CEP válido, com 8 números.',
  uf: 'Use a sigla do estado, com 2 letras.',
  cardNumber: 'Número de cartão inválido. Confira os números e tente de novo.',
  cardHolder: 'Digite o nome como está no cartão.',
  cardExpiry: 'Validade inválida ou vencida. Use o formato MM/AA.',
  cardCvv: 'Digite o código de segurança (3 ou 4 números).',
  couponInvalid: 'Cupom inválido ou expirado.',
}

// Algoritmo de Luhn: o dígito de verificação que todo número de cartão real tem. Pega erro de digitação.
export function isValidCardNumber(value) {
  const digits = onlyDigits(value)
  if (digits.length < 13 || digits.length > 16) return false
  let sum = 0
  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

// "MM/AA": mês de 1 a 12 e não vencido (um cartão vale até o fim do mês de validade).
export function isValidExpiry(value, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export function cardBrand(number) {
  const digits = onlyDigits(number)
  if (digits.startsWith('4')) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  return 'Cartão'
}

// Devolve { campo: mensagem } só com os campos que têm erro.
export function validateAddress(values) {
  const errors = {}
  if (onlyDigits(values.cep).length !== 8) errors.cep = checkoutMessages.cep
  for (const field of ['street', 'number', 'district', 'city']) {
    if (!values[field].trim()) errors[field] = checkoutMessages.required
  }
  if (!/^[A-Za-z]{2}$/.test(values.uf.trim())) errors.uf = checkoutMessages.uf
  return errors
}

export function validateCard(values) {
  const errors = {}
  if (!isValidCardNumber(values.number)) errors.number = checkoutMessages.cardNumber
  if (values.holder.trim().split(/\s+/).filter(Boolean).length < 2) errors.holder = checkoutMessages.cardHolder
  if (!isValidExpiry(values.expiry)) errors.expiry = checkoutMessages.cardExpiry
  if (!/^\d{3,4}$/.test(values.cvv)) errors.cvv = checkoutMessages.cardCvv
  return errors
}
