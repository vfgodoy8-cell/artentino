import Link from 'next/link'

const benefits = [
  {
    label: 'Envíos',
    desc: 'a todo el país',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Calidad',
    desc: 'premium',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: 'Cuotas',
    desc: 'sin interés',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Asesoramiento',
    desc: 'personalizado',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export default function Hero() {
  return (
    <section className="grid bg-white lg:min-h-[540px] lg:grid-cols-[46%_54%]">

      {/* Left — text */}
      <div className="flex flex-col justify-center px-8 py-14 sm:px-12 lg:py-16 lg:pl-14 lg:pr-10">

        {/* Eyebrow */}
        <div className="mb-[18px] flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#0eb1c3]">
          Arte
          <span className="h-1 w-1 rounded-full bg-[#0eb1c3] opacity-50" />
          Diseño
          <span className="h-1 w-1 rounded-full bg-[#0eb1c3] opacity-50" />
          Hogar
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-[-0.02em] text-[#1E1E1E] sm:text-5xl">
          Espacios que<br />
          <span className="italic text-[#0eb1c3]">reflejan</span> tu estilo
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-[340px] text-[15px] leading-[1.65] text-[#6b7280]">
          Espejos LED, muebles y deco que transforman cada rincón de tu hogar.
          Cuotas sin interés, envíos a todo el país.
        </p>

        {/* CTAs */}
        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/catalogo"
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#0eb1c3] px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0a8f9e]"
          >
            Ver catálogo
          </Link>
          <Link
            href="/catalogo?categoria=espejos-led"
            className="inline-flex h-12 items-center justify-center rounded-[10px] border-[1.5px] border-[#e5e7eb] px-7 text-xs font-black uppercase tracking-[0.12em] text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
          >
            Ver espejos LED
          </Link>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-5">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[#f0fdfc] text-[#0eb1c3]">
                {b.icon}
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-[9px] font-black uppercase leading-none tracking-[0.12em] text-[#1E1E1E]">
                  {b.label}
                </span>
                <span className="text-[9px] leading-[1.3] text-[#9ca3af]">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — image + floating cards */}
      <div className="relative min-h-[300px] overflow-hidden lg:min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-product.jpg"
          alt="Deco y hogar Artentino"
          className="h-full w-full object-cover object-center"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.18]" />

        {/* Floating category cards */}
        <div className="absolute bottom-7 right-5 flex flex-col gap-2.5">

          {/* White card — Espejos LED */}
          <Link
            href="/catalogo?categoria=espejos-led"
            className="flex min-w-[210px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#0eb1c3]">
              <MirrorIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-black uppercase tracking-[0.05em] text-[#1E1E1E]">
                Espejos LED
              </span>
              <span className="text-[11px] leading-[1.3] text-[#6b7280]">
                Redondos, rectangulares<br />y a medida
              </span>
            </div>
          </Link>

          {/* Teal card — Muebles y Deco */}
          <Link
            href="/catalogo"
            className="flex min-w-[210px] items-center gap-3 rounded-xl bg-[#0eb1c3] px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <FurnitureIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-black uppercase tracking-[0.05em] text-white">
                Muebles y Deco
              </span>
              <span className="text-[11px] leading-[1.3] text-white/80">
                Diseño funcional para<br />cada ambiente
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

function MirrorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <ellipse cx="12" cy="11" rx="6" ry="7.5" />
      <line x1="12" y1="18.5" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
      <circle cx="12" cy="3.2" r="0.8" fill="#0eb1c3" stroke="none" />
      <circle cx="17.8" cy="6.5" r="0.8" fill="#0eb1c3" stroke="none" />
      <circle cx="6.2" cy="6.5" r="0.8" fill="#0eb1c3" stroke="none" />
    </svg>
  )
}

function FurnitureIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="6" width="14" height="8" rx="2" />
      <rect x="3" y="10" width="3" height="6" rx="1" />
      <rect x="18" y="10" width="3" height="6" rx="1" />
      <line x1="7" y1="14" x2="7" y2="18" />
      <line x1="17" y1="14" x2="17" y2="18" />
    </svg>
  )
}
