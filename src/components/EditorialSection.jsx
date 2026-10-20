import editorialLaunches from '../assets/images/editorial-lancamentos.jpg'
import editorialMasculine from '../assets/images/editorial-masculino.jpg'
import editorialSkincare from '../assets/images/editorial-skincare.jpg'
import Pill, { ArrowChip } from './Pill'

// Mosaico "Beleza viva": texto institucional + dois atalhos à esquerda e uma foto grande à direita.
export default function EditorialSection() {
  return (
    // 1276px (e não os 1280px do resto da página) é a largura real deste bloco no Figma:
    // duas colunas de 628px + 20px de gap, alinhado à margem esquerda de 80px.
    <section className="mx-20 grid max-w-[1276px] grid-cols-2 gap-5">
      <div className="flex flex-col gap-6">
        <div className="flex h-[390px] flex-col gap-[50px] rounded-card bg-purple-500 pb-[34px] pl-[33px] pr-[41px] pt-6 text-white">
          <h2 className="font-heading text-display font-semibold">
            BELEZA VIVA,
            <br />
            NATURAL
            <br />
            COMO VOCÊ
          </h2>
          <p className="w-[554px] max-w-full text-xl tracking-snug">
            Desenvolvido com tecnologia avançada e ativos dermatológicos de alta performance para
            proporcionar resultados visíveis e uma experiência de cuidado premium.
          </p>
        </div>

        {/* Grid (colunas iguais) em vez de flex: o padding de 134px do 2º card o alargaria. */}
        <div className="grid grid-cols-2 items-center gap-6">
          <a
            href="#"
            className="relative flex h-[222px] items-start justify-between rounded-card pb-[13px] pl-[9px] pr-3.5 pt-2.5"
          >
            {/* Recorte da foto mais larga que o card, deslocada à esquerda para enquadrar o rosto. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-card">
              <img
                src={editorialMasculine}
                alt=""
                className="absolute left-[-13.07%] top-[0.1%] h-[100.06%] w-[131.79%] max-w-none"
              />
            </div>
            <div className="relative flex h-[124px] w-[30px] items-center justify-center">
              {/* Texto vertical, lido de baixo para cima. */}
              <span className="-rotate-90 whitespace-nowrap font-heading text-2xl font-semibold text-red-500">
                {' '}
                Masculino
              </span>
            </div>
            <ArrowChip label="Masculino" className="relative bg-red-500" />
          </a>

          <a
            href="#"
            className="relative flex h-[224px] items-start rounded-card pb-5 pl-[134px] pr-[13px] pt-2.5"
          >
            <img
              src={editorialLaunches}
              alt=""
              className="pointer-events-none absolute inset-0 size-full rounded-card object-cover"
            />
            <div className="relative flex w-[155px] shrink-0 flex-col items-end gap-[120px]">
              <ArrowChip label="Lançamentos" className="bg-green-100" />
              <p className="w-full font-heading text-2xl font-semibold text-green-500">Lançamentos</p>
            </div>
          </a>
        </div>
      </div>

      <div className="relative h-[638px] overflow-hidden rounded-card">
        <img
          src={editorialSkincare}
          alt=""
          className="pointer-events-none absolute left-0 top-[-1.36%] h-[123.04%] w-full max-w-none"
        />
        <Pill className="absolute bottom-[41px] right-[45px] bg-red-100">Skincare</Pill>
      </div>
    </section>
  )
}
