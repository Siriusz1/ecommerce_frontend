import starEmpty from '../assets/icons/search/star-empty.svg'
import starIcon from '../assets/icons/star.svg'

// Desenha exatamente `rating` estrelas cheias (notas fracionadas, como meia estrela, não existem no design).
// Com `total`, completa com estrelas vazias até esse número (usado no filtro "4 ou mais estrelas" da busca).
export default function Stars({ rating, total = rating }) {
  return (
    <div className="flex items-center" role="img" aria-label={`Nota ${rating} de 5`}>
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className="flex w-6 flex-col items-center justify-center overflow-clip p-0.5">
          <div className="relative h-4 w-[17px]">
            {/* A estrela é desenhada com borda que sai do quadro de 17x16, daí o inset negativo. */}
            <div className="absolute inset-[-6.25%_-5.88%]">
              <img src={index < rating ? starIcon : starEmpty} alt="" className="block size-full max-w-none" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
