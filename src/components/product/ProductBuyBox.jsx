import { useEffect, useRef, useState } from 'react'
import bagLight from '../../assets/icons/bag-nav.svg'
import minusIcon from '../../assets/icons/product/minus.svg'
import plusIcon from '../../assets/icons/product/plus.svg'
import { useCart } from '../../context/useCart'
import { useFavorites } from '../../context/useFavorites'
import { formatPrice } from '../../utils/format'
import Button from '../Button'
import HeartIcon from '../HeartIcon'
import Stars from '../Stars'
import VolumeSelect from './VolumeSelect'

const MAX_QUANTITY = 99
const ADDED_FEEDBACK_MS = 1800

// O Figma escreve "RS150,00" / "R$50,00" (sem espaço depois do R$), ao contrário dos cards da vitrine.
const money = (value) => formatPrice(value).replace(/\s/g, '')

// Painel de compra (lado direito): avaliação, nome, descrição, preço, volume, quantidade e botões.
// É a parte que fica FIXA enquanto as fotos e as abas rolam (ver ProductPage).
export default function ProductBuyBox({ product }) {
  const { addItem } = useCart()
  const { isFavorite, toggle } = useFavorites()
  const favorite = isFavorite(product.id)
  const { description, volumes, installments } = product.page

  const [volume, setVolume] = useState(volumes[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), []) // não deixa o timer vivo se a tela fechar

  const handleAdd = () => {
    addItem(product, quantity, volume)
    // O Figma não desenha confirmação: o rótulo do botão muda por um instante para o clique "responder".
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end gap-[5px]">
            <Stars rating={product.rating} />
            <span className="text-base text-black/50">({product.reviews})</span>
          </div>
          <div className="flex flex-col gap-[21px]">
            <h1 className="font-heading text-heading font-bold text-green-200">{product.name}</h1>
            <p className="text-base text-red-100">{description}</p>
          </div>
        </div>

        <div className="flex w-[318px] flex-col gap-1.5">
          {/* leading-[normal]: um tamanho "solto" (32px) herda o line-height de 1.5 do navegador; o Figma usa o
              `normal` do CSS (que no Tailwind NÃO é o `leading-normal`: esse vale 1.5). */}
          <p className="font-heading text-[2rem] font-semibold leading-[normal]">{money(product.price)}</p>
          <p className="text-base">
            em até {installments}x de {money(product.price / installments)} sem juros
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/*
          items-start (como no Figma): com o dropdown aberto o seletor fica mais alto, e o contador de
          quantidade tem de continuar no topo da linha, em vez de descer para o centro.
        */}
        <div className="flex items-start gap-6">
          <VolumeSelect options={volumes} value={volume} onChange={setVolume} />

          <div
            role="group"
            aria-label="Quantidade"
            className="flex h-[47px] w-[194px] items-center justify-between border-b-2 border-red-300 px-2 text-xl text-red-300"
          >
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() => setQuantity((current) => current - 1)}
              className="transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <img src={minusIcon} alt="" className="size-6" />
            </button>
            {/* <output> é anunciado pelo leitor de tela a cada mudança. */}
            <output aria-live="polite" aria-label="Quantidade selecionada">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={quantity >= MAX_QUANTITY}
              onClick={() => setQuantity((current) => current + 1)}
              className="transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <img src={plusIcon} alt="" className="size-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="large" icon={bagLight} onClick={handleAdd} className="w-full">
            {added ? 'Adicionado à sacola' : 'Adicionar à sacola'}
          </Button>
          {/*
            "Favoritar" / "Favoritado" (Figma): é sempre o botão em contorno; o que muda é o coração (vazio ->
            cheio) e o texto. O coração é um SVG na cor do texto, então no hover (quando o contorno se preenche e
            o texto fica claro) ele também fica claro, sem precisar de uma versão clara do ícone.
          */}
          <Button
            size="large"
            variant="outline"
            aria-pressed={favorite}
            onClick={() => toggle(product)}
            className="w-full"
          >
            <HeartIcon filled={favorite} />
            {favorite ? 'Favoritado' : 'Favoritar'}
          </Button>
        </div>
      </div>

      <p role="status" className="sr-only">
        {added ? `${quantity} ${quantity === 1 ? 'unidade adicionada' : 'unidades adicionadas'} à sacola` : ''}
      </p>
    </div>
  )
}
