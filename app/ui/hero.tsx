import Link from 'next/link'

const stats = [
  { value: '500+', label: 'Productos' },
  { value: '6x', label: 'Sin interés' },
  { value: 'Todo el país', label: 'Envíos' },
]

export default function Hero() {
  return (
    <section
      className="w-full px-4 py-20 text-center sm:py-28"
      style={{ backgroundColor: '#1E1E1E' }}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]"
          style={{ color: '#2BBCB0' }}
        >
          Arte · Diseño · Hogar
        </p>
        <h1 className="mb-5 text-4xl font-black leading-[1.1] text-white sm:text-6xl">
          Deco, hogar y
          <br className="hidden sm:block" /> regalos únicos
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-white/50">
          Descubrí piezas únicas para tu hogar. Envíos a todo el país, cuotas
          sin interés y showroom en Colegiales CABA.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalogo"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg px-8 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 sm:w-auto"
            style={{ backgroundColor: '#2BBCB0' }}
          >
            Ver catálogo
          </Link>
          <Link
            href="/turnos"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/20 px-8 text-sm font-black uppercase tracking-widest text-white/70 transition-colors hover:border-[#2BBCB0] hover:text-[#2BBCB0] sm:w-auto"
          >
            Reservar turno
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex justify-center divide-x divide-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 first:pl-0 last:pr-0 sm:px-10">
              <div className="text-2xl font-black text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
