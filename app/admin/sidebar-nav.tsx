'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/productos', label: 'Productos', icon: 'box' },
  { href: '/admin/categorias', label: 'Categorías', icon: 'layers' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: 'cart' },
  { href: '/admin/turnos', label: 'Turnos', icon: 'calendar' },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col" style={{ backgroundColor: '#1E1E1E' }}>
      {/* Logo */}
      <div className="border-b border-[#2a2a2a] px-6 py-5">
        <span
          className="text-2xl leading-none"
          style={{ fontFamily: 'var(--font-script)', color: '#0eb1c3' }}
        >
          Artentino
        </span>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#444]">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0eb1c3] text-white'
                  : 'text-[#666] hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: back to site */}
      <div className="border-t border-[#2a2a2a] px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#444] transition-colors hover:bg-[#2a2a2a] hover:text-white"
        >
          <ArrowLeftIcon />
          Ver sitio
        </Link>
      </div>
    </aside>
  )
}

function NavIcon({ name }: { name: string }) {
  const p = {
    width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'dashboard': return (
      <svg {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )
    case 'box': return (
      <svg {...p}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
    case 'layers': return (
      <svg {...p}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
    case 'cart': return (
      <svg {...p}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
    case 'calendar': return (
      <svg {...p}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
    default: return null
  }
}

function ArrowLeftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}
