import gallery1 from '../assets/images/product-detail/gallery-1.png'
import gallery2 from '../assets/images/product-detail/gallery-2.png'
import gallery3 from '../assets/images/product-detail/gallery-3.png'
import gallery4 from '../assets/images/product-detail/gallery-4.png'
import gallery5 from '../assets/images/product-detail/gallery-5.png'
import productImage from '../assets/images/product.png'

const botanicaRenewal = {
  slug: 'botanica-renewal',
  name: 'Botanica Renewal',
  description: 'Creme noturno regenerador para renovação celular e firmeza.',
  price: 150,
  rating: 5,
  reviews: 250,
  image: productImage,

  // Fotos da tela de produto, na ordem em que aparecem lá (a 1ª é a foto grande).
  gallery: [gallery1, gallery2, gallery3, gallery4, gallery5],

  // Conteúdo da tela de produto. É dado de exemplo: o Figma mostra aqui o nome "Botanica Renewal", mas a
  // descrição e os passos são de outro produto (Wella Professionals), e os textos abaixo são os do Figma.
  // Com um catálogo de verdade, cada produto traria os seus.
  page: {
    category: 'Cabelo', // 2º nível da trilha de navegação (Página Inicial > Cabelo > produto)
    description:
      'A Wella Professionals é uma marca global de cosméticos capilares de uso profissional, e não um produto único. Ela possui diversas linhas diferentes para tratamento, coloração e finalização (como Oil Reflections, Invigo Nutri-Enrich, Fusion, Luminous, entre outras).',
    volumes: ['15 ml', '30 ml', '90 ml'],
    installments: 3,
    howToUse: [
      {
        label: 'Passo 1:',
        text: 'Com os cabelos bem molhados, aplique uma quantidade equivalente a uma moeda na palma da mão e espalhe. Aplique diretamente na raiz e massageie suavemente o couro cabeludo com as pontas dos dedos (evite usar as unhas). Deixe a espuma escorrer naturalmente pelo comprimento e pontas sem esfregar para não causar atrito. Enxágue abundantemente. (Repita a lavagem se sentir necessidade).',
      },
      {
        label: 'Passo 2:',
        text: 'O segredo Wella: Retire o excesso de água dos fios com uma toalha. A máscara precisa do cabelo úmido, não encharcado, para penetrar na fibra capilar. Pegue uma pequena quantidade (tamanho de uma noz) e aplique apenas no comprimento e nas pontas, evitando a raiz. Faça o movimento de "enluvar" (deslizar as mãos de cima para baixo) mecha por mecha para garantir que o produto seja bem absorvido. Deixe agir pelo tempo indicado (a maioria das máscaras de tratamento Wella age em apenas 5 minutos). Enxágue 100% do produto.',
      },
      {
        label: 'Passo 3:',
        text: 'Se você possui a linha completa, o condicionador entra após a máscara para selar as cutículas do fio. Aplique no comprimento e pontas, deixe agir por cerca de 30 segundos e enxágue totalmente.',
      },
    ],
  },
}

// O Figma mostra o mesmo produto em todos os cards. Repetimos o item em cada lista (com `id` próprio,
// que também é o endereço da tela dele: /produto/<id>) para o carrossel ter mais de 3 cards.
const repeat = (product, count, list) =>
  Array.from({ length: count }, (_, index) => ({ ...product, id: `${product.slug}-${list}-${index + 1}` }))

export const launches = repeat(botanicaRenewal, 6, 'lancamentos')
export const kits = repeat(botanicaRenewal, 6, 'kits')
export const routine = repeat(botanicaRenewal, 6, 'rotina')

// Par "Proteger e Nutrir" da vitrine com o sinal de "+" entre os dois produtos.
export const duo = repeat(botanicaRenewal, 2, 'duo')

// ---- Catálogo da busca (80 itens de exemplo) ----
// O Figma mostra "80 resultados" e o mesmo produto em todos os cards. Para os filtros terem o que filtrar,
// o nome continua sendo o do Figma, mas categoria, tipo de pele, nota e preço variam de forma previsível.
export const CATEGORIES = ['Rosto', 'Cabelo', 'Unhas', 'Corpo']
export const SKIN_TYPES = ['Seca', 'Oleosa', 'Mista', 'Normal', 'Sensível']
// Faixa de preço dos campos Mínimo/Máximo do filtro (os valores que o Figma desenha).
export const PRICE_BOUNDS = { min: 0, max: 500 }

const SEARCH_PRICES = [150, 89.9, 210, 49.9, 320, 120, 75, 450, 180, 99.9]
const SEARCH_RATINGS = [5, 4, 5, 3, 4, 2, 5, 1, 4, 5]

// Palavras extras que a busca também reconhece (são as sugestões da caixa de busca da navbar).
const searchKeywords = (index) =>
  [index % 3 === 0 && 'kit verão', index % 4 === 1 && 'le pique-nique', index % 2 === 0 && 'hidratantes'].filter(Boolean)

export const searchCatalog = Array.from({ length: 80 }, (_, index) => {
  const category = CATEGORIES[index % CATEGORIES.length]
  return {
    ...botanicaRenewal,
    id: `${botanicaRenewal.slug}-busca-${index + 1}`,
    category,
    // O tipo de pele muda a cada 4 itens e a categoria a cada item: assim todas as combinações existem.
    skinType: SKIN_TYPES[Math.floor(index / CATEGORIES.length) % SKIN_TYPES.length],
    price: SEARCH_PRICES[(index * 3) % SEARCH_PRICES.length],
    rating: SEARCH_RATINGS[index % SEARCH_RATINGS.length],
    keywords: searchKeywords(index),
    page: { ...botanicaRenewal.page, category }, // a trilha da tela de produto mostra a categoria do item
  }
})

const catalog = [...launches, ...kits, ...routine, ...duo, ...searchCatalog]

// Busca um produto pelo `id` (o trecho final do endereço /produto/<id>).
export const findProduct = (id) => catalog.find((product) => product.id === id)
