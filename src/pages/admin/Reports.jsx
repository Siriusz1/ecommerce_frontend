import PageTitle from '../../components/admin/PageTitle'

// Relatórios (/admin/relatorios): existe no menu do Figma, mas a tela ainda não foi desenhada.
export default function Reports() {
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="Relatórios" description="Acompanhe o desempenho da loja ao longo do tempo." />
      <p className="rounded-card border-2 border-card-border bg-section p-6 text-base text-muted">
        Os relatórios estarão disponíveis em breve.
      </p>
    </div>
  )
}
