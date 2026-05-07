import { prisma } from '@/lib/prisma'

function fmt(n: { toString(): string } | number) {
  return `$${Number(n.toString()).toLocaleString('es-AR')}`
}

export default async function ProductGrid() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p
            className="mb-1 text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ color: '#2BBCB0' }}
          >
            Lo más vendido
          </p>
          <h2 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E] sm:text-3xl">
            Productos destacados
          </h2>
        </div>
        <a
          href="/catalogo"
          className="hidden text-sm font-bold text-[#1E1E1E] underline-offset-4 hover:text-[#2BBCB0] hover:underline sm:block"
        >
          Ver todos →
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {products.map((product) => {
          const categoryName = product.category.name
          const price = Number(product.price.toString())

          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image area */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">

                {/* Category badge */}
                <span
                  className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: '#2BBCB0' }}
                >
                  {categoryName}
                </span>

                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <CategoryIcon category={categoryName} />
                    </div>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-4">
                <p className="mb-4 line-clamp-2 text-sm font-bold leading-snug text-[#1E1E1E]">
                  {product.name}
                </p>

                <div className="mt-auto">
                  <p className="text-2xl font-black leading-none text-[#1E1E1E]">
                    {fmt(price)}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-400">
                    6x {fmt(Math.round(price / 6))} sin interés
                  </p>
                  <button className="mt-4 w-full rounded-xl bg-[#1E1E1E] py-3 text-xs font-black uppercase tracking-widest text-white transition-colors duration-200 hover:bg-[#2BBCB0]">
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 text-center sm:hidden">
        <a
          href="/catalogo"
          className="inline-flex h-11 items-center rounded-xl border border-gray-200 px-8 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#2BBCB0] hover:text-[#2BBCB0]"
        >
          Ver todos los productos
        </a>
      </div>
    </section>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const base = {
    width: 32,
    height: 32,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#1E1E1E',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (category) {
    case 'Espejos LED':
      return (
        <svg {...base}>
          <ellipse cx="12" cy="11" rx="6" ry="7.5" />
          <line x1="12" y1="18.5" x2="12" y2="22" />
          <line x1="9" y1="22" x2="15" y2="22" />
          <circle cx="12" cy="3.2" r="0.7" fill="#2BBCB0" stroke="none" />
          <circle cx="17.8" cy="6.5" r="0.7" fill="#2BBCB0" stroke="none" />
          <circle cx="6.2" cy="6.5" r="0.7" fill="#2BBCB0" stroke="none" />
          <circle cx="18.5" cy="11" r="0.7" fill="#2BBCB0" stroke="none" />
          <circle cx="5.5" cy="11" r="0.7" fill="#2BBCB0" stroke="none" />
        </svg>
      )

    case 'Tazas':
      return (
        <svg {...base}>
          <path d="M6 4h12l-2 14a2 2 0 0 1-2 1.8H10a2 2 0 0 1-2-1.8L6 4z" />
          <path d="M18 7h1.5a2 2 0 0 1 0 4H18" />
        </svg>
      )

    case 'Vasos Térmicos':
      return (
        <svg {...base}>
          <path d="M9 2h6l.5 2H8.5L9 2z" />
          <rect x="8" y="4" width="8" height="17" rx="2" />
          <line x1="8.5" y1="9" x2="15.5" y2="9" strokeWidth={1} strokeDasharray="2 1.5" />
        </svg>
      )

    case 'Lámparas':
      return (
        <svg {...base}>
          <path d="M7 9 Q12 2 17 9 H7z" />
          <line x1="12" y1="9" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <circle cx="12" cy="9.8" r="0.9" fill="#2BBCB0" stroke="none" />
        </svg>
      )

    case 'Mate':
      return (
        <svg {...base}>
          <path d="M8 10 Q7 22 12 22 Q17 22 16 10 Z" />
          <rect x="10" y="7" width="4" height="4" rx="1" />
          <ellipse cx="12" cy="7" rx="2.5" ry="1" />
          <line x1="13.5" y1="6.5" x2="18" y2="2" strokeWidth={1.5} />
          <circle cx="18" cy="2" r="1.2" />
        </svg>
      )

    case 'Muebles':
      return (
        <svg {...base}>
          <rect x="5" y="6" width="14" height="8" rx="2" />
          <rect x="3" y="10" width="3" height="6" rx="1" />
          <rect x="18" y="10" width="3" height="6" rx="1" />
          <rect x="5" y="14" width="14" height="3" rx="1" />
          <line x1="7" y1="17" x2="7" y2="21" />
          <line x1="17" y1="17" x2="17" y2="21" />
        </svg>
      )

    default:
      return (
        <svg {...base}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
  }
}
