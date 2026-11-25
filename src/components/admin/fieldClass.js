// Estilo único dos campos do painel (Figma: "field/bg" branco, borda de 2px "border/default", raio 5px) com o contorno de
// foco de 3px dos campos da loja. A altura vem de quem usa: `h-[46px]` nas barras de filtro, `h-14` nos formulários.
export const fieldClass =
  'w-full rounded-card border-2 border-card-border bg-white px-3 text-base font-medium text-red-300 outline-none transition-shadow duration-200 placeholder:text-placeholder focus:shadow-ring disabled:cursor-not-allowed disabled:bg-field-readonly motion-reduce:transition-none'
