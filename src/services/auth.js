// STUB de autenticação e perfil: não existe API ainda, então os "usuários cadastrados" vivem só em memória.
//
// Serve para que todas as telas do Figma (erros de login, perfil, troca de senha...) possam ser
// alcançadas de verdade. Ao recarregar a página, os cadastros somem (de propósito: assim nenhuma
// senha fica gravada no navegador). Para integrar com o backend, basta reimplementar estas funções
// mantendo o formato de retorno: `{ ok: true, ... }` ou `{ ok: false, reason }`.

import { clearCheckoutData, moveCheckoutData } from './checkoutData'

const users = new Map() // e-mail em minúsculas -> { name, email, password, phone, cpf, role }

const normalize = (email) => email.trim().toLowerCase()

// Conta do painel administrativo (/admin). Ela existe desde o início e não se cadastra pela tela de cadastro: os outros
// administradores só podem ser criados direto no banco de dados (é o que diz o Figma). `role` separa quem é admin.
export const ADMIN_EMAIL = 'admin@gmail.com'
users.set(ADMIN_EMAIL, { name: 'Administrador', email: ADMIN_EMAIL, password: 'admin', phone: '', cpf: '', role: 'admin' })

export const isAdminEmail = (email = '') => normalize(email) === ADMIN_EMAIL
// A barreira das telas de admin consulta isto (e não só o que a sessão guardou no navegador).
export const isAdminAccount = (email) => users.get(normalize(email ?? ''))?.role === 'admin'

// Nunca devolve a senha para a interface.
const publicProfile = ({ name, email, phone, cpf }) => ({ name, email, phone, cpf })

export async function register({ name, email, password }) {
  const key = normalize(email)
  if (users.has(key)) return { ok: false, reason: 'EMAIL_TAKEN' }
  users.set(key, { name, email: email.trim(), password, phone: '', cpf: '', role: 'customer' })
  clearCheckoutData(email) // conta nova: nenhum endereço ou cartão herdado
  return { ok: true }
}

export async function login({ email, password }) {
  const user = users.get(normalize(email))
  if (!user) return { ok: false, reason: 'EMAIL_NOT_FOUND' }
  if (user.password !== password) return { ok: false, reason: 'WRONG_PASSWORD' }
  return { ok: true, name: user.name, email: user.email, role: user.role }
}

export async function requestPasswordReset({ email }) {
  if (!users.has(normalize(email))) return { ok: false, reason: 'EMAIL_NOT_FOUND' }
  // Aqui o backend real enviaria o e-mail de recuperação.
  return { ok: true }
}

export async function getProfile({ email }) {
  const user = users.get(normalize(email))
  // NOT_FOUND também acontece com a sessão antiga depois de recarregar a página (o stub esquece tudo).
  if (!user) return { ok: false, reason: 'NOT_FOUND' }
  return { ok: true, profile: publicProfile(user) }
}

// `changes` pode ter name, phone e/ou email (trocar o e-mail muda a chave do usuário).
export async function updateProfile({ email, changes }) {
  const user = users.get(normalize(email))
  if (!user) return { ok: false, reason: 'NOT_FOUND' }
  if (user.role === 'admin') return { ok: false, reason: 'FORBIDDEN' } // a conta de administrador só muda de senha

  const next = { ...user, ...changes }
  if (normalize(next.email) !== normalize(user.email)) {
    if (users.has(normalize(next.email))) return { ok: false, reason: 'EMAIL_TAKEN' }
    users.delete(normalize(user.email))
    moveCheckoutData(user.email, next.email) // endereços e cartões salvos acompanham o novo e-mail
  }
  users.set(normalize(next.email), next)
  return { ok: true, profile: publicProfile(next) }
}

// Troca o e-mail (que é a chave do usuário) exigindo a senha atual: é a confirmação da ação.
export async function changeEmail({ email, password, newEmail }) {
  const user = users.get(normalize(email))
  if (!user) return { ok: false, reason: 'NOT_FOUND' }
  if (user.role === 'admin') return { ok: false, reason: 'FORBIDDEN' }
  if (user.password !== password) return { ok: false, reason: 'WRONG_PASSWORD' }
  return updateProfile({ email, changes: { email: newEmail.trim() } })
}

export async function changePassword({ email, currentPassword, newPassword }) {
  const user = users.get(normalize(email))
  if (!user) return { ok: false, reason: 'NOT_FOUND' }
  if (user.password !== currentPassword) return { ok: false, reason: 'WRONG_PASSWORD' }
  user.password = newPassword
  return { ok: true }
}

export async function deleteAccount({ email }) {
  if (users.get(normalize(email))?.role === 'admin') return { ok: false, reason: 'FORBIDDEN' } // o administrador não apaga a conta
  users.delete(normalize(email))
  clearCheckoutData(email)
  return { ok: true }
}
