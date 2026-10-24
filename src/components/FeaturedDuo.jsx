import plusIcon from '../assets/icons/plus.svg'
import Button from './Button'
import ProductCard from './ProductCard'

// Vitrine de dois produtos complementares ("A + B") com chamada à esquerda.
export default function FeaturedDuo({ products }) {
  return (
    <section className="mx-auto flex w-full max-w-content items-start gap-6">
      <div className="flex h-[440px] w-[410px] shrink-0 flex-col items-start justify-center gap-6 py-2.5">
        <div className="flex w-full flex-col gap-2.5">
          <h2 className="font-heading text-4xl font-semibold">O Duo Indispensável de Verão: Proteger e Nutrir</h2>
          <p className="text-2xl font-medium">Escudo FPS Diário + Hidratante</p>
        </div>
        <p className="text-xl text-red-100">
          Defenda a sua pele. A proteção solar perfeita alia-se ao alívio pós-solar. Ligeiro, apaziguante e feito
          para o verão.
        </p>
        {/* Botão-base "medium" em contorno: no hover ele se preenche. */}
        <Button as="a" href="#" variant="outline">
          Conferir agora
        </Button>
      </div>

      <div className="relative flex min-w-0 flex-1 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="flex-1" />
        ))}
        {/* O "+" fica centralizado entre os dois cards e sobrepõe as bordas deles. */}
        <img
          src={plusIcon}
          alt="mais"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[97px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </section>
  )
}
