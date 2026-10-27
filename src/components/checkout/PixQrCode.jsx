import alignment from '../../assets/images/pix/qr-alignment.svg'
import finderBottomLeft from '../../assets/images/pix/qr-finder-bottom-left.svg'
import finderTopLeft from '../../assets/images/pix/qr-finder-top-left.svg'
import finderTopRight from '../../assets/images/pix/qr-finder-top-right.svg'
import modules from '../../assets/images/pix/qr-modules.svg'

// Uma peça do desenho: a caixa é posicionada em porcentagem do quadro de 130px e a imagem a preenche.
function Piece({ src, className }) {
  return (
    <div className={`absolute ${className}`}>
      <img src={src} alt="" className="block size-full max-w-none" />
    </div>
  )
}

// QR Code de 130px do Figma, montado com as mesmas cinco peças do desenho (módulos, três "olhos" de canto e o quadradinho
// de alinhamento). É só ilustrativo, como o código copia e cola (ver utils/pix.js): quem for pagar de verdade usa o código.
export default function PixQrCode() {
  return (
    <div role="img" aria-label="QR Code do PIX" className="relative size-[130px] overflow-hidden rounded-card border-2 border-card-border bg-panel">
      {/* A caixa interna tem 130px e começa na quina da borda (-2px): é o quadro de onde o Figma tira as porcentagens. */}
      <div className="absolute -left-0.5 -top-0.5 size-[130px]">
        <Piece src={modules} className="left-[18px] top-[18px] size-[94.138px]" />
        <Piece src={finderTopLeft} className="inset-[13.79%_62.07%_62.07%_13.79%]" />
        <Piece src={finderTopRight} className="inset-[13.79%_13.79%_62.07%_62.07%]" />
        <Piece src={finderBottomLeft} className="inset-[62.07%_62.07%_13.79%_13.79%]" />
        <Piece src={alignment} className="inset-[58.62%_24.14%_24.14%_58.62%]" />
      </div>
    </div>
  )
}
