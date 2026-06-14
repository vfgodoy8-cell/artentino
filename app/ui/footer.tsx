import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/turnos', label: 'Turnos' },
  { href: '/contacto', label: 'Contacto' },
]

const helpLinks = [
  { href: '/faq#envio', label: 'Envío y seguimiento' },
  { href: '/faq#pago', label: 'Formas de pago' },
  { href: '/faq#registro', label: 'Registro y Compras' },
  { href: '/faq#regalos', label: 'Regalos Corporativos' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1E1E1E' }}>
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Brand + redes */}
          <div>
            <Image src="/logo.png" alt="Artentino" width={130} height={46} className="object-contain" />
            <p className="mt-4 text-sm leading-relaxed text-[#888]">
              Deco, hogar y regalos únicos con diseño argentino. Cuotas sin
              interés y envíos a todo el país.
            </p>

            {/* Redes sociales */}
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://www.instagram.com/artentino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/artentino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.tiktok.com/@artentino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.youtube.com/@artentino_oficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                <YouTubeIcon />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=5491139363333"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-[#555] transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Col 2 — Navegar */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0eb1c3]">
              Navegar
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#555] transition-colors hover:text-[#0eb1c3]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Ayuda */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0eb1c3]">
              Ayuda
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#555] transition-colors hover:text-[#0eb1c3]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0eb1c3]">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[#0eb1c3]">
                  <PinIcon />
                </span>
                <a
                  href="https://maps.app.goo.gl/vYdUfZ1vPTeStfdWA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-relaxed text-[#555] transition-colors hover:text-[#0eb1c3]"
                >
                  Cramer 886 — Av. Federico Lacroze
                  <br />
                  Colegiales, CABA CP 1426
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#0eb1c3]">
                  <WhatsAppIcon />
                </span>
                <a
                  href="https://api.whatsapp.com/send?phone=5491139363333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#555] transition-colors hover:text-[#0eb1c3]"
                >
                  +54 9 11 3936 3333
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#0eb1c3]">
                  <MailIcon />
                </span>
                <a
                  href="mailto:info@artentino.com"
                  className="text-sm text-[#555] transition-colors hover:text-[#0eb1c3]"
                >
                  info@artentino.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#0eb1c3]">
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
            © 2026 Artentino · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacidad" className="text-xs text-[#444] transition-colors hover:text-[#0eb1c3]">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-[#444] transition-colors hover:text-[#0eb1c3]">
              Términos
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-[#444]">
              <LockIcon />
              Compra segura · MercadoPago
            </span>
          </div>
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

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
