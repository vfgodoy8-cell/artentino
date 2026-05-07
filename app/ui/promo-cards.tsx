import type { ReactNode } from 'react'

const promos = [
  {
    icon: <CreditCardIcon />,
    title: 'Cuotas sin interés',
    desc: 'Hasta 6 cuotas sin interés con todas las tarjetas bancarias.',
  },
  {
    icon: <TruckIcon />,
    title: 'Envíos seguros',
    desc: 'Entregamos en todo el país con seguimiento en tiempo real.',
  },
  {
    icon: <BoxIcon />,
    title: 'Lotes mayoristas',
    desc: 'Precios especiales por volumen. Consultá nuestros packs.',
  },
  {
    icon: <PinIcon />,
    title: 'Showroom CABA',
    desc: 'Visitanos en Colegiales, Buenos Aires, de lunes a sábados.',
  },
]

export default function PromoCards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {promos.map((promo) => (
          <div
            key={promo.title}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-200 hover:border-[#0eb1c3] hover:bg-[#f0fdfc] sm:p-6"
          >
            <div
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0fdfc] text-[#0eb1c3] transition-all duration-200 group-hover:bg-[#0eb1c3] group-hover:text-white"
            >
              {promo.icon as ReactNode}
            </div>
            <h3 className="mb-1 text-sm font-black" style={{ color: '#1E1E1E' }}>
              {promo.title}
            </h3>
            <p className="text-xs leading-relaxed text-gray-400">{promo.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
