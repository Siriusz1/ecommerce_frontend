// STUB de autenticação: não existe API ainda, então os "usuários cadastrados" vivem só em memória.
//
// Serve para que todas as telas de erro/sucesso do Figma (senha incorreta, e-mail não cadastrado...)
// possam ser alcançadas de verdade. Ao recarregar a página, os cadastros somem (de propósito: assim
// nenhuma senha fica gravada no navegador). Para integrar com o backend, basta reimplementar estas
// três funções mantendo o formato de retorno: `{ ok: true }` ou `{ ok: false, reason }`.

const users = new Map() // e-mail em minúsculas -> { name, password }

const normalize = (email) => email.trim().toLowerCase()

export async function register({ name, email, password }) {
  const key = normalize(email)
  if (users.has(key)) return { ok: false, reason: 'EMAIL_TAKEN' }
  users.set(key, { name, password })
  return { ok: true }
}

export async function login({ email, password }) {
  const user = users.get(normalize(email))
  if (!user) return { ok: false, reason: 'EMAIL_NOT_FOUND' }
  if (user.password !== password) return { ok: false, reason: 'WRONG_PASSWORD' }
  return { ok: true, name: user.name }
}

export async function requestPasswordReset({ email }) {
  if (!users.has(normalize(email))) return { ok: false, reason: 'EMAIL_NOT_FOUND' }
  // Aqui o backend real enviaria o e-mail de recuperação.
  return { ok: true }
}
