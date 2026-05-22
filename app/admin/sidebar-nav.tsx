'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

type NavItem = {
  href: string
  label: string
  icon: string
  disabled?: boolean
}

type NavGroup = {
  id: string
  label: string
  icon: string
  items: NavItem[]
  defaultOpen?: boolean
}

const standaloneItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
]

const groups: NavGroup[] = [
  {
    id: 'catalogo',
    label: 'Catálogo',
    icon: 'layers',
    defaultOpen: true,
    items: [
      { href: '/admin/productos', label: 'Productos', icon: 'box' },
      { href: '/admin/categorias', label: 'Categorías', icon: 'folder' },
      { href: '/admin/atributos', label: 'Atributos', icon: 'tag' },
      { href: '/admin/condicion', label: 'Condición', icon: 'badge' },
      { href: '/admin/destacados', label: 'Destacados', icon: 'star' },
      { href: '#', label: 'Import / Export', icon: 'upload', disabled: true },
      { href: '#', label: 'Marcas', icon: 'briefcase', disabled: true },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: 'cart',
    defaultOpen: true,
    items: [
      { href: '/admin/pedidos', label: 'Pedidos', icon: 'cart' },
      { href: '/admin/turnos', label: 'Turnos', icon: 'calendar' },
    ],
  },
  {
    id: 'extension',
    label: 'Extensión',
    icon: 'puzzle',
    defaultOpen: false,
    items: [],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: 'megaphone',
    defaultOpen: false,
    items: [],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    icon: 'settings',
    defaultOpen: false,
    items: [],
  },
]

export default function SidebarNav() {
  const pathname = usePathname()
  // Defer active-path to client to avoid SSR/hydration mismatch when usePathname()
  // resolves to the layout path on the server but the full child path on the client.
  const [activePath, setActivePath] = useState<string | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.defaultOpen ?? false])),
  )

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function isActive(href: string) {
    if (!activePath) return false
    if (href === '/admin') return activePath === '/admin'
    return activePath.startsWith(href)
  }

  // Use item.label as key everywhere — labels are unique and avoids collisions
  // when multiple disabled items share href="#".
  function renderItem(item: NavItem) {
    if (item.disabled) {
      return (
        <span
          key={item.label}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#333] cursor-not-allowed"
        >
          <NavIcon name={item.icon} size={15} />
          <span>{item.label}</span>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-[#3a3a3a]">Pronto</span>
        </span>
      )
    }
    const active = isActive(item.href)
    return (
      <Link
        key={item.label}
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          active ? 'bg-[#0eb1c3] text-white' : 'text-[#666] hover:bg-[#2a2a2a] hover:text-white'
        }`}
      >
        <NavIcon name={item.icon} size={15} />
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col" style={{ backgroundColor: '#1E1E1E' }}>
      {/* Logo */}
      <div className="border-b border-[#2a2a2a] px-6 py-5">
        <Image src="/logo.png" alt="Artentino" width={120} height={44} className="object-contain" />
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#444]">Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {/* Standalone items */}
        <div className="mb-2 space-y-0.5">
          {standaloneItems.map(renderItem)}
        </div>

        {/* Collapsible groups */}
        {groups.map((group) => (
          <div key={group.id} className="mb-1">
            <button
              onClick={() => toggle(group.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-black uppercase tracking-widest text-[#555] transition-colors hover:bg-[#2a2a2a] hover:text-[#888]"
            >
              <NavIcon name={group.icon} size={13} />
              <span className="flex-1">{group.label}</span>
              <ChevronIcon open={open[group.id]} />
            </button>

            {open[group.id] && (
              <div className="ml-2 space-y-0.5 border-l border-[#2a2a2a] pl-2 pb-1">
                {group.items.length === 0 ? (
                  <span className="block px-3 py-2 text-xs text-[#3a3a3a] italic">Sin elementos</span>
                ) : (
                  group.items.map(renderItem)
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function NavIcon({ name, size = 17 }: { name: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'dashboard':
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    case 'box':
      return <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
    case 'layers':
      return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    case 'folder':
      return <svg {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
    case 'tag':
      return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
    case 'badge':
      return <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    case 'star':
      return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    case 'upload':
      return <svg {...p}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
    case 'briefcase':
      return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
    case 'cart':
      return <svg {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
    case 'calendar':
      return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    case 'puzzle':
      return <svg {...p}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></svg>
    case 'megaphone':
      return <svg {...p}><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
    case 'settings':
      return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    default:
      return null
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
