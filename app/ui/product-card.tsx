import Link from 'next/link'
import AddToCartButton from './add-to-cart-button'

type ProductCardProps = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  imageUrl: string | null
  category: { name: string; slug: string }
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function ProductCard({ id, name, slug, price, comparePrice, imageUrl, category }: ProductCardProps) {
  const hasDiscount = comparePrice != null && comparePrice > price

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-[transform,box-shadow] duration-[300ms] [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]">

      {/* Image area */}
      <Link href={`/catalogo/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3f0]">

          {/* Quick-add button — aparece en hover */}
          <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <AddToCartButton productId={id} name={name} price={price} imageUrl={imageUrl} size="icon" />
          </div>

          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-[transform] duration-[400ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CategoryIcon category={category.name} />
              </div>
            </div>
          )}

          {/* Category label — top-left glassmorphism */}
          <span className="absolute left-3 top-3 z-10 rounded-[6px] bg-[#0eb1c3]/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {category.name}
          </span>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/catalogo/${slug}`}>
          <p className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-[#1E1E1E] transition-colors hover:text-[#0eb1c3]">
            {name}
          </p>
        </Link>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-black leading-none text-[#1E1E1E]">{fmt(price)}</p>
            {hasDiscount && (
              <p className="text-xs font-semibold text-[#9ca3af] line-through">{fmt(comparePrice!)}</p>
            )}
          </div>
          <p className="mt-1.5 text-xs text-[#9ca3af]">
            6x {fmt(Math.round(price / 6))} sin interés
          </p>
          <AddToCartButton productId={id} name={name} price={price} imageUrl={imageUrl} />
        </div>
      </div>
    </article>
  )
}

export function CategoryIcon({ category }: { category: string }) {
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
          <circle cx="12" cy="3.2" r="0.7" fill="#0eb1c3" stroke="none" />
          <circle cx="17.8" cy="6.5" r="0.7" fill="#0eb1c3" stroke="none" />
          <circle cx="6.2" cy="6.5" r="0.7" fill="#0eb1c3" stroke="none" />
          <circle cx="18.5" cy="11" r="0.7" fill="#0eb1c3" stroke="none" />
          <circle cx="5.5" cy="11" r="0.7" fill="#0eb1c3" stroke="none" />
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
          <circle cx="12" cy="9.8" r="0.9" fill="#0eb1c3" stroke="none" />
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
