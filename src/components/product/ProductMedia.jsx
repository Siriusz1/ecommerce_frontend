const frame = 'rounded-card border-2 border-red-300 object-cover'

// As fotos do produto: uma grande (846x787) e 4 em grade (2x2, de 360px de altura). `images` vem na
// ordem do produto; é a mesma lista que o hover do card da vitrine mostra.
export default function ProductMedia({ images, title }) {
  const [main, ...others] = images

  return (
    <div className="flex flex-col gap-8">
      <img src={main} alt={`${title}: foto principal`} className={`h-[787px] w-full ${frame}`} />

      <div className="grid grid-cols-2 gap-6">
        {others.map((src, index) => (
          <img key={src} src={src} alt={`${title}: foto ${index + 2}`} className={`h-[360px] w-full ${frame}`} />
        ))}
      </div>
    </div>
  )
}
