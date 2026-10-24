export const MIN_PASSWORD_LENGTH = 6

// Textos exatamente como estão nos frames de erro do Figma.
export const messages = {
  emailEmpty: 'Nenhum e-mail informado. Digite um e-mail.',
  emailInvalid: 'O e-mail informado é inválido. Por favor, verifique a escrita e tente novamente.',
  emailNotFound:
    "O e-mail informado não possui cadastro. Clique em 'Não tenho conta cadastrada' para realizar o cadastro.",
  wrongPassword: 'Senha incorreta. Por favor, tente novamente ou clique em “Esqueci minha senha”.',
  nameIncomplete: 'Digite nome e sobrenome',
  passwordTooShort: 'Sua senha não possui a quantidade de caracteres necessários. Digite uma senha válida.',
  passwordsDiffer: 'As senhas não são iguais. Por favor, tente novamente.',
  passwordGuide: `Sua senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`,
  // Perfil: o Figma não desenha erros nessas telas; textos propostos no mesmo tom dos outros.
  phoneInvalid: 'Digite um telefone válido, com DDD.',
  currentPasswordEmpty: 'Digite a sua senha atual.',
  currentPasswordWrong: 'Senha atual incorreta. Por favor, tente novamente.',
  // Troca de e-mail (também sem frame no Figma; mesmo tom).
  emailsDiffer: 'Os e-mails não são iguais. Por favor, tente novamente.',
  emailUnchanged: 'O novo e-mail é igual ao atual. Digite um e-mail diferente.',
  // Este não existe no Figma (não há frame de "e-mail já cadastrado"); texto proposto no mesmo tom.
  emailTaken: "O e-mail informado já possui cadastro. Clique em 'Realizar login' para entrar.",
}

// Retorna a mensagem de erro, ou null se o e-mail estiver ok.
export function validateEmail(email) {
  if (!email) return messages.emailEmpty
  // Checagem simples de formato (algo@dominio.tld); a validação definitiva é do servidor.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return messages.emailInvalid
  return null
}

export const hasFullName = (name) => name.trim().split(/\s+/).filter(Boolean).length >= 2
