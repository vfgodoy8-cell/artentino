import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/turnos', label: 'Turnos' },
  { href: '/contacto', label: 'Contacto' },
]

const helpLinks = [
  { href: '/envios', label: 'Envíos' },
  { href: '/formas-de-pago', label: 'Formas de pago' },
  { href: '/faq', label: 'Preguntas frecuentes' },
  { href: '/regalos-corporativos', label: 'Regalos corporativos' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1E1E1E' }}>
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Brand + redes */}
          <div>
            <span
              className="text-3xl leading-none"
              style={{ fontFamily: 'var(--font-script)', color: '#2BBCB0' }}
            >
              Artentino
            </span>
            <p className="mt-4 text-sm leading-relaxed text-[#888]">
              Deco, hogar y regalos únicos con diseño argentino. Cuotas sin
              interés y envíos a todo el país.
            </p>

            {/* Redes sociales */}
            <div className="mt-5 flex gap-2">
              <a
                href="https://instagram.com/artentino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#2BBCB0] hover:text-[#2BBCB0]"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/5491139363333"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#2BBCB0] hover:text-[#2BBCB0]"
              >
                <WhatsAppIcon />
              </a>
              <a
                href="https://facebook.com/artentino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#2BBCB0] hover:text-[#2BBCB0]"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Col 2 — Navegar */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#2BBCB0]">
              Navegar
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#555] transition-colors hover:text-[#2BBCB0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Ayuda */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#2BBCB0]">
              Ayuda
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#555] transition-colors hover:text-[#2BBCB0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#2BBCB0]">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[#2BBCB0]">
                  <PinIcon />
                </span>
                <span className="text-sm leading-relaxed text-[#555]">
                  Cramer 886, Colegiales
                  <br />
                  CABA, Argentina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#2BBCB0]">
                  <PhoneIcon />
                </span>
                <a
                  href="tel:+5491139363333"
                  className="text-sm text-[#555] transition-colors hover:text-[#2BBCB0]"
                >
                  +54 9 11 3936-3333
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#2BBCB0]">
                  <ClockIcon />
                </span>
                <span className="text-sm text-[#555]">
                  Lunes a Viernes 9 a 19hs
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#2a2a2a] py-6 sm:flex-row">
          <p className="text-xs text-[#444]">
            © 2025 Artentino · Todos los derechos reservados
          </p>
          <p className="text-xs text-[#444]">
            🔒 Compra segura · MercadoPago
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ── Iconos ─────────────────────────────────────────────── */

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
