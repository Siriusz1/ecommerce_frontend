// Botão-base do design (Figma: "Frame 14", componentes de botão). Tem 3 tamanhos e 3 estilos:
//
//   size      altura  texto  ícone
//   large      52px    20px   24px
//   medium     48px    16px   20px   (padrão)
//   small      40px    14px   16px
//
//   variant   repouso                          hover
//   default   fundo #472421, texto claro       fundo escurece para #3B1E1B
//   outline   só borda #472421, texto escuro   PREENCHE com #472421 e o texto/ícone ficam claros
//   (disabled)  fundo bege + texto cinza       sem hover (o estado "Disable" do Figma)
//
// `as` troca o elemento (ex.: as="a" href=..., ou as={Link} to=...). `disabled` só faz sentido em <button>.
const SIZES = {
  large: { box: 'h-[52px] px-2.5 text-xl', icon: 'size-6' },
  medium: { box: 'h-12 px-8 text-base', icon: 'size-5' },
  small: { box: 'h-10 px-8 text-sm', icon: 'size-4' },
}

const VARIANTS = {
  default: 'bg-red-300 text-neutral-700 hover:bg-red-200',
  outline: 'border-2 border-red-300 text-red-300 hover:bg-red-300 hover:text-neutral-700',
}

// Desabilitado: um conjunto de classes à parte, sem nenhum `hover:`. Assim não precisa de `enabled:`,
// que não existe em links (<a>), e o botão cinza nunca reage ao mouse.
const DISABLED = 'cursor-not-allowed bg-disabled text-neutral-300'

export default function Button({
  as: Component = 'button',
  size = 'medium',
  variant = 'default',
  disabled = false,
  icon,
  // Só para `outline`: o ícone de repouso é escuro e some no fundo escuro do hover, então o Figma
  // usa uma versão clara dele ao passar o mouse.
  hoverIcon,
  className = '',
  children,
  ...props
}) {
  const { box, icon: iconSize } = SIZES[size]
  const style = disabled ? DISABLED : VARIANTS[variant]
  // O botão "disabled" de verdade só existe em <button>; nos demais, a aparência cinza é suficiente.
  const elementProps = Component === 'button' ? { disabled, type: props.type ?? 'button' } : {}

  return (
    <Component
      {...props}
      {...elementProps}
      aria-disabled={disabled && Component !== 'button' ? true : undefined}
      className={`group inline-flex items-center justify-center gap-3 rounded-card py-3 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 ${box} ${style} ${className}`}
    >
      {icon && (
        <img src={icon} alt="" className={`${iconSize} ${hoverIcon && !disabled ? 'group-hover:hidden' : ''}`} />
      )}
      {icon && hoverIcon && !disabled && (
        <img src={hoverIcon} alt="" className={`hidden ${iconSize} group-hover:block`} />
      )}
      {children}
    </Component>
  )
}
