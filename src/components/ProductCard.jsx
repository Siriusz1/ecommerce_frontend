import { Link } from 'react-router'
import shadowLeft from '../assets/icons/product-shadow-1.svg'
import shadowRight from '../assets/icons/product-shadow-2.svg'
import { formatPrice } from '../utils/format'
import AddToCartButton from './AddToCartButton'
import FavoriteButton from './FavoriteButton'
import Stars from './Stars'

export default function ProductCard({ product, className = '' }) {
  return (
    <article
      className={`relative h-[440px] rounded-card border-2 border-neutral-500 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-red-300 ${className}`}
    >
      {/*
        O conteúdo cobre a borda inteira (-inset-0.5 compensa os 2px do border-2) para que a
        imagem fique centralizada no card, e não no espaço interno. Os botões de ação vêm
        depois no DOM para ficarem por cima dele.
      */}
      <div className="absolute -inset-0.5 flex flex-col items-center justify-between pb-5 pt-3">
        <div className="relative h-[275px] w-[181px] shrink-0">
          {/* Sombras do frasco: ficam atrás da foto e a da direita passa da largura do bloco. */}
          <div className="absolute left-[77.5px] top-[238px] h-[9px] w-[37.5px]">
            <div className="absolute inset-[-55.56%_-13.33%]">
              <img src={shadowLeft} alt="" className="block size-full max-w-none" />
            </div>
          </div>
          <div className="absolute left-[143px] top-[240.5px] h-[7.5px] w-[71.5px]">
            <div className="absolute inset-[-66.67%_-6.99%]">
              <img src={shadowRight} alt="" className="block size-full max-w-none" />
            </div>
          </div>
          {/* A foto original tem muito fundo vazio; o recorte em % enquadra só o frasco. */}
          <div className="absolute left-0 top-0 h-[255px] w-[181px] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="absolute left-[-32.85%] top-[-35.5%] h-[157.52%] w-[165.69%] max-w-none"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 px-3">
          <div className="flex items-end gap-[5px]">
            <Stars rating={product.rating} />
            <span className="text-base text-black/50">({product.reviews})</span>
          </div>
          {/*
            Altura fixa de 60px como no Figma: o título tem a caixa de 24px (o texto "vaza" um
            pouco para baixo), o que mantém a descrição colada nele e o preço sempre no mesmo lugar.
          */}
          <div className="flex h-[60px] flex-col gap-1">
            <h3 className="h-6 font-heading text-2xl text-red-200">
              {/*
                "Link esticado": o ::after cobre o card inteiro, então o card todo leva à tela do produto. Os
                botões de sacola e favorito (z-10, abaixo) ficam por cima dele, e não dentro do link, porque um
                botão dentro de <a> é HTML inválido.
              */}
              <Link
                to={`/produto/${product.id}`}
                className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
              >
                {product.name}
              </Link>
            </h3>
            {/* max-w-80 reproduz a quebra do Figma: "...renovação / celular e firmeza." */}
            <p className="max-w-80 text-sm font-medium text-red-300">{product.description}</p>
          </div>
          <p className="font-heading text-2xl font-semibold text-red-300">{formatPrice(product.price)}</p>
        </div>
      </div>

      <div className="absolute right-3 top-2 z-10 flex flex-col">
        <AddToCartButton product={product} />
        <FavoriteButton product={product} />
      </div>
    </article>
  )
}
