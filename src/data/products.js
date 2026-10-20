import productImage from '../assets/images/product.png'

const botanicaRenewal = {
  name: 'Botanica Renewal',
  description: 'Creme noturno regenerador para renovação celular e firmeza.',
  price: 150,
  rating: 5,
  reviews: 250,
  image: productImage,
}

// O Figma mostra o mesmo produto em todos os cards. Repetimos o item em cada lista
// (com `id` próprio) para o carrossel ter mais de 3 cards e as setas fazerem sentido.
const repeat = (product, count) =>
  Array.from({ length: count }, (_, index) => ({ ...product, id: `${product.name}-${index}` }))

export const launches = repeat(botanicaRenewal, 6)
export const kits = repeat(botanicaRenewal, 6)
export const routine = repeat(botanicaRenewal, 6)

// Par "Proteger e Nutrir" da vitrine com o sinal de "+" entre os dois produtos.
export const duo = repeat(botanicaRenewal, 2)
