// Caixa bege com borda cinza que agrupa cada bloco do perfil (dados pessoais, dados de acesso, pedidos).
export default function SectionCard({ children, className = '', ...props }) {
  return (
    <section className={`rounded-card border-2 border-card-border bg-card p-6 ${className}`} {...props}>
      {children}
    </section>
  )
}
