// Estilo único dos campos do painel (no Figma eles variam de 46 a 60px e de 1 a 2px de borda; aqui seguem os campos do
// perfil da loja: fundo #FDFCF6, raio 5px e o contorno de foco de 3px). A altura vem de quem usa: `h-12` nas barras de
// filtro, `h-[60px]` nos formulários.
export const fieldClass =
  'w-full rounded-card border border-card-border bg-field px-3 text-base font-medium text-red-300 outline-none transition-shadow duration-200 placeholder:text-placeholder focus:shadow-ring disabled:cursor-not-allowed disabled:bg-field-readonly motion-reduce:transition-none'
