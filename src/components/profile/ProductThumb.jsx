import shadowLeft from '../../assets/icons/profile/thumb-shadow-1.svg'
import shadowRight from '../../assets/icons/profile/thumb-shadow-2.svg'

// Miniatura do produto (80x113): mesma composição do card da vitrine, em escala menor
// (foto recortada em % + duas sombras), com os valores exatos do Figma. `scale` amplia tudo junto (a sacola usa a mesma
// miniatura em 110x155, que é 1,38x).
export default function ProductThumb({ image, scale = 1 }) {
  return (
    <div className="relative shrink-0" style={{ width: 80 * scale, height: 113 * scale }}>
      <div className="absolute left-0 top-0 h-[113px] w-20 origin-top-left" style={{ transform: `scale(${scale})` }}>
      <div className="absolute left-[34.1px] top-[104.72px] h-[3.96px] w-[16.5px]">
        <div className="absolute inset-[-55.56%_-13.33%]">
          <img src={shadowLeft} alt="" className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[62.92px] top-[105.82px] h-[3.3px] w-[31.46px]">
        <div className="absolute inset-[-66.67%_-6.99%]">
          <img src={shadowRight} alt="" className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-0 top-0 h-[112.197px] w-[79.642px] overflow-hidden">
        {/* O nome do produto já está escrito ao lado, então a imagem é decorativa (alt vazio). */}
        <img
          src={image}
          alt=""
          className="absolute left-[-32.85%] top-[-35.5%] h-[157.52%] w-[165.69%] max-w-none"
        />
      </div>
      </div>
    </div>
  )
}
