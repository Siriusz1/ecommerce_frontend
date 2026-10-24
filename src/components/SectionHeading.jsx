// Título de seção da sacola e do checkout: ícone de 24px + título em Fraunces 32px, numa linha de 59px de altura
// (10px de respiro em cima e embaixo do texto e 12px dos lados, como no Figma).
export default function SectionHeading({ icon, children, className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src={icon} alt="" className="size-6 shrink-0" />
      <h2 className="px-3 py-2.5 font-heading text-[2rem] font-semibold leading-[normal] text-red-300">{children}</h2>
    </div>
  )
}
