import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Artentino',
  description: 'Condiciones de uso, compra y venta de Artentino.',
}

const sections = [
  {
    title: 'Aceptación de los términos',
    body: 'Contenido pendiente — al usar el sitio o realizar una compra, el usuario acepta estos términos y condiciones.',
  },
  {
    title: 'Precios y disponibilidad',
    body: 'Contenido pendiente — se va a detallar la política de precios, stock y disponibilidad de productos.',
  },
  {
    title: 'Envíos y entregas',
    body: 'Ver detalle completo en la sección de Preguntas Frecuentes → Envíos.',
  },
  {
    title: 'Formas de pago',
    body: 'Contenido pendiente — se va a detallar los medios de pago aceptados y condiciones de facturación.',
  },
  {
    title: 'Cambios y devoluciones',
    body: 'Contenido pendiente — se va a detallar la política de cambios, devoluciones y garantías.',
  },
  {
    title: 'Contacto',
    body: 'Ante cualquier consulta sobre estos términos, escribinos a info@artentino.com.',
  },
]

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Términos y condiciones
          </h1>
          <p className="mt-3 text-gray-500">
            Última actualización: pendiente de definir.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-700">
          Esta página es un placeholder. El texto legal definitivo todavía no fue cargado.
        </div>

        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-2 font-black text-[#1E1E1E]">{s.title}</h2>
            <p className="text-sm leading-relaxed text-gray-600">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
