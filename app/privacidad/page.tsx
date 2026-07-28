import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Artentino',
  description: 'Cómo Artentino recolecta, usa y protege tus datos personales.',
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-black text-[#1E1E1E]">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  )
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Política de privacidad
          </h1>
          <p className="mt-3 text-gray-500">
            Última actualización: agosto de 2026. Esta política describe cómo Artentino recolecta,
            usa, comparte y protege tus datos personales al navegar o comprar en este sitio.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
        <Block title="1. Responsable del tratamiento">
          <p>
            Artentino (Toque Creativo SRL, CUIT 30716283360) es responsable del tratamiento de los
            datos personales recolectados a través de este sitio, de acuerdo a la Ley 25.326 de
            Protección de Datos Personales y sus normas complementarias.
          </p>
        </Block>

        <Block title="2. Qué datos recolectamos">
          <p>Recolectamos datos que nos proporcionás directamente al usar el sitio, entre ellos:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Datos de contacto: nombre, apellido, email, teléfono.</li>
            <li>Datos de envío: dirección, localidad, provincia, código postal.</li>
            <li>Datos de la cuenta: email y contraseña (encriptada), historial de pedidos y turnos.</li>
            <li>Datos de pago: procesados directamente por MercadoPago — Artentino no almacena números de tarjeta.</li>
            <li>Datos de uso: páginas visitadas, productos vistos, interacciones con el carrito.</li>
          </ul>
        </Block>

        <Block title="3. Para qué usamos tus datos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Procesar y gestionar tus pedidos, pagos y envíos.</li>
            <li>Coordinar turnos de atención presencial o virtual.</li>
            <li>Enviarte notificaciones sobre el estado de tus pedidos y turnos.</li>
            <li>Responder tus consultas de contacto.</li>
            <li>Mejorar el funcionamiento del sitio y la experiencia de compra.</li>
            <li>Cumplir obligaciones legales, impositivas y contables.</li>
          </ul>
        </Block>

        <Block title="4. Con quién compartimos tu información">
          <p>
            No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Compartimos
            información únicamente con proveedores que nos ayudan a operar el servicio, bajo sus
            propias políticas de privacidad y seguridad:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>MercadoPago</strong> — procesamiento de pagos.</li>
            <li><strong>Resend</strong> — envío de emails transaccionales.</li>
            <li><strong>Cloudinary</strong> — almacenamiento de imágenes.</li>
            <li><strong>Vercel / Railway</strong> — hosting de la aplicación y la base de datos.</li>
          </ul>
        </Block>

        <Block title="5. Cookies">
          <p>
            Usamos cookies propias y de terceros para mantener tu sesión iniciada, recordar el
            contenido de tu carrito y entender cómo se usa el sitio. Podés deshabilitar las cookies
            desde la configuración de tu navegador, aunque esto puede afectar algunas funcionalidades
            (como mantener la sesión iniciada o el carrito guardado).
          </p>
        </Block>

        <Block title="6. Tus derechos">
          <p>
            De acuerdo a la Ley 25.326, tenés derecho a acceder, rectificar, actualizar o solicitar la
            supresión de tus datos personales en cualquier momento. La Agencia de Acceso a la
            Información Pública, como Órgano de Control de dicha ley, tiene la atribución de atender
            las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos.
          </p>
          <p>
            Para ejercer estos derechos, escribinos a{' '}
            <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
              info@artentino.com
            </a>
            .
          </p>
        </Block>

        <Block title="7. Seguridad de la información">
          <p>
            Adoptamos medidas técnicas y organizativas razonables para proteger tus datos personales
            contra pérdida, uso indebido o acceso no autorizado. Las contraseñas se almacenan
            encriptadas y nunca en texto plano.
          </p>
        </Block>

        <Block title="8. Cambios a esta política">
          <p>
            Podemos actualizar esta política de privacidad periódicamente. Los cambios entran en
            vigencia desde su publicación en esta página.
          </p>
        </Block>

        <Block title="9. Contacto">
          <p>
            Ante cualquier consulta sobre esta política, escribinos a{' '}
            <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
              info@artentino.com
            </a>{' '}
            o por WhatsApp al{' '}
            <a
              href="https://api.whatsapp.com/send?phone=5491139363333"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: '#0eb1c3' }}
            >
              +54 9 11 3936 3333
            </a>
            .
          </p>
        </Block>
      </div>
    </div>
  )
}
