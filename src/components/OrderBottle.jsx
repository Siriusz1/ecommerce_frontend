// Frasco com o selo de "confirmado" da tela "Pedido realizado!" (Figma: "Group", 89,7 x 137,6). As formas são as do SVG
// do Figma, uma a uma; ele está escrito aqui (e não como <img>) só para cada peça poder se mexer sozinha na animação
// de entrada (keyframes `bottle-*` no index.css). `[transform-box:fill-box]` faz o transform de cada peça girar em torno
// da própria caixa, e não da do SVG inteiro. Com "reduzir movimento" ligado, o frasco aparece pronto.
const PART = '[transform-box:fill-box] motion-reduce:animate-none'

export default function OrderBottle({ className = '' }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="89.7494"
      height="137.616"
      viewBox="0 0 89.7494 137.616"
      fill="none"
      overflow="visible"
      className={className}
    >
      {/* Corpo. */}
      <path
        d="M13.961 49.8607C4.65367 53.8496 0 61.1625 0 71.7995V125.649C0 133.627 4.65367 137.616 13.961 137.616H57.8385C67.1458 137.616 71.7995 133.627 71.7995 125.649V71.7995C71.7995 61.1625 67.1458 53.8496 57.8385 49.8607H13.961Z"
        fill="#C7882F"
        className={`${PART} origin-bottom animate-bottle-body`}
      />
      {/* Reflexo da lateral. */}
      <path
        d="M13.961 67.312C13.961 65.3844 12.3984 63.8218 10.4708 63.8218C8.54317 63.8218 6.98053 65.3844 6.98053 67.312V118.17C6.98053 120.098 8.54317 121.66 10.4708 121.66C12.3984 121.66 13.961 120.098 13.961 118.17V67.312Z"
        fill="white"
        fillOpacity="0.3"
        className={`${PART} animate-bottle-fade`}
      />
      {/* Rótulo e a linha dele. */}
      <path
        d="M55.844 79.7772H19.9443C17.7413 79.7772 15.9554 81.5631 15.9554 83.7661V115.677C15.9554 117.88 17.7413 119.666 19.9443 119.666H55.844C58.047 119.666 59.8329 117.88 59.8329 115.677V83.7661C59.8329 81.5631 58.047 79.7772 55.844 79.7772Z"
        fill="#FAF9F4"
        className={`${PART} origin-center animate-bottle-label`}
      />
      <path
        d="M48.365 109.694H27.4234C26.5973 109.694 25.9276 110.363 25.9276 111.189C25.9276 112.016 26.5973 112.685 27.4234 112.685H48.365C49.1911 112.685 49.8608 112.016 49.8608 111.189C49.8608 110.363 49.1911 109.694 48.365 109.694Z"
        fill="#D4B5B0"
        className={`${PART} origin-left animate-bottle-label-line`}
      />
      {/* Colar dourado e conta-gotas. */}
      <path
        d="M47.8663 33.9053H23.9332C22.2809 33.9053 20.9415 35.2447 20.9415 36.8969V46.8691C20.9415 48.5213 22.2809 49.8607 23.9332 49.8607H47.8663C49.5186 49.8607 50.858 48.5213 50.858 46.8691V36.8969C50.858 35.2447 49.5186 33.9053 47.8663 33.9053Z"
        fill="#C9A24A"
        className={`${PART} animate-bottle-collar`}
      />
      <path
        d="M24.9304 37.8942V13.961C24.9304 4.65367 28.5868 0 35.8998 0C43.2127 0 46.8691 4.65367 46.8691 13.961V37.8942H24.9304Z"
        fill="#2B1614"
        className={`${PART} animate-bottle-dropper`}
      />
      {/* Selo verde com o visto. */}
      <path
        d="M73.7939 35.8997C82.6059 35.8997 89.7493 28.7562 89.7493 19.9443C89.7493 11.1323 82.6059 3.98885 73.7939 3.98885C64.982 3.98885 57.8385 11.1323 57.8385 19.9443C57.8385 28.7562 64.982 35.8997 73.7939 35.8997Z"
        fill="#3F6B3A"
        className={`${PART} origin-center animate-bottle-badge`}
      />
      {/* pathLength=1: o traço do visto tem "comprimento" 1; o tracejado "1 2" o mostra inteiro e a animação o desenha de 1 -> 0 (stroke-dashoffset). O vão de 2 evita um pontinho do contorno redondo antes da vez dele. */}
      <path
        d="M66.8134 19.9443L71.7995 24.9304L80.7744 14.9582"
        stroke="#FAF9F4"
        strokeWidth="2.99164"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1 2"
        strokeDashoffset="0"
        className="animate-bottle-check motion-reduce:animate-none"
      />
    </svg>
  )
}
