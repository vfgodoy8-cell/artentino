'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/app/context/cart-context'
import { logout } from '@/app/actions/auth'
import CartDrawer from './cart-drawer'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/turnos', label: 'Turnos' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { getItemCount } = useCart()
  const { data: session } = useSession()
  const pathname = usePathname()
  const cartCount = getItemCount()
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const firstName = session?.user?.name?.split(' ')[0] ?? ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="Artentino" width={140} height={50} className="object-contain" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#0eb1c3] ${
                    isActive(link.href) ? 'text-[#0eb1c3]' : 'text-[#1E1E1E]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* User button — desktop */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                {session?.user ? (
                  <>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-black text-[#1E1E1E] transition-[transform,color,border-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:border-[#0eb1c3] hover:text-[#0eb1c3] active:scale-[0.97]"
                    >
                      <UserIcon />
                      {firstName}
                      <ChevronIcon open={dropdownOpen} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">Mi cuenta</p>
                          <p className="mt-0.5 truncate text-sm font-bold text-[#1E1E1E]">{session.user.name}</p>
                        </div>
                        <nav className="py-1">
                          {(session.user as { role?: string }).role === 'ADMIN' && (
                            <DropdownLink href="/admin" onClick={() => setDropdownOpen(false)}>
                              <span className="mr-2.5 text-[#0eb1c3]"><GearIcon /></span>
                              Administración
                            </DropdownLink>
                          )}
                          <DropdownLink href="/perfil" onClick={() => setDropdownOpen(false)}>
                            Mi perfil
                          </DropdownLink>
                          <DropdownLink href="/perfil/pedidos" onClick={() => setDropdownOpen(false)}>
                            Mis pedidos
                          </DropdownLink>
                        </nav>
                        <div className="border-t border-gray-100 py-1">
                          <form action={logout}>
                            <button
                              type="submit"
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                            >
                              <LogoutIcon />
                              Cerrar sesión
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-black text-[#1E1E1E] transition-[transform,color,border-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:border-[#0eb1c3] hover:text-[#0eb1c3] active:scale-[0.97]"
                  >
                    Ingresar
                  </Link>
                )}
              </div>

              {/* Cart */}
              <button
                aria-label="Ver carrito"
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#0eb1c3] text-white transition-[transform,background-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:bg-[#0ca3b4] active:scale-[0.90]"
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                    style={{ backgroundColor: '#1E1E1E' }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile only) */}
              <button
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
              >
                <span className={`block h-px w-6 bg-[#1E1E1E] transition-transform duration-200 ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
                <span className={`block h-px w-6 bg-[#1E1E1E] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px w-6 bg-[#1E1E1E] transition-transform duration-200 ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="border-t border-gray-100 bg-white px-6 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center border-b border-gray-50 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#0eb1c3] last:border-0 ${
                  isActive(link.href) ? 'text-[#0eb1c3]' : 'text-[#1E1E1E]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile user section */}
            <div className="border-t border-gray-100 pt-2">
              {session?.user ? (
                <>
                  {(session.user as { role?: string }).role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 border-b border-gray-50 py-4 text-sm font-bold uppercase tracking-widest text-[#0eb1c3] transition-colors hover:text-[#0eb1c3]"
                    >
                      <GearIcon />
                      Administración
                    </Link>
                  )}
                  <Link
                    href="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center border-b border-gray-50 py-4 text-sm font-bold uppercase tracking-widest text-[#1E1E1E] transition-colors hover:text-[#0eb1c3]"
                  >
                    Mi perfil
                  </Link>
                  <Link
                    href="/perfil/pedidos"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center border-b border-gray-50 py-4 text-sm font-bold uppercase tracking-widest text-[#1E1E1E] transition-colors hover:text-[#0eb1c3]"
                  >
                    Mis pedidos
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center py-4 text-sm font-bold uppercase tracking-widest text-red-500"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center py-4 text-sm font-bold uppercase tracking-widest text-[#0eb1c3]"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-4 py-2.5 text-sm font-bold text-[#1E1E1E] transition-colors hover:bg-gray-50 hover:text-[#0eb1c3]"
    >
      {children}
    </Link>
  )
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
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
      strokeWidth="3"
      strokeLinecap="round"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
