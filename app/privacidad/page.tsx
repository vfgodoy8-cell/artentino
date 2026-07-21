import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Artentino',
  description: 'Cómo Artentino recolecta, usa y protege tus datos personales.',
}

const sections = [
  {
    title: 'Qué datos recolectamos',
    body: 'Contenido pendiente — se va a detallar qué información personal se recolecta (nombre, email, teléfono, dirección de envío, datos de pago) y con qué finalidad.',
  },
  {
    title: 'Uso de la información',
    body: 'Contenido pendiente — se va a detallar para qué se usan los datos: procesar pedidos, enviar comunicaciones, mejorar el servicio, etc.',
  },
  {
    title: 'Compartir información con terceros',
    body: 'Contenido pendiente — se va a aclarar qué proveedores externos (MercadoPago, Resend, Cloudinary, etc.) procesan datos en nombre de Artentino.',
  },
  {
    title: 'Tus derechos',
    body: 'Contenido pendiente — se va a detallar cómo acceder, rectificar o eliminar tus datos personales.',
  },
  {
    title: 'Contacto',
    body: 'Ante cualquier consulta sobre privacidad, escribinos a info@artentino.com.',
  },
]

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Política de privacidad
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
