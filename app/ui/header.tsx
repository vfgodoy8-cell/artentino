'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/app/context/cart-context'
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
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="shrink-0 leading-none">
              <span
                className="text-3xl leading-none"
                style={{ fontFamily: 'var(--font-script)', color: '#2BBCB0' }}
              >
                Artentino
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-widest text-[#1E1E1E] transition-colors hover:text-[#2BBCB0]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                aria-label="Ver carrito"
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: '#2BBCB0' }}
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
                <span
                  className={`block h-px w-6 bg-[#1E1E1E] transition-transform duration-200 ${
                    menuOpen ? 'translate-y-[6px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-px w-6 bg-[#1E1E1E] transition-opacity duration-200 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-px w-6 bg-[#1E1E1E] transition-transform duration-200 ${
                    menuOpen ? '-translate-y-[6px] -rotate-45' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? 'max-h-72' : 'max-h-0'
          }`}
        >
          <nav className="border-t border-gray-100 bg-white px-6 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center border-b border-gray-50 py-4 text-sm font-bold uppercase tracking-widest text-[#1E1E1E] transition-colors hover:text-[#2BBCB0] last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}
